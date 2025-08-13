import { DEFAULT_REST_BETWEEN_EXERCISE, DEFAULT_REST_BETWEEN_EXERCISE_IN_SET, DEFAULT_REST_BETWEEN_SET, WORKOUT_PHASES } from "@/constants/workoutTimerDefaults";
import { getInitialSeconds, isSupersetPhase, recalculateElapsedSeconds } from "@/utils/workoutTimerLogic";

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
  supersetIndex: 0,
  exerciseIndex: 0,
  setCount: 1,
  seconds: 0,
  isRunning: false,
  isResting: false,
  restType: null,
  nextAfterRest: null,
  elapsedSeconds: 0
};

// Helper: get rest duration with default
function getRestValue(value, fallback) {
  return value ?? fallback;
}

export function workoutTimerReducer(state, action) {
  switch(action.type) {
    case ACTIONS.START:
      return { 
        ...state, 
        isRunning: true, 
        // seconds: action.seconds 
      };
    case ACTIONS.TICK: {
      return reduceTick(state)
    }
    case ACTIONS.START_REST:
      return {
        ...state,
        isResting: true,
        restType: action.restType,
        seconds: action.seconds,
        nextAfterRest: action.nextAfterRest
      };
    case ACTIONS.END_REST:
      return {
        ...state,
        isResting: false,
        restType: null,
        nextAfterRest: null,
        seconds: action.seconds
      };
     case ACTIONS.NEXT:
      return {
        ...state,
        elapsedSeconds: state.elapsedSeconds + state.seconds,
        seconds: 0

      };
    case ACTIONS.NEXT_EXERCISE:
      return {
        ...state,
        exerciseIndex: action.exerciseIndex,
        seconds: action.seconds
      };
    case ACTIONS.NEXT_SET:
      return {
        ...state,
        setCount: action.setCount,
        exerciseIndex: 0,
        seconds: action.seconds
      };
    case ACTIONS.NEXT_SUPERSET:
      return {
        ...state,
        supersetIndex: action.supersetIndex,
        setCount: 1,
        exerciseIndex: 0,
        seconds: action.seconds
      };
    case ACTIONS.NEXT_PHASE:
      return {
        ...state,
        phaseIndex: action.phaseIndex,
        supersetIndex: 0,
        exerciseIndex: 0,
        setCount: 1,
        seconds: action.seconds
      };
    case ACTIONS.PAUSE:
      return { 
        ...state, 
        isRunning: false, 
      };
    case ACTIONS.STOP:
      return { 
        ...state, 
        isRunning: false, 
        seconds: 0 
      };
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
        ...state, 
        phaseIndex: 0,
        supersetIndex: 0,
        setCount: 1,
        exerciseIndex: 0,
        restType: null,
        isResting: false,
        elapsedSeconds: 0,
        isRunning: true,
        seconds: getInitialSeconds(WORKOUT_PHASES[0], 0, 0, 0) 
      };
    case ACTIONS.GO_TO_PREVIOUS:
      return reduceGoToPrevious(state);
    default:
      return state;
  }
}

