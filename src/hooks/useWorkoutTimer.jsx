import { WORKOUT_PHASES } from "@/constants/workoutTimerDefaults";
import { ACTIONS, workoutTimerReducer, INITIAL_WORKOUT_STATE } from "@/reducers/workoutTimerReducer";
import { getInitialSeconds } from "@/utils/workoutTimerLogic";
import { useEffect, useReducer, useRef } from "react";

export function useWorkoutTimer(workoutPhases) {

  const [state, dispatch] = useReducer(workoutTimerReducer, {
    ...INITIAL_WORKOUT_STATE,
    workoutPhases,
    seconds: getInitialSeconds(WORKOUT_PHASES[0], 0, 0, 0)
  });
  const timerRef = useRef(null);

  useEffect(() => {
    if (state.isRunning) {
      timerRef.current = setInterval(() => {
        // console.log('elapsedSeconds before TICK : ', state.elapsedSeconds);
        dispatch({ type: ACTIONS.TICK });
        // console.log('elapsedSeconds after  TICK : ', state.elapsedSeconds);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [state.isRunning]);

  return {state, dispatch};
}

