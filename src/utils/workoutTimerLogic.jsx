import { DEFAULT_REST_BETWEEN_EXERCISE, DEFAULT_REST_BETWEEN_EXERCISE_IN_SET, DEFAULT_REST_BETWEEN_ROUNDS, DEFAULT_REST_BETWEEN_SET, DEFAULT_REST_BETWEEN_PHASE } from "@/constants/workoutTimerDefaults";
import { WorkoutPrograms } from "@/data/sources";


// ===== Type guards =====
/** Checks if a phase is of linear type */
export function isLinear(phase)   { return phase?.type === "linear"; }
/** Checks if a phase is of superset type */
export function isSuperset(phase) { return phase?.type === "superset"; }
/** Checks if a phase is of circuit type */
export function isCircuit(phase)  { return phase?.type === "circuit"; }

/** Safely gets a phase at the specified index */
export function getPhase(phases, idx) { return phases?.[idx]; }

/** Gets the current exercise based on timer state and phase type */
export function getCurrentExercise(state, currentPhase) {
  if (isSuperset(currentPhase)) {
    return currentPhase.groups?.[state.supersetIndex]?.exercises?.[state.exerciseIndex] ?? null;
  } 
  if (isCircuit(currentPhase) || isLinear(currentPhase)) {
    return currentPhase.exercises?.[state.exerciseIndex] ?? null;
  }
  return null; // unknown phase type
}

/** Gets the number of exercises in the current phase based on its type */
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

/** Calculates the appropriate rest duration based on current state and phase type */
export function getRestDuration(state, currentPhase) {
  if (!state.isResting) return 0;
  
  // Handle rest between phases
  if (state.restType === "betweenPhase") {
    const currentWorkout = getCurrentWorkoutProgram(state.selectedDay);
    return currentWorkout?.restBetweenPhase ?? DEFAULT_REST_BETWEEN_PHASE;
  }
  
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

  // Linear phase
  if (state.restType === "betweenSet") {
    return currentPhase.restBetweenSets ?? DEFAULT_REST_BETWEEN_SET;
  }
  
  if (state.restType === "betweenExercise") {
    return currentPhase.restBetweenExercise ?? DEFAULT_REST_BETWEEN_EXERCISE;
  }

  return 0;
};

/** Gets the initial duration in seconds for an exercise based on phase type and indices */
export function getInitialSeconds(currentPhase, phaseIdx, supersetIndex, exerciseIndex) {
    
  let duration = 0;
  if (isSuperset(currentPhase)) {
    duration = currentPhase.groups[supersetIndex].exercises[exerciseIndex].duration;
  } else if (isCircuit(currentPhase) || isLinear(currentPhase)) {
    duration = currentPhase.exercises[exerciseIndex].duration;
  } 
  return duration;
}

/** Calculates the total workout duration including all exercises and rest periods */
export function totalSecondsWithActualFlow(selectedDay, workoutPhases) {
  const currentWorkout = getCurrentWorkoutProgram(selectedDay);
  const restBetweenPhase = currentWorkout?.restBetweenPhase ?? DEFAULT_REST_BETWEEN_PHASE;
  
  return workoutPhases.reduce((total, phase, phaseIndex) => {
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
    }

    // Phase with fixed duration
    if (typeof phase.duration === "number") {
      total += phase.duration;
    }

    // Linear phase with exercises (non-circuit, non-superset)
    if (phase.exercises) {
      phase.exercises.forEach((exercise, eIndex) => {
        if (exercise.sets && exercise.sets > 1) {
          // Multi-set exercise
          for (let set = 1; set <= exercise.sets; set++) {
            total += exercise.duration; // exercise time
            // Rest between sets (except after last set)
            if (set < exercise.sets) {
              total += phase.restBetweenSets || 0;
            }
          }
        } else {
          // Single-set exercise (or no sets specified)
          total += exercise.duration;
        }
        
        // Rest between exercises (except after last exercise)
        if (eIndex < phase.exercises.length - 1) {
          total += phase.restBetweenExercise || 0;
        }
      });
    }
    
    // Add rest between phases (except after the last phase)
    if (phaseIndex < workoutPhases.length - 1) {
      total += restBetweenPhase;
    }
    
    return total;
  }, 0);
}