function reduceTick(state) {
  let { seconds, isResting, elapsedSeconds, nextAfterRest } = state;
  let newState = { ...state };

  if (seconds > 0) {
    console.log('elapsedSeconds inside TICK : ', elapsedSeconds);
    return {
      ...newState,
      seconds: seconds - 1,
      elapsedSeconds: elapsedSeconds + 1
    };
  }

  // Rest period finished
  if (isResting) {
    newState.isResting = false;
    newState.restType = null;

    if (nextAfterRest) {
      if (nextAfterRest.type === "exercise") {
        newState.exerciseIndex = nextAfterRest.exerciseIndex;
      } else if (nextAfterRest.type === "set") {
        newState.setCount = nextAfterRest.setCount;
        newState.exerciseIndex = 0;
      } else if (nextAfterRest.type === "superset") {
        newState.supersetIndex = nextAfterRest.supersetIndex;
        newState.setCount = 1;
        newState.exerciseIndex = 0;
      }
      newState.seconds = nextAfterRest.resume ?? 0;
      newState.nextAfterRest = null;
      return newState;
    }
  }

  // Workout logic (superset vs flat)
  let currentPhase = WORKOUT_PHASES[newState.phaseIndex];
  if(currentPhase.supersets) {
    // Superset mode
    const currentSuperset = currentPhase.supersets[newState.supersetIndex];
    const nextExerciseIndex = newState.exerciseIndex + 1;

    if (nextExerciseIndex < currentSuperset.exercises.length) {
      return {
        ...newState,
        exerciseIndex: nextExerciseIndex,
        isResting: true,
        restType: "betweenExercise",
        nextAfterRest: {
          type: "exercise",
          exerciseIndex: nextExerciseIndex,
          resume: currentSuperset.exercises[nextExerciseIndex].duration
        },
        seconds: getRestValue(
          currentSuperset.restBetweenExercise,
          DEFAULT_REST_BETWEEN_EXERCISE_IN_SET
        )
      };
    }
    // Between sets
    const nextSetCount = newState.setCount + 1;
    if (nextSetCount <= currentSuperset.sets) {
      return {
        ...newState,
        exerciseIndex: 0,
        setCount: nextSetCount,
        isResting: true,
        restType: "betweenSet",
        nextAfterRest: {
          type: "set",
          setCount: nextSetCount,
          resume: currentSuperset.exercises[0].duration
        },
        seconds: getRestValue(
          currentSuperset.restBetweenSets,
          DEFAULT_REST_BETWEEN_SET
        )
      };
    }

    // Between supersets
    const nextSupersetIndex = newState.supersetIndex + 1;
    if (nextSupersetIndex < currentPhase.supersets.length) {
      return {
        ...newState,
        supersetIndex: nextSupersetIndex,
        exerciseIndex: 0,
        setCount: 1,
        isResting: true,
        restType: "betweenSet",
        nextAfterRest: {
          type: "superset",
          supersetIndex: nextSupersetIndex,
          resume: currentPhase.supersets[nextSupersetIndex].exercises[0].duration
        },
        seconds: getRestValue(
          currentSuperset.restBetweenSets,
          DEFAULT_REST_BETWEEN_SET
        )
      };
    }

    // Move to next phase
    const nextPhaseIndex = newState.phaseIndex + 1;
    if (nextPhaseIndex < WORKOUT_PHASES.length) {
      return {
        ...newState,
        phaseIndex: nextPhaseIndex,
        supersetIndex: 0,
        exerciseIndex: 0,
        setCount: 1,
        seconds: currentPhase.exercises
          ? currentPhase.exercises[0].duration
          : currentPhase.supersets[0].exercises[0].duration
      };
    }

    // Workout finished
    return { ...newState, isRunning: false, seconds: 0 };
  } else {
    // Flat exercise mode
    const nextExerciseIndex = newState.exerciseIndex + 1;
    if (nextExerciseIndex < currentPhase.exercises.length) {
      return {
        ...newState,
        exerciseIndex: nextExerciseIndex,
        isResting: true,
        restType: "betweenExercise",
        nextAfterRest: {
          type: "exercise",
          exerciseIndex: nextExerciseIndex,
          resume: currentPhase.exercises[nextExerciseIndex].duration
        },
        seconds: getRestValue(
          currentPhase.restBetweenExercise,
          DEFAULT_REST_BETWEEN_EXERCISE
        )
      };
    }

    const nextPhaseIndex = newState.phaseIndex + 1;
    if (nextPhaseIndex < WORKOUT_PHASES.length) {
      currentPhase = WORKOUT_PHASES[nextPhaseIndex];
      return {
        ...newState,
        phaseIndex: nextPhaseIndex,
        exerciseIndex: 0,
        seconds: currentPhase.exercises
          ? currentPhase.exercises[0].duration
          : currentPhase.supersets[0].exercises[0].duration
      };
    }

    return { ...newState, isRunning: false, seconds: 0 };
  }
}

