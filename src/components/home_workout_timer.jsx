import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { WorkoutPrograms } from "@/data/workouts";

const workoutPhases = WorkoutPrograms.find(program => program.day == "Sunday").phases;

export default function HomeWorkoutTimer() {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [seconds, setSeconds] = useState(workoutPhases[0].exercises[0].duration);
  const [running, setRunning] = useState(true);
  const timerRef = useRef(null);


  useEffect(() => {
    if (!running) return;

    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s > 1) return s - 1;

        const nextExerciseIndex = exerciseIndex + 1;
        const nextPhaseIndex = phaseIndex + 1;

        if (nextExerciseIndex < workoutPhases[phaseIndex].exercises.length) {
          setExerciseIndex(nextExerciseIndex);
          return workoutPhases[phaseIndex].exercises[nextExerciseIndex].duration;
        } else if (nextPhaseIndex < workoutPhases.length) {
          setPhaseIndex(nextPhaseIndex);
          setExerciseIndex(0);
          return workoutPhases[nextPhaseIndex].exercises[0].duration;
        } else {
          setRunning(false);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [running, phaseIndex, exerciseIndex]);

  const restart = () => {
    setPhaseIndex(0);
    setExerciseIndex(0);
    setSeconds(workoutPhases[0].exercises[0].duration);
    setRunning(true);
  };

  const skipToNext = () => {
    const nextExerciseIndex = exerciseIndex + 1;
    const nextPhaseIndex = phaseIndex + 1;

    if (nextExerciseIndex < workoutPhases[phaseIndex].exercises.length) {
      setExerciseIndex(nextExerciseIndex);
      setSeconds(workoutPhases[phaseIndex].exercises[nextExerciseIndex].duration);
    } else if (nextPhaseIndex < workoutPhases.length) {
      setPhaseIndex(nextPhaseIndex);
      setExerciseIndex(0);
      setSeconds(workoutPhases[nextPhaseIndex].exercises[0].duration);
    } else {
      setRunning(false);
      setSeconds(0);
    }
  };

  const currentPhase = workoutPhases[phaseIndex];
  const currentExercise = currentPhase.exercises[exerciseIndex];

  const totalSeconds = workoutPhases.reduce(
    (acc, phase) =>
      acc + phase.exercises.reduce((a, e) => a + e.duration, 0),
    0
  );

  const elapsedSeconds = workoutPhases
    .slice(0, phaseIndex)
    .reduce((acc, phase) => acc + phase.exercises.reduce((a, e) => a + e.duration, 0), 0)
    + currentPhase.exercises
      .slice(0, exerciseIndex)
      .reduce((a, e) => a + e.duration, 0)
    + (currentExercise.duration - seconds);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-2">{currentExercise.name}</h1>
      <h2 className="text-xl mb-1">Phase: {currentPhase.label}</h2>
      <h3 className="text-lg mb-4">Set {exerciseIndex + 1} of {currentPhase.exercises.length}</h3>

      <div className="text-7xl font-mono mb-4">{seconds}s</div>

      <Progress value={((currentExercise.duration - seconds) / currentExercise.duration) * 100} className="w-full h-4 bg-green-800 mb-2" />
      <Progress value={((exerciseIndex + 1) / currentPhase.exercises.length) * 100} className="w-full h-4 bg-blue-800 mb-2" />
      <Progress value={(elapsedSeconds / totalSeconds) * 100} className="w-full h-4 bg-purple-800 mb-6" />

      <div className="flex gap-4">
        <Button onClick={() => setRunning(!running)}>{running ? "Pause" : "Resume"}</Button>
        <Button onClick={restart}>Restart</Button>
        <Button onClick={() => setRunning(false)}>Finish</Button>
        <Button onClick={skipToNext}>Next Movement</Button>
      </div>
    </div>
  );
}
