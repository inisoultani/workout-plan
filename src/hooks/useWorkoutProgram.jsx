import { getCurrentExercise, getCurrentWorkoutProgram, getGroupInfo, getRestDuration, totalSecondsWithActualFlow } from "@/utils/workoutTimerLogic";

export function useWorkoutProgram(day, state) {
  const selectedProgram = getCurrentWorkoutProgram(day);
  const totalSeconds = totalSecondsWithActualFlow(day, selectedProgram.phases);
  const currentPhase = selectedProgram.phases[state.phaseIndex]; 
  const restDuration = getRestDuration(state, currentPhase);
  const currentExercise = getCurrentExercise(state, currentPhase);
  const groupInfo = getGroupInfo(state, currentPhase)

  return { totalSeconds, currentPhase, restDuration, currentExercise, groupInfo };
}