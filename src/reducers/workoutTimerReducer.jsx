import { DEFAULT_REST_BETWEEN_PHASE } from "@/constants/workoutTimerDefaults";
import { calculateElapsedSecondsForNext, findBackStepDurations, getCurrentExercise, getCurrentWorkoutProgram, getInitialSeconds, getPhase, isCircuit, isLinear, isSuperset, recalculateElapsedSeconds, restBetweenExerciseForPhase, restBetweenRoundsForCircuit, restBetweenSetsForLinear, restBetweenSetsForSuperset, scheduleRest } from "@/utils/workoutTimerLogic";

export const ACTIONS = {
  START: "START",
  TICK: "TICK",
  START_REST: "START_REST",
  END_REST: "END_REST",
  NEXT_EXERCISE: "NEXT_EXERCISE",
  NEXT_SET: "NEXT_SET",
  NEXT_SUPERSET: "NEXT_SUPERSET",
  NEXT_PHASE: "NEXT_PHASE",
  PAUSE: "PAUSE",
  STOP: "STOP",
  NEXT: "NEXT",
  RESET: "RESET_CURRENT_EXCERCISE",
  RESTART: "RESTART",
  GO_TO_PREVIOUS: "GO_TO_PREVIOUS"
};

export const INITIAL_WORKOUT_STATE = {
  phaseIndex: 0,
  supersetIndex: 0,      // index into phase.groups (for superset)
  exerciseIndex: 0,      // index into exercises array
  setCount: 1,           // active set number for superset groups
  roundCount: 1,         // active round number for circuit phases
  exerciseSetCount: 1,   // NEW: active set number for individual exercises (linear phases)
  seconds: 0,            // remaining seconds on the current step (exercise or rest)
  isRunning: false,
  isResting: false,
  restType: null,        // "betweenExercise" | "betweenSet" (we also use "betweenSet" for between-group/round)
  nextAfterRest: null,   // shape: { resume } - simplified since state changes applied immediately
  elapsedSeconds: 0,      // total time actually ticked so far
  selectedDay: null
};


export function workoutTimerReducer(state, action) {
  // const phase = getPhase(WORKOUT_PHASES, state.phaseIndex);
  switch(action.type) {
    case ACTIONS.START:
      return { ...state, isRunning: true };

    case ACTIONS.PAUSE:
      return { ...state, isRunning: false };

    case ACTIONS.NEXT: {
      return reduceNext(state, getCurrentWorkoutProgram(state.selectedDay).phases);
    }

    case ACTIONS.GO_TO_PREVIOUS:{
      console.log("🔴 PREV - Before:", { 
        elapsedSeconds: state.elapsedSeconds, 
        remainingSeconds: state.seconds,
        exercise: state.exerciseIndex,
        isResting: state.isResting
      });
      const prevResult = reduceGoToPrevious(state, getCurrentWorkoutProgram(state.selectedDay).phases);
      console.log("🔴 PREV - After:", { 
        elapsedSeconds: prevResult.elapsedSeconds, 
        calculatedBy: "recalculateElapsedSeconds function",
        newExercise: prevResult.exerciseIndex,
        newSeconds: prevResult.seconds
      });
      return prevResult;
    }

    case ACTIONS.TICK: {
      const tickResult = reduceTick(state);
      // Only log if elapsed seconds changed (to avoid spam)
      // if (tickResult.elapsedSeconds !== state.elapsedSeconds) {
      //   console.log("⏱️ TICK - Elapsed:", { 
      //     before: state.elapsedSeconds, 
      //     after: tickResult.elapsedSeconds,
      //     seconds: tickResult.seconds,
      //     isResting: tickResult.isResting
      //   });
      // }
      return tickResult;
    }

    case ACTIONS.RESET: {
      const initialSeconds = getInitialSeconds(getCurrentWorkoutProgram(state.selectedDay).phases[state.phaseIndex], state.phaseIndex, state.supersetIndex, state.exerciseIndex);
      return { 
        ...state, 
        seconds: initialSeconds,
        elapsedSeconds: state.elapsedSeconds - (initialSeconds - state.seconds)
      };
    }
    
    case ACTIONS.RESTART:{
      console.log("🔄 RESTART - Resetting elapsed seconds to 0");
      return { 
        ...INITIAL_WORKOUT_STATE, 
        selectedDay: state.selectedDay,
        seconds: getInitialSeconds(getCurrentWorkoutProgram(state.selectedDay).phases[0], 0, 0, 0) 
      };
    }

    default:
      return state;
  }
}

