import { getExercisesLength } from "@/utils/workoutTimerLogic";
export function useWorkoutProgress({state, currentPhase, currentExercise, totalSeconds, restDuration}) {

  const exerciseProgress = ((currentExercise.duration - state.seconds) / currentExercise.duration) * 100;
  const restProgress = ((restDuration - state.seconds) / restDuration) * 100;
  const exerciseIndexProgress = ((state.exerciseIndex + 1) / getExercisesLength(state, currentPhase)) * 100;
  const totalProgress = (state.elapsedSeconds / totalSeconds) * 100;

  return { exerciseProgress, restProgress, exerciseIndexProgress, totalProgress };
}