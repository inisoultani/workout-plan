// import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ProgressBarWithText } from "@/components/ui/progress-with-text";
// import { DEFAULT_REST_BETWEEN_EXERCISE, DEFAULT_REST_BETWEEN_EXERCISE_IN_SET, DEFAULT_REST_BETWEEN_SET } from "@/constants/workoutTimerDefaults";
// import { WorkoutPrograms } from "@/data/workouts";
import { useWorkoutTimer } from "@/hooks/useWorkoutTImer";
import { ACTIONS } from "@/reducers/workoutTimerReducer";
import { getRestDuration, isSupersetPhase, totalSecondsWithActualFlow } from "@/utils/workoutTimerLogic";

export default function WorkoutTimer({ workoutPhases }) {
 
  const {state, dispatch} = useWorkoutTimer(workoutPhases); 
  const totalSeconds = totalSecondsWithActualFlow(workoutPhases);
  const restDuration = getRestDuration(state, workoutPhases);
  const currentPhase = workoutPhases[state.phaseIndex];
  const currentExercise = isSupersetPhase(currentPhase)
    ? currentPhase.supersets[state.supersetIndex].exercises[state.exerciseIndex]
    : currentPhase.exercises[state.exerciseIndex];
  // console.log("Total seconds of workout", totalSeconds);
  // console.log("ElapsedSeconds " + elapsedSeconds.current);
  // console.log("Seconds " + seconds)

  function dispatchStart() {
    dispatch({ type: ACTIONS.START });
  }

  function dispatchPause() {
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
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-2">{currentExercise.name}</h1>
      <h2 className="text-xl mb-1">Phase: {currentPhase.label}</h2>
      {isSupersetPhase(currentPhase) && (
        <>
          <h3 className="text-lg">Superset Group : {currentPhase.supersets[state.supersetIndex].name}</h3>
          <h4 className="text-sm mb-4">Set {state.setCount} of {currentPhase.supersets[state.supersetIndex].sets}</h4>
        </>
      )}
      <div className="text-7xl font-mono mb-4">{state.seconds}s</div>

      {state.isResting ? (
        <>
          <h2 className="text-3xl font-bold text-yellow-400 mb-2">{state.restType === "betweenSet" ? <div>Rest Between Sets</div> : <div>Rest Between Exercise</div>}</h2>
          <Progress value={((restDuration - state.seconds) / restDuration) * 100} className="w-full h-4 bg-yellow-800 mb-6" />
        </>
      ) : (
        <>
          <h2 className="text-3xl font-bold">{currentExercise.name}</h2>
          <ProgressBarWithText value={((currentExercise.duration - state.seconds) / currentExercise.duration) * 100} textValue={`Loading...`} className="w-full h-5 bg-green-800 mb-2" />
        </>
      )}
       
      <ProgressBarWithText value={((state.exerciseIndex + 1) / (isSupersetPhase(currentPhase) ? currentPhase.supersets[state.supersetIndex].exercises.length : currentPhase.exercises.length)) * 100}  textValue={`Loading...`} className="w-full h-5 bg-blue-800 mb-2" />
      <ProgressBarWithText value={(state.elapsedSeconds / totalSeconds) * 100} textValue={`Loading...`} className="w-full h-5 bg-purple-800 mb-6" />
      
      <div className="flex gap-4">
        <Button onClick={dispatchStart}>Start</Button>
        <Button onClick={dispatchPause}>Pause</Button>
        <Button onClick={dispatchReset}>Reset Movement</Button>
        <Button onClick={dispatchNext}>Next Movement</Button>
        <Button onClick={dispatchGoToPrevious}>Previous Movement</Button>
        <Button onClick={dispatchRestart}>Restart</Button>
        {/* 
        <Button onClick={() => setRunning(false)}>Finish</Button>
         */}
      </div>
    </div>
  );
}
