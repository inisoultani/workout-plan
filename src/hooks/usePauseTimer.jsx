import { useEffect, useRef, useState } from "react";
import { DEFAULT_TICK_INTERVAL } from "@/constants/workoutTimerDefaults";

export function usePauseTimer(state) {
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
      clearPauseTimer(state, pauseTimerRef, pauseCounterRef);
    }

    return () => {
      clearPauseTimer(state, pauseTimerRef, pauseCounterRef);
    }
  }, [state.isRunning, isPaused]);

  return { setIsPaused };
}

function clearPauseTimer(state, pauseTimerRef, pauseCounterRef) {
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