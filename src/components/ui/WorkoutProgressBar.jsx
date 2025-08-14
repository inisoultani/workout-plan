import { getExercisesLength } from "@/utils/workoutTimerLogic";
import { ProgressBarWithText } from "./progress-with-text";

export default function WorkoutProgressBar({state, currentPhase, currentExercise, totalSeconds, restDuration}) {

  const exerciseProgress = ((currentExercise.duration - state.seconds) / currentExercise.duration) * 100;
  const restProgress = ((restDuration - state.seconds) / restDuration) * 100;
  const exerciseIndexProgress = getExercisesLength(state, currentPhase) * 100;
  const totalProgress = (state.elapsedSeconds / totalSeconds) * 100;

  return (
    <>
      {state.isResting ? (
        <>
          <h2 className="text-3xl font-bold text-yellow-400 mb-2">{state.restType === "betweenSet" ? <div>Rest Between Sets</div> : <div>Rest Between Exercise</div>}</h2>
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