import { getCurrentExercise, getCurrentWorkoutProgram, getGroupInfo, getRestDuration, totalSecondsWithActualFlow } from "@/utils/workoutTimerLogic";
import { useMemo } from "react";

export function useWorkoutProgram(day, state) {
  const selectedProgram = useMemo(() => getCurrentWorkoutProgram(day), [day]);
  const totalSeconds = useMemo(() => totalSecondsWithActualFlow(day, selectedProgram.phases), [day, selectedProgram]);

  const currentPhase = selectedProgram.phases[state.phaseIndex]; 
  const restDuration = getRestDuration(state, currentPhase);
  const currentExercise = getCurrentExercise(state, currentPhase);
  const groupInfo = getGroupInfo(state, currentPhase)

  return { totalSeconds, currentPhase, restDuration, currentExercise, groupInfo };
}