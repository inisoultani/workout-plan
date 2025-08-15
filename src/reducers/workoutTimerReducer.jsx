import { DEFAULT_REST_BETWEEN_EXERCISE, DEFAULT_REST_BETWEEN_EXERCISE_IN_SET, DEFAULT_REST_BETWEEN_ROUNDS, DEFAULT_REST_BETWEEN_SET, WORKOUT_PHASES } from "@/constants/workoutTimerDefaults";
import { getCurrentExercise, getInitialSeconds, getPhase, isCircuit, isLinear, isSuperset, recalculateElapsedSeconds } from "@/utils/workoutTimerLogic";

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
  elapsedSeconds: 0      // total time actually ticked so far
};


export function workoutTimerReducer(state, action) {
  const phase = getPhase(WORKOUT_PHASES, state.phaseIndex);
  switch(action.type) {
    case ACTIONS.START:
      return { ...state, isRunning: true };

    case ACTIONS.PAUSE:
      return { ...state, isRunning: false };

    case ACTIONS.NEXT:
      return reduceNext(state, WORKOUT_PHASES);

    case ACTIONS.GO_TO_PREVIOUS:
      return reduceGoToPrevious(state, WORKOUT_PHASES);

    case ACTIONS.TICK: 
      return reduceTick(state);

    //  case ACTIONS.NEXT:
    //   return {
    //     ...state,
    //     elapsedSeconds: state.elapsedSeconds + state.seconds,
    //     seconds: 0

    //   };

    case ACTIONS.RESET: {
      const initialSeconds = getInitialSeconds(WORKOUT_PHASES[state.phaseIndex], state.phaseIndex, state.supersetIndex, state.exerciseIndex);
      return { 
        ...state, 
        seconds: initialSeconds,
        elapsedSeconds: state.elapsedSeconds - (initialSeconds - state.seconds)
      };
    }
    case ACTIONS.RESTART:
      return { 
        ...INITIAL_WORKOUT_STATE, 
        seconds: getInitialSeconds(workoutPhases[0], 0, 0, 0) 
      };

    default:
      return state;
  }
}


// ===== Navigation: NEXT =====
function reduceNext(state, phases) {
  const phase = getPhase(phases, state.phaseIndex);
  if (!phase) return { ...state, isRunning: false };

  // --- Superset (groups/sets) ---
  if (isSuperset(phase)) {
    const group = phase.groups?.[state.supersetIndex];
    const exs = group?.exercises ?? [];

    // within a set → next exercise
    if (state.exerciseIndex < exs.length - 1) {
      const rest = restBetweenExerciseForPhase(phase, state.supersetIndex);
      const nextIdx = state.exerciseIndex + 1;
      return scheduleRest(state, rest, {
        phaseIndex: state.phaseIndex,
        supersetIndex: state.supersetIndex,
        setCount: state.setCount,
        exerciseIndex: nextIdx,
        resume: exs[nextIdx]?.duration ?? 0
      }, "betweenExercise");
    }

    // end of set → next set
    if (state.setCount < (group?.sets ?? 1)) {
      const rest = restBetweenSetsForSuperset(phase, state.supersetIndex);
      return scheduleRest(state, rest, {
        phaseIndex: state.phaseIndex,
        supersetIndex: state.supersetIndex,
        setCount: state.setCount + 1,
        exerciseIndex: 0,
        resume: exs[0]?.duration ?? 0
      }, "betweenSet");
    }

    // end of group → next group
    if (state.supersetIndex < (phase.groups?.length ?? 1) - 1) {
      const nextGroup = phase.groups?.[state.supersetIndex + 1];
      // as per your behavior: reuse restBetweenSets as "between groups"
      const rest = restBetweenSetsForSuperset(phase, state.supersetIndex);
      return scheduleRest(state, rest, {
        phaseIndex: state.phaseIndex,
        supersetIndex: state.supersetIndex + 1,
        setCount: 1,
        exerciseIndex: 0,
        resume: nextGroup?.exercises?.[0]?.duration ?? 0
      }, "betweenSet");
    }
  }

  // --- Circuit (rounds) ---
  if (isCircuit(phase)) {
    const exs = phase.exercises ?? [];

    // inside round → next exercise
    if (state.exerciseIndex < exs.length - 1) {
      const rest = restBetweenExerciseForPhase(phase);
      const nextIdx = state.exerciseIndex + 1;
      return scheduleRest(state, rest, {
        phaseIndex: state.phaseIndex,
        exerciseIndex: nextIdx,
        roundCount: state.roundCount,
        resume: exs[nextIdx]?.duration ?? 0
      }, "betweenExercise");
    }

    // end of round → next round
    if (state.roundCount < (phase.rounds ?? 1)) {
      const rest = restBetweenRoundsForCircuit(phase);
      return scheduleRest(state, rest, {
        phaseIndex: state.phaseIndex,
        exerciseIndex: 0,
        roundCount: state.roundCount + 1,
        resume: exs[0]?.duration ?? 0
      }, "betweenSet"); // we reuse betweenSet label for "between rounds"
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
        return scheduleRest(state, rest, {
          phaseIndex: state.phaseIndex,
          exerciseIndex: state.exerciseIndex,
          exerciseSetCount: state.exerciseSetCount + 1,
          resume: currentExercise.duration ?? 0
        }, "betweenSet");
      }
    }

    // end of exercise → next exercise (or if single-set exercise)
    if (state.exerciseIndex < exs.length - 1) {
      const rest = restBetweenExerciseForPhase(phase);
      const nextIdx = state.exerciseIndex + 1;
      return scheduleRest(state, rest, {
        phaseIndex: state.phaseIndex,
        exerciseIndex: nextIdx,
        exerciseSetCount: 1,
        resume: exs[nextIdx]?.duration ?? 0
      }, "betweenExercise");
    }
  }

  // --- Next Phase ---
  if (state.phaseIndex < phases.length - 1) {
    const nextPhase = phases[state.phaseIndex + 1];

    if (isSuperset(nextPhase)) {
      const firstDur = nextPhase.groups?.[0]?.exercises?.[0]?.duration ?? 0;
      return {
        ...state,
        phaseIndex: state.phaseIndex + 1,
        supersetIndex: 0,
        setCount: 1,
        exerciseIndex: 0,
        seconds: firstDur
      };
    }

    if (isCircuit(nextPhase)) {
      const firstDur = nextPhase.exercises?.[0]?.duration ?? 0;
      return {
        ...state,
        phaseIndex: state.phaseIndex + 1,
        exerciseIndex: 0,
        roundCount: 1,
        seconds: firstDur
      };
    }

    // linear
    const firstDur = nextPhase.exercises?.[0]?.duration ?? 0;
    return {
      ...state,
      phaseIndex: state.phaseIndex + 1,
      exerciseIndex: 0,
      exerciseSetCount: 1,
      seconds: firstDur
    };
  }

  // End of workout
  return { ...state, isRunning: false };
}