// dataDuration = { restDuration, currentDuration, prevDuration }
/** Recalculates elapsed time when navigating backwards in the timer */
export function recalculateElapsedSeconds(currentSeconds, elapsedSeconds, isInRestingPrev, dataDuration) {
  let newElapsed = elapsedSeconds;
  console.log('🧮 recalculateElapsedSeconds - Before:', { 
    elapsedSeconds, 
    currentSeconds, 
    isInRestingPrev, 
    dataDuration 
  });
  
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
  
  if (newElapsed < 0) newElapsed = 0;
  
  console.log('🧮 recalculateElapsedSeconds - After:', { 
    before: elapsedSeconds, 
    after: newElapsed, 
    subtracted: elapsedSeconds - newElapsed 
  });
  
  return newElapsed;
}

/** Gets the current workout program (hardcoded to Sunday) */
export function getCurrentWorkoutProgram(day = "Sunday") {
  // Since we're using hardcoded WORKOUT_PHASES from Sunday, find Sunday workout
  return WorkoutPrograms.find(program => program.day.toLowerCase() === day.toLowerCase());
}

/** Gets display information for the current group/set/round based on phase type */
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
  if (isLinear(phase)) {
    const currentExercise = phase.exercises?.[state.exerciseIndex];
    if (currentExercise?.sets && currentExercise.sets > 1) {
      return {
        type: "Linear",
        label: "Set",
        name: currentExercise.name,
        sets: currentExercise.sets,
        currentSet: state.exerciseSetCount
      };
    }
  }
  return null;
}

/** Calculates elapsed time when advancing forward in the timer */
export function calculateElapsedSecondsForNext(state, currentPhase) {
  console.log("🟢 NEXT - Before:", { 
    elapsedSeconds: state.elapsedSeconds, 
    remainingSeconds: state.seconds,
    exercise: state.exerciseIndex,
    isResting: state.isResting
  });

  // Simple logic: 
  // If in EXERCISE: Add remaining exercise time
  // If in REST: Add remaining rest time + full skipped current exercise duration
  let totalToAdd;
  let breakdown;
  
  if (state.isResting) {
    const currentExercise = getCurrentExercise(state, currentPhase);
    totalToAdd = state.seconds + currentExercise.duration;
    breakdown = `${state.seconds}(remaining rest) + ${currentExercise.duration}(current exercise) ` + currentExercise.name;
  } else {
    totalToAdd = state.seconds;
    breakdown = `${state.seconds}(remaining exercise)`;
  }
  
  //const newElapsedNext = state.elapsedSeconds + totalToAdd;
  console.log("🟢 NEXT - After:", { 
    elapsedSeconds: state.elapsedSeconds + totalToAdd, 
    addedTime: totalToAdd,
    breakdown
  });
  return totalToAdd;
}

/** Gets the duration of the current exercise */
export function getCurrentExerciseDuration(state, phase) {
  const currentExercise = getCurrentExercise(state, phase);
  return currentExercise?.duration ?? 0;
}

// Rest getters (with defaults)
/** Gets rest duration between exercises for any phase type */
export function restBetweenExerciseForPhase(phase, groupIdx) {
  if (isSuperset(phase)) {
    return phase.groups?.[groupIdx]?.restBetweenExercise ?? DEFAULT_REST_BETWEEN_EXERCISE_IN_SET;
  }
  if (isCircuit(phase)) {
    return phase.restBetweenExercise ?? DEFAULT_REST_BETWEEN_EXERCISE;
  }
  // linear
  return phase.restBetweenExercise ?? DEFAULT_REST_BETWEEN_EXERCISE;
}

