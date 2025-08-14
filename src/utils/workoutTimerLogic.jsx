import { DEFAULT_REST_BETWEEN_EXERCISE, DEFAULT_REST_BETWEEN_EXERCISE_IN_SET, DEFAULT_REST_BETWEEN_ROUNDS, DEFAULT_REST_BETWEEN_SET } from "@/constants/workoutTimerDefaults";

// export const isSupersetPhase = (phase) => !!phase.supersets;


// ===== Type guards =====
export function isLinear(phase)   { return phase?.type === "linear"; }
export function isSuperset(phase) { return phase?.type === "superset"; }
export function isCircuit(phase)  { return phase?.type === "circuit"; }

// ===== Safe getters =====
export function getPhase(phases, idx) { return phases?.[idx]; }

export function getCurrentExcercise(state, currentPhase) {
  let currentExercise;
  if (isSuperset(currentPhase)) {
    currentExercise = currentPhase.groups[state.supersetIndex].exercises[state.exerciseIndex];
  } else if (isCircuit(currentPhase) || isLinear(currentPhase)) {
    currentExercise = currentPhase.exercises[state.exerciseIndex];
  } else {
    currentExercise = null; // unknown phase type
  }
  return currentExercise;
}

export function getExercisesLength(state, currentPhase) {
  let length = 0;
  if (isSuperset(currentPhase)) {
    length = currentPhase.groups[state.supersetIndex].exercises.length;
  } else if (isCircuit(currentPhase) || isLinear(currentPhase)) {
    length = currentPhase.exercises.length;
  }
  // (isSuperset(currentPhase)
  //   ? currentPhase.groups[state.supersetIndex].exercises.length
  //   : currentPhase.exercises.length)) * 100;

  return length;
}


export function getRestDuration(state, currentPhase) {
  if (!state.isResting) return 0;
  if (isSuperset(currentPhase)) {
    const superset = currentPhase.groups?.[state.supersetIndex];
    return state.restType === "betweenSet"
      ? superset?.restBetweenSets ?? DEFAULT_REST_BETWEEN_SET
      : superset?.restBetweenExercise ?? DEFAULT_REST_BETWEEN_EXERCISE_IN_SET;
  } else if (isCircuit(currentPhase)) {
    return state.restType === "betweenSet"
      ? currentPhase?.restBetweenRounds ?? DEFAULT_REST_BETWEEN_ROUNDS
      : currentPhase?.restBetweenExercise ?? DEFAULT_REST_BETWEEN_EXERCISE_IN_SET;
  }

  if (state.restType === "betweenExercise") {
    return currentPhase.restBetweenExercise ?? DEFAULT_REST_BETWEEN_EXERCISE;
  }

  return 0;
};

export function getInitialSeconds(currentPhase, phaseIdx, supersetIndex, exerciseIndex) {
    
  let duration = 0;
  if (isSuperset(currentPhase)) {
    duration = currentPhase.groups[supersetIndex].exercises[exerciseIndex].duration;
  } else if (isCircuit(currentPhase) || isLinear(currentPhase)) {
    duration = currentPhase.exercises[exerciseIndex].duration;
  } 
  return duration;
  // if (isSuperset(phase)) {
  //   return phase.supersets[supersetIdx].exercises[exerciseIdx].duration;
  // }
  // return phase.exercises[exerciseIdx].duration;
}

export function totalSecondsWithActualFlow(workoutPhases) {
  return workoutPhases.reduce((total, phase) => {
    // Superset phase
    if (phase.supersets) {
      phase.supersets.forEach((superset, sIndex) => {
        for (let set = 0; set < superset.sets; set++) {
          superset.exercises.forEach((exercise, eIndex) => {
            total += exercise.duration; // exercise time
            // Rest after exercise (even last one if your timer does it)
            if (eIndex < superset.exercises.length - 1) {
              total += superset.restBetweenExercise || 0;
            }
          });
          // Rest between sets
          if (set < superset.sets - 1) {
            total += superset.restBetweenSets || 0;
          }
        }
        // Rest after last set of superset if your timer waits before next superset
        if (sIndex < phase.supersets.length - 1) {
          total += superset.restBetweenSets || 0;
        }
      });
      return total;
    }

    // Non-superset phase with fixed duration
    if (typeof phase.duration === "number") {
      total += phase.duration;
      return total;
    }

    // Non-superset phase with exercises
    if (phase.exercises) {
      phase.exercises.forEach((exercise, eIndex) => {
        total += exercise.duration;
        // Rest after exercise (even last one if your timer does it)
        if (eIndex < phase.exercises.length - 1) {
          total += phase.restBetweenExercise || 0;
        }
      });
      return total;
    }

    return total;
  }, 0);
}

export function recalculateElapsedSeconds(seconds, elapsedSeconds, isInRestingPrev, dataDuration) {
  // let elapsedSeconds = state.elapsedSeconds;
  console.log('calculateElapsedSeconds before racalculate : ', elapsedSeconds);
  elapsedSeconds -= isInRestingPrev ? (dataDuration.restDuration - seconds) : (dataDuration.restDuration + (dataDuration.currentDuration - seconds));
  elapsedSeconds -= dataDuration.prevDuration;
  console.log('calculateElapsedSeconds after  racalculate : ', elapsedSeconds);
  return elapsedSeconds;
}