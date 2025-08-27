import { getCurrentExercise, getGroupInfo, getRestDuration, totalSecondsWithActualFlow } from "@/utils/workoutTimerLogic";

export function useWorkoutProgram(state) {
  const selectedProgram = state.program;
  const totalSeconds = totalSecondsWithActualFlow(selectedProgram);

  const currentPhase = selectedProgram.phases[state.phaseIndex]; 
  const restDuration = getRestDuration(state, currentPhase);
  const currentExercise = getCurrentExercise(state, currentPhase);
  const groupInfo = getGroupInfo(state, currentPhase)

  return { totalSeconds, currentPhase, restDuration, currentExercise, groupInfo };
}