function reduceGoToPrevious(state, isInRestingPrev = false) {
  const { isResting, phaseIndex, supersetIndex, exerciseIndex, setCount } = state;
  const currentPhase = WORKOUT_PHASES[phaseIndex];

  // Check if resting go to exercise that causing it
  if (isResting) {
    const newState = { ...state };
    isInRestingPrev = true;
    newState.isResting = false;
    newState.restType = null;
    newState.nextAfterRest = null;
    
    return reduceGoToPrevious(newState, isInRestingPrev);
  }

  // Superset handling
  if (isSupersetPhase(currentPhase)) {
    if (exerciseIndex > 0) {
      const newExerciseIndex = exerciseIndex - 1;
      
      return {
        ...state,
        exerciseIndex: newExerciseIndex,
        seconds: currentPhase.supersets[supersetIndex].exercises[newExerciseIndex].duration,
        elapsedSeconds: recalculateElapsedSeconds(state.seconds, state.elapsedSeconds, isInRestingPrev, findDataDuration(state, currentPhase))
      };
    }

    if (setCount > 1) {
      const previousSet = setCount - 1;
      const lastExerciseIdx = currentPhase.supersets[supersetIndex].exercises.length - 1;
      
      return {
        ...state,
        setCount: previousSet,
        exerciseIndex: lastExerciseIdx,
        seconds: currentPhase.supersets[supersetIndex].exercises[lastExerciseIdx].duration,
        elapsedSeconds: recalculateElapsedSeconds(state.seconds, state.elapsedSeconds, isInRestingPrev, findDataDuration(state, currentPhase))
      };
    }

    if (supersetIndex > 0) {
      const prevSupersetIdx = supersetIndex - 1;
      const prevSuperset = currentPhase.supersets[prevSupersetIdx];
      const lastExerciseIdx = prevSuperset.exercises.length - 1;
      
      return {
        ...state,
        supersetIndex: prevSupersetIdx,
        exerciseIndex: lastExerciseIdx,
        setCount: prevSuperset.sets,
        seconds: prevSuperset.exercises[lastExerciseIdx].duration,
        elapsedSeconds: recalculateElapsedSeconds(state.seconds, state.elapsedSeconds, isInRestingPrev, findDataDuration(state, currentPhase))
      };
    }
  }
  // Normal phase handling
  else {
    if (exerciseIndex > 0) {
      const newExerciseIndex = exerciseIndex - 1;
      return {
        ...state,
        exerciseIndex: newExerciseIndex,
        seconds: currentPhase.exercises[newExerciseIndex].duration,
        elapsedSeconds: recalculateElapsedSeconds(state.seconds, state.elapsedSeconds, isInRestingPrev, findDataDuration(state, currentPhase))
      };
    }
  }

  // Fallback to previous phase
  if (phaseIndex > 0) {
    const prevPhaseIdx = phaseIndex - 1;
    const prevPhase = WORKOUT_PHASES[prevPhaseIdx];

    if (isSupersetPhase(prevPhase)) {
      const lastSupersetIdx = prevPhase.supersets.length - 1;
      const lastSuperset = prevPhase.supersets[lastSupersetIdx];
      const lastExerciseIdx = lastSuperset.exercises.length - 1;
      
      return {
        ...state,
        phaseIndex: prevPhaseIdx,
        supersetIndex: lastSupersetIdx,
        exerciseIndex: lastExerciseIdx,
        setCount: lastSuperset.sets,
        seconds: lastSuperset.exercises[lastExerciseIdx].duration,
        elapsedSeconds: recalculateElapsedSeconds(state.seconds, state.elapsedSeconds, isInRestingPrev, findDataDuration(state, currentPhase))
      };
    } else {
      const lastExerciseIdx = prevPhase.exercises.length - 1;
      return {
        ...state,
        phaseIndex: prevPhaseIdx,
        exerciseIndex: lastExerciseIdx,
        seconds: prevPhase.exercises[lastExerciseIdx].duration,
        elapsedSeconds: recalculateElapsedSeconds(state.seconds, state.elapsedSeconds, isInRestingPrev, findDataDuration(state, currentPhase))
      };
    }
  }

  return state; // no changes
}

