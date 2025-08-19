
import { ProgressBarWithText } from "./progress-with-text";
import { useWorkoutProgress } from "@/hooks/useWorkoutProgress";

export default function WorkoutProgressBar({state, currentPhase, currentExercise, totalSeconds, restDuration}) {
  const { exerciseProgress, restProgress, exerciseIndexProgress, totalProgress } = useWorkoutProgress({state, currentPhase, currentExercise, totalSeconds, restDuration});

  // if(state.isResting) { 
  //   console.log("state.restType", state.restType);
  //   console.log("state.isResting", state.isResting);
  //   console.log("restDuration", restDuration);
  //   console.log("state.seconds", state.seconds);
  //   console.log("restProgress", restProgress);
  // }
  
  return (
    <>
      {state.isResting ? (
        <>
          <h2 className="text-3xl font-bold text-yellow-400 mb-2">
            {state.restType === "betweenSet" && <div>Rest Between Sets</div>}
            {state.restType === "betweenExercise" && <div>Rest Between Exercise</div>}
            {state.restType === "betweenPhase" && <div>Rest Between Phases</div>}
          </h2>
          <ProgressBarWithText value={restProgress}  className="w-full h-5 bg-yellow-800 mb-2" />
        </>
      ) : (
        <>
          <h2 className="text-3xl font-bold mb-2">{currentExercise.name}</h2>
          <ProgressBarWithText value={exerciseProgress}  className="w-full h-5 bg-green-800 mb-2" />
        </>
      )}
      <ProgressBarWithText value={exerciseIndexProgress}   className="w-full h-5 bg-blue-800 mb-2" />
      <ProgressBarWithText value={totalProgress}  className="w-full h-5 bg-purple-800 mb-6" />
    </>
  );
}