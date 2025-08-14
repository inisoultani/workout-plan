import { WORKOUT_PHASES } from "@/constants/workoutTimerDefaults";
import { useWorkoutTimer } from "@/hooks/useWorkoutTImer";
import { getCurrentExcercise, getRestDuration, isSuperset, totalSecondsWithActualFlow } from "@/utils/workoutTimerLogic";
import TimerController from "./ui/TimerController";
import WorkoutProgressBar from "./ui/WorkoutProgressBar";

export default function WorkoutTimer() {
 
  const {state, dispatch} = useWorkoutTimer(); 
  const totalSeconds = totalSecondsWithActualFlow(WORKOUT_PHASES);
  const currentPhase = WORKOUT_PHASES[state.phaseIndex];
  const restDuration = getRestDuration(state, currentPhase);
  const currentExercise = getCurrentExcercise(state, currentPhase);

  // console.log("Total seconds of workout", totalSeconds);
  // console.log("ElapsedSeconds " + elapsedSeconds.current);
  // console.log("Seconds " + seconds)

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-2">{currentExercise.name}</h1>
      <h2 className="text-xl mb-1">Phase: {currentPhase.label}</h2>
      {isSuperset(currentPhase) && (
        <>
          <h3 className="text-lg">Superset Group : {currentPhase.groups[state.supersetIndex].name}</h3>
          <h4 className="text-sm mb-4">Set {state.setCount} of {currentPhase.groups[state.supersetIndex].sets}</h4>
        </>
      )}
      <div className="text-9xl orbitron-secs mb-4">{state.seconds}s</div>
      <WorkoutProgressBar state={state} 
          currentPhase={currentPhase} 
          currentExercise={currentExercise} 
          totalSeconds={totalSeconds} 
          restDuration={restDuration}/>
      <TimerController dispatch={dispatch} />
    </div>
  );
}