/** Navigation: NEXT */
function reduceNext(state, phases) {
  const phase = getPhase(phases, state.phaseIndex);
  if (!phase) return { ...state, isRunning: false };

  // Calculate elapsed time before any state transitions
  const elapsedTimeToAdd = calculateElapsedSecondsForNext(state, phase);

  // --- Superset (groups/sets) ---
  if (isSuperset(phase)) {
    const group = phase.groups?.[state.supersetIndex];
    const exs = group?.exercises ?? [];

    // within a set → next exercise
    if (state.exerciseIndex < exs.length - 1) {
      const rest = restBetweenExerciseForPhase(phase, state.supersetIndex);
      const nextIdx = state.exerciseIndex + 1;
      const result = scheduleRest(state, rest, {
        phaseIndex: state.phaseIndex,
        supersetIndex: state.supersetIndex,
        setCount: state.setCount,
        exerciseIndex: nextIdx,
        resume: exs[nextIdx]?.duration ?? 0
      }, "betweenExercise");
      return { ...result, elapsedSeconds: state.elapsedSeconds + elapsedTimeToAdd };
    }

    // end of set → next set
    if (state.setCount < (group?.sets ?? 1)) {
      const rest = restBetweenSetsForSuperset(phase, state.supersetIndex);
      const result = scheduleRest(state, rest, {
        phaseIndex: state.phaseIndex,
        supersetIndex: state.supersetIndex,
        setCount: state.setCount + 1,
        exerciseIndex: 0,
        resume: exs[0]?.duration ?? 0
      }, "betweenSet");
      return { ...result, elapsedSeconds: state.elapsedSeconds + elapsedTimeToAdd };
    }

    // end of group → next group
    if (state.supersetIndex < (phase.groups?.length ?? 1) - 1) {
      const nextGroup = phase.groups?.[state.supersetIndex + 1];
      // as per your behavior: reuse restBetweenSets as "between groups"
      const rest = restBetweenSetsForSuperset(phase, state.supersetIndex);
      const result = scheduleRest(state, rest, {
        phaseIndex: state.phaseIndex,
        supersetIndex: state.supersetIndex + 1,
        setCount: 1,
        exerciseIndex: 0,
        resume: nextGroup?.exercises?.[0]?.duration ?? 0
      }, "betweenSet");
      return { ...result, elapsedSeconds: state.elapsedSeconds + elapsedTimeToAdd };
    }
  }

  // --- Circuit (rounds) ---
  if (isCircuit(phase)) {
    const exs = phase.exercises ?? [];

    // inside round → next exercise
    if (state.exerciseIndex < exs.length - 1) {
      const rest = restBetweenExerciseForPhase(phase);
      const nextIdx = state.exerciseIndex + 1;
      const result = scheduleRest(state, rest, {
        phaseIndex: state.phaseIndex,
        exerciseIndex: nextIdx,
        roundCount: state.roundCount,
        resume: exs[nextIdx]?.duration ?? 0
      }, "betweenExercise");
      return { ...result, elapsedSeconds: state.elapsedSeconds + elapsedTimeToAdd };
    }

    // end of round → next round
    if (state.roundCount < (phase.rounds ?? 1)) {
      const rest = restBetweenRoundsForCircuit(phase);
      const result = scheduleRest(state, rest, {
        phaseIndex: state.phaseIndex,
        exerciseIndex: 0,
        roundCount: state.roundCount + 1,
        resume: exs[0]?.duration ?? 0
      }, "betweenSet"); // we reuse betweenSet label for "between rounds"
      return { ...result, elapsedSeconds: state.elapsedSeconds + elapsedTimeToAdd };
    }
  }

  // --- Linear ---
  if (isLinear(phase)) {
    const exs = phase.exercises ?? [];
    const currentExercise = exs[state.exerciseIndex];

    // Check if this exercise has multiple sets
    if (currentExercise?.sets && currentExercise.sets > 1) {
      // within same exercise → next set
      if (state.exerciseSetCount < currentExercise.sets) {
        const rest = restBetweenSetsForLinear(phase);
        const result = scheduleRest(state, rest, {
          phaseIndex: state.phaseIndex,
          exerciseIndex: state.exerciseIndex,
          exerciseSetCount: state.exerciseSetCount + 1,
          resume: currentExercise.duration ?? 0
        }, "betweenSet");
        return { ...result, elapsedSeconds: state.elapsedSeconds + elapsedTimeToAdd };
      }
    }

    // end of exercise → next exercise (or if single-set exercise)
    if (state.exerciseIndex < exs.length - 1) {
      const rest = restBetweenExerciseForPhase(phase);
      const nextIdx = state.exerciseIndex + 1;
      const result = scheduleRest(state, rest, {
        phaseIndex: state.phaseIndex,
        exerciseIndex: nextIdx,
        exerciseSetCount: 1,
        resume: exs[nextIdx]?.duration ?? 0
      }, "betweenExercise");
      return { ...result, elapsedSeconds: state.elapsedSeconds + elapsedTimeToAdd };
    }
  }

  // --- Next Phase ---
  if (state.phaseIndex < phases.length - 1) {
    const currentWorkout = getCurrentWorkoutProgram(state.selectedDay); // Get workout program containing restBetweenPhase
    const nextPhase = phases[state.phaseIndex + 1];
    const restBetweenPhase = currentWorkout?.restBetweenPhase ?? DEFAULT_REST_BETWEEN_PHASE;

    if (isSuperset(nextPhase)) {
      const firstDur = nextPhase.groups?.[0]?.exercises?.[0]?.duration ?? 0;
      const result = scheduleRest(state, restBetweenPhase, {
        phaseIndex: state.phaseIndex + 1,
        supersetIndex: 0,
        setCount: 1,
        exerciseIndex: 0,
        resume: firstDur
      }, "betweenPhase");
      return { ...result, elapsedSeconds: state.elapsedSeconds + elapsedTimeToAdd };
    }

    if (isCircuit(nextPhase)) {
      const firstDur = nextPhase.exercises?.[0]?.duration ?? 0;
      const result = scheduleRest(state, restBetweenPhase, {
        phaseIndex: state.phaseIndex + 1,
        exerciseIndex: 0,
        roundCount: 1,
        resume: firstDur
      }, "betweenPhase");
      return { ...result, elapsedSeconds: state.elapsedSeconds + elapsedTimeToAdd };
    }

    // linear
    const firstDur = nextPhase.exercises?.[0]?.duration ?? 0;
    const result = scheduleRest(state, restBetweenPhase, {
      phaseIndex: state.phaseIndex + 1,
      exerciseIndex: 0,
      exerciseSetCount: 1,
      resume: firstDur
    }, "betweenPhase");
    return { ...result, elapsedSeconds: state.elapsedSeconds + elapsedTimeToAdd };
  }

  // End of workout
  return { ...state, isRunning: false, elapsedSeconds: state.elapsedSeconds + elapsedTimeToAdd };
}

