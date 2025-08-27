import { createContext, useContext } from "react";

export const WorkoutStateContext = createContext();
export const WorkoutDispatchContext = createContext();

export const useWorkoutState = () => {
  const context = useContext(WorkoutStateContext);
  if (!context) {
    throw new Error("useWorkoutState must be used within a WorkoutStateProvider");
  }
  return context;
}

export const useWorkoutDispatch = () => {
  const context = useContext(WorkoutDispatchContext);
  if (!context) {
    throw new Error("useWorkoutDispatch must be used within a WorkoutStateProvider");
  }
  return context;
}