import { ACTIONS, workoutTimerReducer, INITIAL_WORKOUT_STATE } from "@/reducers/workoutTimerReducer";
import { getInitialSeconds } from "@/utils/workoutTimerLogic";
import { useEffect, useReducer, useRef } from "react";

export function useWorkoutTimer(workoutPhases) {
  // const [state, dispatch] = useReducer(workoutTimerReducer, INITIAL_WORKOUT_STATE);
  // const workoutPhases = WorkoutPrograms.find(program => program.day == "Sunday").phases;
  const [state, dispatch] = useReducer(workoutTimerReducer, {
    ...INITIAL_WORKOUT_STATE,
    workoutPhases,
    seconds: getInitialSeconds(workoutPhases, 0, 0, 0)
  });
  const timerRef = useRef(null);

  useEffect(() => {
    if (state.isRunning) {
      timerRef.current = setInterval(() => {
        dispatch({ type: ACTIONS.TICK });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [state.isRunning]);

  // useEffect(() => {
  //   if (state.seconds === 0 && state.isRunning) {
  //     if (state.isResting) {
  //       // End rest → resume workout
  //       dispatch({ type: ACTIONS.END_REST, seconds: state.nextAfterRest?.resume || 0 });
  //     } else {
  //       // Workout step finished → figure out next action
  //       // Replace this with your current "betweenExercise / betweenSet / nextPhase" logic


  //     }
  //   }
  // }, [state.seconds, state.isResting, state.isRunning]);

  return {state, dispatch};
}

