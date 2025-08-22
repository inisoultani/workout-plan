import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { WorkoutPrograms } from "@/data/workouts"; // your dataset
import { useAuth } from "@/context/AuthContext";

export default function WorkoutSelector() {
  const [selectedDay, setSelectedDay] = useState(
    new Date().toLocaleDateString("en-US", { weekday: "long" })
  );
  const navigate = useNavigate();
  const todayWorkout = WorkoutPrograms.find(p => p.day === selectedDay);
  const { setUser } = useAuth();

  function navigateToWorkoutProgram() {
    navigate(`/program/${selectedDay.toLowerCase()}`);
  }

  async function handleLogout() {
    // Attempt server-side sign out (global) and clear local persisted session regardless of response
    try {
      await supabase.auth.signOut({ scope: "global" });
    } catch (error) {
      console.log("🟢 Error in handleLogout :", error);
      // ignore
    }

    // Manually clear any persisted Supabase auth token to avoid session restoration on refresh
    try {
      const url = import.meta.env.VITE_SUPABASE_URL;
      const match = typeof url === "string" ? url.match(/^https?:\/\/([^.]+)/) : null;
      const projectRef = match?.[1];
      if (projectRef) {
        const storageKey = `sb-${projectRef}-auth-token`;
        localStorage.removeItem(storageKey); 
        sessionStorage.removeItem(storageKey);
        
      }
    } catch (error) {
      console.log("🟢 Error in handleLogout :", error);
      // ignore
    }

    // Clear context and navigate
    setUser(null);
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">🏋️ My Workout App</h1>
        <div className="flex items-center gap-3">
          <span className="text-gray-400">Today: {selectedDay}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-400 hover:underline"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Day Selector */}
      <div className="flex space-x-2 overflow-x-auto pb-4 mb-6">
        {WorkoutPrograms.map(p => (
          <button
            key={p.day}
            onClick={() => setSelectedDay(p.day)}
            className={`px-4 py-2 rounded-full transition ${
              selectedDay === p.day
                ? "bg-green-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {p.day}
          </button>
        ))}
      </div>

      {/* Workout Preview */}
      <div className="flex-1 space-y-3">
        {todayWorkout ? (
          todayWorkout.phases.map((phase, i) => (
            <div
              key={i}
              className="bg-gray-800 p-4 rounded-xl shadow-md flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-semibold">{phase.label}</h2>
                <p className="text-sm text-gray-400">{phase.type}</p>
              </div>
              <div className="text-sm text-gray-300">
                {phase.type === "superset" &&
                  `${phase.groups.length} groups × ${phase.groups[0].sets} sets`}
                {phase.type === "circuit" &&
                  `${phase.rounds} rounds • ${phase.exercises.length} exercises`}
                {phase.type === "linear" &&
                  `${phase.exercises.length} exercises`}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No workout found for {selectedDay}</p>
        )}
      </div>

      {/* Start Workout */}
      {todayWorkout && (
        <button onClick={navigateToWorkoutProgram} className="mt-6 bg-green-600 hover:bg-green-500 text-lg font-bold py-3 rounded-xl shadow-lg">
          ▶ Start Workout
        </button>
      )}
    </div>
  );
}
