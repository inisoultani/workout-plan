import { DEFAULT_REST_BETWEEN_EXERCISE, DEFAULT_REST_BETWEEN_EXERCISE_IN_SET, DEFAULT_REST_BETWEEN_SET } from "@/constants/workoutTimerDefaults";
import { WorkoutPrograms } from "@/data/workouts";
import { getInitialSeconds } from "@/utils/workoutTimerLogic";

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
  RESET: "RESET_CURRENT_EXCERCISE"
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
  elapsedSeconds: 0,
  workoutPhases: []
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
    case ACTIONS.RESET:
      return { 
        ...state, 
        seconds: getInitialSeconds(state.workoutPhases, state.phaseIndex, state.supersetIndex, state.exerciseIndex) 
      };
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
  let currentPhase = newState.workoutPhases[newState.phaseIndex];
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
    if (nextPhaseIndex < newState.workoutPhases.length) {
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
    if (nextPhaseIndex < newState.workoutPhases.length) {
      currentPhase = newState.workoutPhases[nextPhaseIndex];
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