/** Gets rest duration between sets for superset phases */
export function restBetweenSetsForSuperset(phase, groupIdx) {
  // also used as "between groups" rest (your earlier behavior)
  return phase.groups?.[groupIdx]?.restBetweenSets ?? DEFAULT_REST_BETWEEN_SET;
}

/** Gets rest duration between rounds for circuit phases */
export function restBetweenRoundsForCircuit(phase) {
  return phase.restBetweenRounds ?? DEFAULT_REST_BETWEEN_ROUNDS;
}

/** Gets rest duration between sets for linear phases */
export function restBetweenSetsForLinear(phase) {
  return phase.restBetweenSets ?? DEFAULT_REST_BETWEEN_SET;
}

/** Schedules a rest period or skips it if duration is 0 */
export function scheduleRest(state, restDuration, nextAfterRest, restTypeFallback = "betweenSet") {
  if (restDuration > 0) {
    // Use the explicitly passed restTypeFallback - the calling code knows the correct type
    const restType = restTypeFallback;
    console.log('restType', restType);
    // Apply the next state immediately, store only the resume duration
    return {
      ...state,
      ...nextAfterRest,  // Apply all the next state changes immediately
      isResting: true,
      restType: restType,
      seconds: restDuration,
      nextAfterRest: { resume: nextAfterRest.resume }  // Only store the resume duration
    };
  }
  // no rest → immediate transition
  return { 
    ...state, 
    ...nextAfterRest
  };
}

/** Build the durations needed to back-step from current position */
export function findBackStepDurations(state, currentPhase, phases) {
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
    const currentWorkout = getCurrentWorkoutProgram(state.selectedDay);
    const restBetweenPhase = currentWorkout?.restBetweenPhase ?? DEFAULT_REST_BETWEEN_PHASE;
    const currentFirstDuration = getCurrentExerciseDuration(
      { ...state, exerciseIndex: 0, supersetIndex: 0 }, // first exercise in current phase
      currentPhase
    );

    if (isSuperset(prevPhase)) {
      const lastGroupIdx = (prevPhase.groups?.length ?? 1) - 1;
      const lastGroup = prevPhase.groups?.[lastGroupIdx];
      const lastIdx = (lastGroup?.exercises?.length ?? 1) - 1;
      return {
        restDuration: restBetweenPhase, // Use restBetweenPhase instead of 0
        currentDuration: currentFirstDuration ?? 0,
        prevDuration: lastGroup?.exercises?.[lastIdx]?.duration ?? 0
      };
    }

    if (isCircuit(prevPhase)) {
      const lastIdx = (prevPhase.exercises?.length ?? 1) - 1;
      return {
        restDuration: restBetweenPhase, // Use restBetweenPhase instead of 0
        currentDuration: currentFirstDuration ?? 0,
        prevDuration: prevPhase.exercises?.[lastIdx]?.duration ?? 0
      };
    }

    // linear
    const lastIdx = (prevPhase.exercises?.length ?? 1) - 1;
    return {
      restDuration: restBetweenPhase, // Use restBetweenPhase instead of 0
      currentDuration: currentFirstDuration ?? 0,
      prevDuration: prevPhase.exercises?.[lastIdx]?.duration ?? 0
    };
  }

  // now at very beginning; nothing to subtract
  return { restDuration: 0, currentDuration: 0, prevDuration: 0 };
}

/** Calculates elapsed time when advancing forward in the timer  */
// export function findForwardStepDurations(state, currentPhase, phases) {
//   if   (state.isResting) {
//     // In REST: Add remaining rest + full duration of next exercise
//     const nextResult = reduceNext(state, phases);
//     const nextExercise = getCurrentExercise(nextResult, phases[nextResult.phaseIndex]);
//     return { 
//       nextExerciseDuration: nextExercise?.duration ?? 0,
//       nextExerciseName: nextExercise?.name ?? ""
//     };
//   } else {
//     // In EXERCISE: Add only remaining exercise time (no rest, no next exercise)
//     return {};
//   }
// }