import { DEFAULT_REST_BETWEEN_EXERCISE, DEFAULT_REST_BETWEEN_EXERCISE_IN_SET, DEFAULT_REST_BETWEEN_SET } from "@/constants/workoutTimerDefaults";

export const isSupersetPhase = (phase) => !!phase.supersets;

export function totalSecondsWithActualFlow(workoutPhases) {
  return workoutPhases.reduce((total, phase, pIndex) => {
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

export function getRestDuration(state, workoutPhases) {
  if (!state.isResting) return 0;
  const currentPhase = workoutPhases[state.phaseIndex];

  if (isSupersetPhase(currentPhase)) {
    const superset = currentPhase.supersets?.[state.supersetIndex];
    return state.restType === "betweenSet"
      ? superset?.restBetweenSets ?? DEFAULT_REST_BETWEEN_SET
      : superset?.restBetweenExercise ?? DEFAULT_REST_BETWEEN_EXERCISE_IN_SET;
  }

  if (state.restType === "betweenExercise") {
    return currentPhase.restBetweenExercise ?? DEFAULT_REST_BETWEEN_EXERCISE;
  }

  return 0;
};

export function getInitialSeconds(workoutPhases, phaseIdx, supersetIdx, exerciseIdx) {
    const phase = workoutPhases[phaseIdx];
    if (isSupersetPhase(phase)) {
      return phase.supersets[supersetIdx].exercises[exerciseIdx].duration;
    }
    return phase.exercises[exerciseIdx].duration;
  }