// ===== Navigation: PREVIOUS (with elapsedSeconds rollback) =====
function reduceGoToPrevious(state, phases, isInRestingPrev = false) {
  const phase = getPhase(phases, state.phaseIndex);
  if (!phase) return state;

  // If currently resting, cancel rest and restore current exercise duration
  if (state.isResting) {
    const currentExercise = getCurrentExercise(state, phase);
    const cleared = {
      ...state,
      isResting: false,
      restType: null,
      nextAfterRest: null,
      seconds: currentExercise?.duration ?? 0  // Restore current exercise duration
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
  return reduceNext(state, WORKOUT_PHASES);
}

function getCurrentExerciseDuration(state, phase) {
  const currentExercise = getCurrentExercise(state, phase);
  return currentExercise?.duration ?? 0;
}

// Rest getters (with defaults)
function restBetweenExerciseForPhase(phase, groupIdx) {
  if (isSuperset(phase)) {
    return phase.groups?.[groupIdx]?.restBetweenExercise ?? DEFAULT_REST_BETWEEN_EXERCISE_IN_SET;
  }
  if (isCircuit(phase)) {
    return phase.restBetweenExercise ?? DEFAULT_REST_BETWEEN_EXERCISE;
  }
  // linear
  return phase.restBetweenExercise ?? DEFAULT_REST_BETWEEN_EXERCISE;
}

function restBetweenSetsForSuperset(phase, groupIdx) {
  // also used as "between groups" rest (your earlier behavior)
  return phase.groups?.[groupIdx]?.restBetweenSets ?? DEFAULT_REST_BETWEEN_SET;
}

function restBetweenRoundsForCircuit(phase) {
  return phase.restBetweenRounds ?? DEFAULT_REST_BETWEEN_ROUNDS;
}

function restBetweenSetsForLinear(phase) {
  return phase.restBetweenSets ?? DEFAULT_REST_BETWEEN_SET;
}

// ===== Utility: schedule a rest or jump directly if rest=0 =====
function scheduleRest(state, restDuration, nextAfterRest, restTypeFallback = "betweenSet") {
  if (restDuration > 0) {
    // betweenSet covers: between-sets / between-groups / between-rounds
    const inferredType =
      nextAfterRest.exerciseIndex === 0 ? "betweenSet" : "betweenExercise";

    // FIXED: Apply the next state immediately, store only the resume duration
    return {
      ...state,
      ...nextAfterRest,  // Apply all the next state changes immediately
      isResting: true,
      restType: inferredType ?? restTypeFallback,
      seconds: restDuration,
      nextAfterRest: { resume: nextAfterRest.resume }  // Only store the resume duration
    };
  }
  // no rest → immediate transition
  return { ...state, ...nextAfterRest };
}

// ===== Build the durations needed to back-step from current position =====
function findBackStepDurations(state, currentPhase, phases) {
  const { exerciseIndex, setCount, supersetIndex, roundCount, phaseIndex } = state;

  // ---- Superset (groups/sets) ----
  if (isSuperset(currentPhase)) {
    const group = currentPhase.groups?.[supersetIndex];
    const exs = group?.exercises ?? [];

    // within the same set, going to previous exercise
    if (exerciseIndex > 0) {
      const prevIdx = exerciseIndex - 1;
      const restDuration = restBetweenExerciseForPhase(currentPhase, supersetIndex);
      return {
        restDuration,
        currentDuration: exs[exerciseIndex]?.duration ?? 0,
        prevDuration: exs[prevIdx]?.duration ?? 0
      };
    }

    // first exercise of a set but not the first set → go to last exercise of previous set
    if (setCount > 1) {
      const lastIdx = exs.length - 1;
      const restDuration = restBetweenSetsForSuperset(currentPhase, supersetIndex);
      return {
        restDuration,
        currentDuration: exs[exerciseIndex]?.duration ?? 0,
        prevDuration: exs[lastIdx]?.duration ?? 0
      };
    }

    // first set of a group but not the first group → go to last exercise of last set of previous group
    if (supersetIndex > 0) {
      const prevGroup = currentPhase.groups?.[supersetIndex - 1];
      const lastIdx = (prevGroup?.exercises?.length ?? 1) - 1;
      const restDuration = restBetweenSetsForSuperset(currentPhase, supersetIndex - 1); // rest taken after prev group
      return {
        restDuration,
        currentDuration: (group?.exercises?.[exerciseIndex]?.duration) ?? 0,
        prevDuration: prevGroup?.exercises?.[lastIdx]?.duration ?? 0
      };
    }
  }

  // ---- Circuit (rounds) ----
  if (isCircuit(currentPhase)) {
    const exs = currentPhase.exercises ?? [];

    // within a round → previous exercise
    if (exerciseIndex > 0) {
      const prevIdx = exerciseIndex - 1;
      const restDuration = restBetweenExerciseForPhase(currentPhase);
      return {
        restDuration,
        currentDuration: exs[exerciseIndex]?.duration ?? 0,
        prevDuration: exs[prevIdx]?.duration ?? 0
      };
    }

    // first exercise of a round but not the first round → go to last exercise of previous round
    if (roundCount > 1) {
      const lastIdx = exs.length - 1;
      const restDuration = restBetweenRoundsForCircuit(currentPhase);
      return {
        restDuration,
        currentDuration: exs[exerciseIndex]?.duration ?? 0,
        prevDuration: exs[lastIdx]?.duration ?? 0
      };
    }
  }

  // ---- Linear ----
  if (isLinear(currentPhase)) {
    const exs = currentPhase.exercises ?? [];
    const currentExercise = exs[exerciseIndex];

    // within same exercise → previous set (only for multi-set exercises)
    if (currentExercise?.sets && currentExercise.sets > 1 && state.exerciseSetCount > 1) {
      const restDuration = restBetweenSetsForLinear(currentPhase);
      return {
        restDuration,
        currentDuration: currentExercise.duration ?? 0,
        prevDuration: currentExercise.duration ?? 0
      };
    }

    // first set of exercise (or single-set exercise) → previous exercise
    if (exerciseIndex > 0) {
      const prevIdx = exerciseIndex - 1;
      const prevExercise = exs[prevIdx];
      const restDuration = restBetweenExerciseForPhase(currentPhase);
      return {
        restDuration,
        currentDuration: currentExercise?.duration ?? 0,
        prevDuration: prevExercise?.duration ?? 0
      };
    }
  }

  // ---- Fallback to previous PHASE ----
  if (phaseIndex > 0) {
    const prevPhase = phases[phaseIndex - 1];
    const currentFirstDuration = getCurrentExerciseDuration(
      { ...state, exerciseIndex: 0, supersetIndex: 0 }, // first exercise in current phase
      currentPhase
    );

    if (isSuperset(prevPhase)) {
      const lastGroupIdx = (prevPhase.groups?.length ?? 1) - 1;
      const lastGroup = prevPhase.groups?.[lastGroupIdx];
      const lastIdx = (lastGroup?.exercises?.length ?? 1) - 1;
      return {
        restDuration: 0, // you said no rest between phases
        currentDuration: currentFirstDuration ?? 0,
        prevDuration: lastGroup?.exercises?.[lastIdx]?.duration ?? 0
      };
    }

    if (isCircuit(prevPhase)) {
      const lastIdx = (prevPhase.exercises?.length ?? 1) - 1;
      return {
        restDuration: 0,
        currentDuration: currentFirstDuration ?? 0,
        prevDuration: prevPhase.exercises?.[lastIdx]?.duration ?? 0
      };
    }

    // linear
    const lastIdx = (prevPhase.exercises?.length ?? 1) - 1;
    return {
      restDuration: 0,
      currentDuration: currentFirstDuration ?? 0,
      prevDuration: prevPhase.exercises?.[lastIdx]?.duration ?? 0
    };
  }

  // now at very beginning; nothing to subtract
  return { restDuration: 0, currentDuration: 0, prevDuration: 0 };
}