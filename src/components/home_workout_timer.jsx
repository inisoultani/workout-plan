import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { WorkoutPrograms } from "@/data/workouts";

const workoutPhases = WorkoutPrograms.find(program => program.day == "Sunday").phases;

export default function HomeWorkoutTimer() {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [supersetIndex, setSupersetIndex] = useState(0);
  const [setCount, setSetCount] = useState(1);
  const isSupersetPhase = (phase) => !!phase.supersets;
  const [seconds, setSeconds] = useState(
    getInitialSeconds(0, 0, 0)
  );
  const [running, setRunning] = useState(true);
  const timerRef = useRef(null);
  

  function getInitialSeconds(phaseIdx, supersetIdx, exerciseIdx) {
    const phase = workoutPhases[phaseIdx];
    if (isSupersetPhase(phase)) {
      return phase.supersets[supersetIdx].exercises[exerciseIdx].duration;
    }
    return phase.exercises[exerciseIdx].duration;
  }

  const totalSeconds = workoutPhases.reduce((total, phase) => {
    if (isSupersetPhase(phase)) {
      return (
        total +
        phase.supersets.reduce((sTotal, superset) => {
          return (
            sTotal +
            superset.sets *
              superset.exercises.reduce((eTotal, e) => eTotal + e.duration, 0)
          );
        }, 0)
      );
    }
    return (
      total +
      phase.exercises.reduce((eTotal, e) => eTotal + e.duration, 0)
    );
  }, 0);

  const elapsedSeconds = useRef(0);


  useEffect(() => {
    if (!running) return;

    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s > 1) return s - 1;

        const currentPhase = workoutPhases[phaseIndex];
        if (isSupersetPhase(currentPhase)) {
          const currentSuperset = currentPhase.supersets[supersetIndex];
          const nextExerciseIndex = exerciseIndex + 1;

          if (nextExerciseIndex < currentSuperset.exercises.length) {
            setExerciseIndex(nextExerciseIndex);
            return currentSuperset.exercises[nextExerciseIndex].duration;
          }

          const nextSetCount = setCount + 1;
          if (nextSetCount <= currentSuperset.sets) {
            setExerciseIndex(0);
            setSetCount(nextSetCount);
            return currentSuperset.exercises[0].duration;
          }

          const nextSupersetIndex = supersetIndex + 1;
          if (nextSupersetIndex < currentPhase.supersets.length) {
            setSupersetIndex(nextSupersetIndex);
            setExerciseIndex(0);
            setSetCount(1);
            return currentPhase.supersets[nextSupersetIndex].exercises[0].duration;
          }

          const nextPhaseIndex = phaseIndex + 1;
          if (nextPhaseIndex < workoutPhases.length) {
            setPhaseIndex(nextPhaseIndex);
            setSupersetIndex(0);
            setExerciseIndex(0);
            setSetCount(1);
            return getInitialSeconds(nextPhaseIndex, 0, 0, 1);
          }

          setRunning(false);
          return 0;
        } else {
            const nextExerciseIndex = exerciseIndex + 1;
            if (nextExerciseIndex < currentPhase.exercises.length) {
              setExerciseIndex(nextExerciseIndex);
              return currentPhase.exercises[nextExerciseIndex].duration;
            }

            const nextPhaseIndex = phaseIndex + 1;
            if (nextPhaseIndex < workoutPhases.length) {
              setPhaseIndex(nextPhaseIndex);
              setExerciseIndex(0);
              return getInitialSeconds(nextPhaseIndex, 0, 0, 1);
            }

            setRunning(false);
            return 0;
          }
        }
      );
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [running, phaseIndex, supersetIndex, setCount, exerciseIndex]);

  const restart = () => {
    setPhaseIndex(0);
    setSupersetIndex(0);
    setSetCount(1);
    setExerciseIndex(0);
    elapsedSeconds.current = 0;
    setSeconds(getInitialSeconds(0, 0, 0, 1));
    setRunning(true);
  };

  const resetCurrentExercise = () => {
    setSeconds(getInitialSeconds(phaseIndex, supersetIndex, exerciseIndex, setCount));
    setRunning(true);
  };

  const skipToNext = () => {
    setSeconds(0);
  };

  const currentPhase = workoutPhases[phaseIndex];
  const currentExercise = isSupersetPhase(currentPhase)
    ? currentPhase.supersets[supersetIndex].exercises[exerciseIndex]
    : currentPhase.exercises[exerciseIndex];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-2">{currentExercise.name}</h1>
      <h2 className="text-xl mb-1">Phase: {currentPhase.label}</h2>
      {isSupersetPhase(currentPhase) && (
        <>
          <h3 className="text-lg">Superset Group : {currentPhase.supersets[supersetIndex].name}</h3>
          <h4 className="text-sm mb-4">Set {setCount} of {currentPhase.supersets[supersetIndex].sets}</h4>
        </>
      )}
      <div className="text-7xl font-mono mb-4">{seconds}s</div>

      <Progress value={((currentExercise.duration - seconds) / currentExercise.duration) * 100} className="w-full h-4 bg-green-800 mb-2" />
      <Progress value={((exerciseIndex + 1) / (isSupersetPhase(currentPhase) ? currentPhase.supersets[supersetIndex].exercises.length : currentPhase.exercises.length)) * 100} className="w-full h-4 bg-blue-800 mb-2" />
      <Progress value={(elapsedSeconds.current / totalSeconds) * 100} className="w-full h-4 bg-purple-800 mb-6" />

      <div className="flex gap-4">
        <Button onClick={() => setRunning(!running)}>{running ? "Pause" : "Resume"}</Button>
        <Button onClick={resetCurrentExercise}>Reset Movement</Button>
        <Button onClick={restart}>Restart</Button>
        <Button onClick={() => setRunning(false)}>Finish</Button>
        <Button onClick={skipToNext}>Next Movement</Button>
      </div>
    </div>
  );
}