/** Navigation: PREVIOUS (with elapsedSeconds rollback) */
function reduceGoToPrevious(state, phases, isInRestingPrev = false) {
  const phase = getPhase(phases, state.phaseIndex);
  if (!phase) return state;

  // If currently resting, cancel rest and restore current exercise duration
  if (state.isResting) {
    const cleared = {
      ...state,
      isResting: false,
      restType: null,
      nextAfterRest: null,
    };
    return reduceGoToPrevious(cleared, phases, true);
  }

  // Compute what to subtract from elapsedSeconds for this back step
  const backDur = findBackStepDurations(state, phase, phases);
  const newElapsed = recalculateElapsedSeconds(state.seconds, state.elapsedSeconds, isInRestingPrev, backDur);

  // Superset cases
  if (isSuperset(phase)) {
    const group = phase.groups?.[state.supersetIndex];
    const exs = group?.exercises ?? [];

    if (state.exerciseIndex > 0) {
      const newIdx = state.exerciseIndex - 1;
      return {
        ...state,
        exerciseIndex: newIdx,
        seconds: exs[newIdx]?.duration ?? 0,
        elapsedSeconds: newElapsed
      };
    }

    if (state.setCount > 1) {
      const lastIdx = exs.length - 1;
      return {
        ...state,
        setCount: state.setCount - 1,
        exerciseIndex: lastIdx,
        seconds: exs[lastIdx]?.duration ?? 0,
        elapsedSeconds: newElapsed
      };
    }

    if (state.supersetIndex > 0) {
      const prevGroup = phase.groups?.[state.supersetIndex - 1];
      const lastIdx = (prevGroup?.exercises?.length ?? 1) - 1;
      return {
        ...state,
        supersetIndex: state.supersetIndex - 1,
        setCount: prevGroup?.sets ?? 1,
        exerciseIndex: lastIdx,
        seconds: prevGroup?.exercises?.[lastIdx]?.duration ?? 0,
        elapsedSeconds: newElapsed
      };
    }
  }

  // Circuit cases
  if (isCircuit(phase)) {
    const exs = phase.exercises ?? [];

    if (state.exerciseIndex > 0) {
      const newIdx = state.exerciseIndex - 1;
      return {
        ...state,
        exerciseIndex: newIdx,
        seconds: exs[newIdx]?.duration ?? 0,
        elapsedSeconds: newElapsed
      };
    }

    if (state.roundCount > 1) {
      const lastIdx = (exs.length ?? 1) - 1;
      return {
        ...state,
        roundCount: state.roundCount - 1,
        exerciseIndex: lastIdx,
        seconds: exs[lastIdx]?.duration ?? 0,
        elapsedSeconds: newElapsed
      };
    }
  }

  // Linear cases
  if (isLinear(phase)) {
    const exs = phase.exercises ?? [];
    const currentExercise = exs[state.exerciseIndex];

    // within same exercise → previous set (only if exercise has multiple sets)
    if (currentExercise?.sets && currentExercise.sets > 1 && state.exerciseSetCount > 1) {
      return {
        ...state,
        exerciseSetCount: state.exerciseSetCount - 1,
        seconds: currentExercise.duration ?? 0,
        elapsedSeconds: newElapsed
      };
    }

    // first set of exercise (or single-set exercise) → previous exercise
    if (state.exerciseIndex > 0) {
      const newIdx = state.exerciseIndex - 1;
      const prevExercise = exs[newIdx];
      return {
        ...state,
        exerciseIndex: newIdx,
        exerciseSetCount: prevExercise?.sets ?? 1,
        seconds: prevExercise?.duration ?? 0,
        elapsedSeconds: newElapsed
      };
    }
  }

  // Previous PHASE
  if (state.phaseIndex > 0) {
    const prevPhase = phases[state.phaseIndex - 1];

    if (isSuperset(prevPhase)) {
      const lastGroupIdx = (prevPhase.groups?.length ?? 1) - 1;
      const lastGroup = prevPhase.groups?.[lastGroupIdx];
      const lastIdx = (lastGroup?.exercises?.length ?? 1) - 1;

      return {
        ...state,
        phaseIndex: state.phaseIndex - 1,
        supersetIndex: lastGroupIdx,
        setCount: lastGroup?.sets ?? 1,
        exerciseIndex: lastIdx,
        seconds: lastGroup?.exercises?.[lastIdx]?.duration ?? 0,
        elapsedSeconds: newElapsed
      };
    }

    if (isCircuit(prevPhase)) {
      const lastIdx = (prevPhase.exercises?.length ?? 1) - 1;
      const rounds = prevPhase.rounds ?? 1;
      return {
        ...state,
        phaseIndex: state.phaseIndex - 1,
        roundCount: rounds,
        exerciseIndex: lastIdx,
        seconds: prevPhase.exercises?.[lastIdx]?.duration ?? 0,
        elapsedSeconds: newElapsed
      };
    }

    // linear
    const lastIdx = (prevPhase.exercises?.length ?? 1) - 1;
    const lastExercise = prevPhase.exercises?.[lastIdx];
    return {
      ...state,
      phaseIndex: state.phaseIndex - 1,
      exerciseIndex: lastIdx,
      exerciseSetCount: lastExercise?.sets ?? 1,
      seconds: lastExercise?.duration ?? 0,
      elapsedSeconds: newElapsed
    };
  }

  // Already at very start
  return state;
}

/** Navigation: TICK */
function reduceTick(state) {
  if (!state.isRunning) return state;

  // Rest countdown
  if (state.isResting) {
    if (state.seconds > 1) {
      return {
        ...state,
        seconds: state.seconds - 1,
        elapsedSeconds: state.elapsedSeconds + 1
      };
    }
    // Rest finished → restore exercise duration
    const next = state.nextAfterRest ?? {};

    return {
      ...state,
      isResting: false,
      restType: null,
      nextAfterRest: null,
      seconds: next.resume ?? 0,
      elapsedSeconds: state.elapsedSeconds + 1 // the final second of rest also elapsed
    };
  }

  // Exercise countdown
  if (state.seconds > 0) {
    return {
      ...state,
      seconds: state.seconds - 1,
      elapsedSeconds: state.elapsedSeconds + 1
    };
  }

  // Move to next step when exercise hits 0
  return reduceNext(state, getCurrentWorkoutProgram(state.selectedDay).phases);
}

