import { ACTIONS } from "@/reducers/workoutTimerReducer";
import { Button } from "./button";
import { useEffect, useRef, useState } from "react";
import { DEFAULT_TICK_INTERVAL } from "@/constants/workoutTimerDefaults";

export default function TimerController({dispatch, state}) {
  const pauseTimerRef = useRef(null);
  const pauseCounterRef = useRef(0);
  const [isPaused, setIsPaused] = useState(false);

  // Handle pause timer when state changes
  useEffect(() => {
    if (!state.isRunning && isPaused) {
      // Start pause timer when paused
      pauseCounterRef.current = 0;
      pauseTimerRef.current = setInterval(() => {
        pauseCounterRef.current += 1;
        console.log("🟢 Pause timer tick : ", pauseCounterRef.current);
      }, DEFAULT_TICK_INTERVAL);
      
    } else {
      // Clear pause timer when running
      clearPauseTimer();
    }

    return () => {
      clearPauseTimer();
    }
  }, [state.isRunning, isPaused]);

  function clearPauseTimer() {
    if (pauseTimerRef.current) {
      console.log("🟢 [useEffect] Pause timer cleared : ", pauseCounterRef.current, ' seconds');
      console.log("🟢 State variables:", {
        phaseIndex: state.phaseIndex,
        supersetIndex: state.supersetIndex,
        exerciseIndex: state.exerciseIndex,
        setCount: state.setCount,
        roundCount: state.roundCount,
        exerciseSetCount: state.exerciseSetCount,
        isResting: state.isResting,
      });  
      clearInterval(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
  }

  function dispatchStart() {
    setIsPaused(false);
    dispatch({ type: ACTIONS.START });
  }

  function dispatchPause() {
    setIsPaused(true);
    dispatch({ type: ACTIONS.PAUSE });
  }

  function dispatchNext() {
    dispatch({ type: ACTIONS.NEXT });
  }

  function dispatchReset() {
    dispatch({ type: ACTIONS.RESET });
  }

  function dispatchRestart() {
    dispatch({ type: ACTIONS.RESTART });
  }
  
  function dispatchGoToPrevious() {
    dispatch({ type: ACTIONS.GO_TO_PREVIOUS });
  }

  return (
    <div className="flex gap-4">
      <Button onClick={dispatchStart}>Start</Button>
      <Button onClick={dispatchPause}>Pause</Button>
      <Button onClick={dispatchReset}>Reset Movement</Button>
      <Button onClick={dispatchNext}>Next Movement</Button>
      <Button onClick={dispatchGoToPrevious}>Previous Movement</Button>
      <Button onClick={dispatchRestart}>Restart</Button>
    </div>
  );
}