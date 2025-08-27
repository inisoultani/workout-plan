import { INITIAL_WORKOUT_STATE, workoutTimerReducer } from "@/reducers/workoutTimerReducer";
import { useReducer } from "react";
import { WorkoutStateContext, WorkoutDispatchContext } from "@/context/WorkoutContext";

export function WorkoutStateProvider({ children }) {
  
  const [state, dispatch] = useReducer(workoutTimerReducer, {
    ...INITIAL_WORKOUT_STATE
  });
  return (
    <WorkoutStateContext.Provider value={state}>
      <WorkoutDispatchContext.Provider value={dispatch}>
        {children}
      </WorkoutDispatchContext.Provider>
    </WorkoutStateContext.Provider>
  );
}