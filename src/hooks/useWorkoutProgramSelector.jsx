import { useWorkoutDispatch, useWorkoutState } from "@/context/WorkoutContext";
import { useState, useEffect } from "react";
import { loadWorkoutProgramsFromDb } from "@/data/loadProgramsFromDb";
import { ACTIONS } from "@/reducers/workoutTimerReducer";
import { getInitialSeconds } from "@/utils/workoutTimerLogic";

export const useWorkoutProgramSelector = (day) => {
  const [selectedDay, setSelectedDay] = useState(day);
  const state = useWorkoutState();
  const dispatch = useWorkoutDispatch();
  
  useEffect(() => {
    console.log("🟢 selectedDay :", selectedDay);
    const fetchPrograms = async () => {
      const programs = await loadWorkoutProgramsFromDb(selectedDay);
      console.log("🟢 programs :", programs);
      dispatch({ type: ACTIONS.SET_PROGRAM, payload: { 
          program: programs[0],
          selectedDay: selectedDay,
          seconds: getInitialSeconds(programs[0].phases[0], 0, 0, 0)
        } 
      });
    };
    fetchPrograms();
  }, [selectedDay, dispatch]);

  return { selectedDay, state, dispatch, setSelectedDay };
};