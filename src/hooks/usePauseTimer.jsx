import { useEffect, useRef, useState } from "react";
import { DEFAULT_TICK_INTERVAL } from "@/constants/workoutTimerDefaults";

// API: usePauseTimer({ isRunning }, { getDebugInfo, onTick })
export function usePauseTimer({ isRunning }, options = {}) {
  const { getDebugInfo, onTick } = options;
  const pauseTimerRef = useRef(null);
  const pauseCounterRef = useRef(0);
  const [isPaused, setIsPaused] = useState(false);

  // Handle pause timer when state changes
  useEffect(() => {
    if (!isRunning && isPaused) {
      // Start pause timer when paused
      pauseCounterRef.current = 0;
      pauseTimerRef.current = setInterval(() => {
        pauseCounterRef.current += 1;
        if (typeof onTick === "function") onTick(pauseCounterRef.current);
        console.log("🟢 Pause timer tick : ", pauseCounterRef.current);
      }, DEFAULT_TICK_INTERVAL);
      
    } else {
      // Clear pause timer when running
      clearPauseTimer(pauseTimerRef, pauseCounterRef, getDebugInfo);
    }

    return () => {
      clearPauseTimer(pauseTimerRef, pauseCounterRef, getDebugInfo);
    }
  }, [isRunning, isPaused]);

  return { isPaused, setIsPaused };
}

function clearPauseTimer(pauseTimerRef, pauseCounterRef, getDebugInfo) {
  if (pauseTimerRef.current) {
    console.log("🟢 [useEffect] Pause timer cleared : ", pauseCounterRef.current, ' seconds');
    if (typeof getDebugInfo === "function") {
      try {
        console.log("🟢 State variables:", getDebugInfo());
      } catch (_) {
        // ignore debug errors
      }
    }
    clearInterval(pauseTimerRef.current);
    pauseTimerRef.current = null;
  }
}