function findDataDuration(state, currentPhase) {
  const newState = { ...state };
  if (isSupersetPhase(currentPhase)) {
    // between exercise in a set
    if (state.exerciseIndex > 0) {
      const newExerciseIndex = state.exerciseIndex - 1;
      const restDuration = currentPhase.supersets[state.supersetIndex].restBetweenExercise;      
      return {
        restDuration: restDuration,
        currentDuration: currentPhase.supersets[newState.supersetIndex].exercises[state.exerciseIndex].duration,
        prevDuration: currentPhase.supersets[newState.supersetIndex].exercises[newExerciseIndex].duration
      }
    }

    // between set in a superset
    if (state.setCount > 1) {
      const lastExerciseIdx = currentPhase.supersets[state.supersetIndex].exercises.length - 1;
      const restDuration = currentPhase.supersets[state.supersetIndex].restBetweenSets;
      return {
        restDuration: restDuration, 
        currentDuration: currentPhase.supersets[state.supersetIndex].exercises[state.exerciseIndex].duration,
        prevDuration: currentPhase.supersets[state.supersetIndex].exercises[lastExerciseIdx].duration
      };
    }

    // between superset
    if (state.supersetIndex > 0) {
      const prevSupersetIdx = state.supersetIndex - 1;
      const prevSuperset = currentPhase.supersets[prevSupersetIdx];
      const lastExerciseIdx = prevSuperset.exercises.length - 1;
      const restDuration = prevSuperset.restBetweenSets;
      return {
        restDuration: restDuration, 
        currentDuration: currentPhase.supersets[state.supersetIndex].exercises[state.exerciseIndex].duration,
        prevDuration: prevSuperset.exercises[lastExerciseIdx].duration
      };
    }
  } else {
    // between exercise in a flat exercise
    if (state.exerciseIndex > 0) { 
      const newExerciseIndex = state.exerciseIndex - 1;
      const restDuration = currentPhase.restBetweenExercise;
      return {
        restDuration: restDuration, 
        currentDuration: currentPhase.exercises[state.exerciseIndex].duration,
        prevDuration: currentPhase.exercises[newExerciseIndex].duration
      };
    }
  }

  // Fallback to previous phase
  if (state.phaseIndex > 0) {
    const prevPhaseIdx = state.phaseIndex - 1;
    const prevPhase = WORKOUT_PHASES[prevPhaseIdx];
    const restDuration = 0 // since there's no rest between phaseno
    const currentExerciseDuration = isSupersetPhase(currentPhase) ? 
                          currentPhase.supersets[0].exercises[0].duration  :
                          currentPhase.exercises[0].duration
    if (isSupersetPhase(prevPhase)) {
      const lastSupersetIdx = prevPhase.supersets.length - 1;
      const lastSuperset = prevPhase.supersets[lastSupersetIdx];
      const lastExerciseIdx = lastSuperset.exercises.length - 1;
      return {
        restDuration: restDuration, 
        currentDuration: currentExerciseDuration,
        prevDuration: lastSuperset.exercises[lastExerciseIdx].duration
      };
    } else {
      const lastExerciseIdx = prevPhase.exercises.length - 1;
      return {
        restDuration: restDuration, 
        currentDuration: currentExerciseDuration,
        prevDuration: prevPhase.exercises[lastExerciseIdx].duration
      };
    }
  }
  
}