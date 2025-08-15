import { DEFAULT_REST_BETWEEN_EXERCISE, DEFAULT_REST_BETWEEN_EXERCISE_IN_SET, DEFAULT_REST_BETWEEN_ROUNDS, DEFAULT_REST_BETWEEN_SET } from "@/constants/workoutTimerDefaults";

// export const isSupersetPhase = (phase) => !!phase.supersets;


// ===== Type guards =====
export function isLinear(phase)   { return phase?.type === "linear"; }
export function isSuperset(phase) { return phase?.type === "superset"; }
export function isCircuit(phase)  { return phase?.type === "circuit"; }

// ===== Safe getters =====
export function getPhase(phases, idx) { return phases?.[idx]; }

export function getCurrentExercise(state, currentPhase) {
  if (isSuperset(currentPhase)) {
    return currentPhase.groups?.[state.supersetIndex]?.exercises?.[state.exerciseIndex] ?? null;
  } 
  if (isCircuit(currentPhase) || isLinear(currentPhase)) {
    return currentPhase.exercises?.[state.exerciseIndex] ?? null;
  }
  return null; // unknown phase type
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
    if (isSuperset(phase)) {
      phase.groups.forEach((superset, sIndex) => {
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
        if (sIndex < phase.groups.length - 1) {
          total += superset.restBetweenSets || 0;
        }
      });
      return total;
    }

    // Circuit phase
    if (isCircuit(phase)) {
      const rounds = phase.rounds || 1;
      for (let round = 0; round < rounds; round++) {
        phase.exercises.forEach((exercise, eIndex) => {
          total += exercise.duration; // exercise time
          // Rest between exercises within the round (except after last exercise in round)
          if (eIndex < phase.exercises.length - 1) {
            total += phase.restBetweenExercise || 0;
          }
        });
        // Rest between rounds (except after last round)
        if (round < rounds - 1) {
          total += phase.restBetweenRounds || 0;
        }
      }
      return total;
    }

    // Phase with fixed duration
    if (typeof phase.duration === "number") {
      total += phase.duration;
      return total;
    }

    // Linear phase with exercises (non-circuit, non-superset)
    if (phase.exercises) {
      phase.exercises.forEach((exercise, eIndex) => {
        total += exercise.duration;
        // Rest after exercise (except last one)
        if (eIndex < phase.exercises.length - 1) {
          total += phase.restBetweenExercise || 0;
        }
      });
      return total;
    }
    
    return total;
  }, 0);
}

// ===== Elapsed seconds recalculation when going BACK =====
// dataDuration = { restDuration, currentDuration, prevDuration }
export function recalculateElapsedSeconds(currentSeconds, elapsedSeconds, isInRestingPrev, dataDuration) {

  let newElapsed = elapsedSeconds;
  console.log('calculateElapsedSeconds before racalculate : ', elapsedSeconds);
  if (isInRestingPrev) {
    // We were inside a rest: roll back only the portion already spent in this rest.
    // (restDuration - currentSeconds) is the elapsed part of the rest we need to undo.
    newElapsed -= (dataDuration.restDuration - currentSeconds);
  } else {
    // We were on an exercise: roll back the rest before it + the part of current exercise that elapsed.
    newElapsed -= (dataDuration.restDuration + (dataDuration.currentDuration - currentSeconds));
  }
  // Also roll back the full previous-step exercise (we're stepping to it)
  newElapsed -= dataDuration.prevDuration;
  console.log('calculateElapsedSeconds after  racalculate : ', elapsedSeconds);
  if (newElapsed < 0) newElapsed = 0;
  return newElapsed;
}

export function getGroupInfo(state, phase) {
  if (isSuperset(phase)) {
    return {
      type: "Superset",
      label: "Set",
      name: phase.groups[state.supersetIndex].name,
      sets: phase.groups[state.supersetIndex].sets,
      currentSet: state.setCount
    };
  }
  if (isCircuit(phase)) {
    return {
      type: "Circuit",
      label: "Round",
      name: phase.label,
      sets: phase.rounds,
      currentSet: state.roundCount
    };
  }
  return null;
}
