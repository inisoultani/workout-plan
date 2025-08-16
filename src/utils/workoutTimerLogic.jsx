import { DEFAULT_REST_BETWEEN_EXERCISE, DEFAULT_REST_BETWEEN_EXERCISE_IN_SET, DEFAULT_REST_BETWEEN_ROUNDS, DEFAULT_REST_BETWEEN_SET, DEFAULT_REST_BETWEEN_PHASE } from "@/constants/workoutTimerDefaults";
import { WorkoutPrograms } from "@/data/workouts";

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
  
  // Handle rest between phases
  if (state.restType === "betweenPhase") {
    const currentWorkout = getCurrentWorkoutProgram();
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
  const currentWorkout = getCurrentWorkoutProgram();
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

// ===== Elapsed seconds recalculation when going BACK =====
// dataDuration = { restDuration, currentDuration, prevDuration }
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

// ===== Get current workout program =====
export function getCurrentWorkoutProgram() {
  // Since we're using hardcoded WORKOUT_PHASES from Sunday, find Sunday workout
  return WorkoutPrograms.find(program => program.day === "Monday");
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
