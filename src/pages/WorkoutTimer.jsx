import { useWorkoutTimer } from "@/hooks/useWorkoutTImer";
import TimerController from "../components/ui/TimerController";
import WorkoutProgressBar from "../components/ui/WorkoutProgressBar";
import { useNavigate, useParams } from "react-router-dom";
import { useWorkoutProgram } from "@/hooks/useWorkoutProgram";
import { usePauseTimer } from "@/hooks/usePauseTimer";

export default function WorkoutTimer() {
 
  const { day } = useParams();
  const navigate = useNavigate();
  const {state, dispatch} = useWorkoutTimer(day); 
  const { totalSeconds, currentPhase, restDuration, currentExercise, groupInfo } = useWorkoutProgram(day, state);
  usePauseTimer(
    { isRunning: state.isRunning, isPaused: state.isPaused },
    {
      getDebugInfo: () => ({
        phaseIndex: state.phaseIndex,
        supersetIndex: state.supersetIndex,
        exerciseIndex: state.exerciseIndex,
        setCount: state.setCount,
        roundCount: state.roundCount,
        exerciseSetCount: state.exerciseSetCount,
        isResting: state.isResting,
      }),
    }
  );

  function navigateToWorkoutSelector() {
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h2 className="text-xl mb-1">Workout Program : {day.toUpperCase()}</h2>
      <h1 className="text-4xl font-bold mb-2">{currentExercise.name}</h1>
      <h2 className="text-xl mb-1">Phase: {currentPhase.label}</h2>
      {groupInfo && (
        <>
          <h3 className="text-lg">{groupInfo.type} Group : {groupInfo.name}</h3>
          <h4 className="text-sm mb-4">{groupInfo.label} {groupInfo.currentSet} of {groupInfo.sets}</h4>
        </>
      )}
      <div className="text-9xl orbitron-secs mb-4">{state.seconds}s</div>
      <WorkoutProgressBar state={state} 
          currentPhase={currentPhase} 
          currentExercise={currentExercise} 
          totalSeconds={totalSeconds} 
          restDuration={restDuration}/>
      <TimerController dispatch={dispatch} />
      <button
        className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-lg font-semibold"
        onClick={navigateToWorkoutSelector}
        type="button">
        Exit
      </button>
    </div>


  );
}
