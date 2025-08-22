import { DEFAULT_TICK_INTERVAL } from "@/constants/workoutTimerDefaults";
import { useWorkoutDispatch, useWorkoutState } from "@/context/WorkoutContext";
import { ACTIONS } from "@/reducers/workoutTimerReducer";
import { useEffect, useRef } from "react";

export function useWorkoutTimer() {
  const state = useWorkoutState();
  const dispatch = useWorkoutDispatch();
  const timerRef = useRef(null);

  useEffect(() => {
    if (state.isRunning) {
      timerRef.current = setInterval(() => {
        // console.log('elapsedSeconds before TICK : ', state.elapsedSeconds);
        dispatch({ type: ACTIONS.TICK });
        // console.log('elapsedSeconds after  TICK : ', state.elapsedSeconds);
      }, DEFAULT_TICK_INTERVAL);
    }
    return () => clearInterval(timerRef.current);
  }, [state.isRunning, dispatch]);

  return {state, dispatch};
}

