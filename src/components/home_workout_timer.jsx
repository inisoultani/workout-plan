import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const workoutPhases = [
  {
    label: "Warm-Up",
    duration: 10 * 60,
    exercises: [
      { name: "Jump rope", duration: 5 * 60 },
      { name: "Arm circle + shoulder roll", duration: 60 },
      { name: "World’s Greatest Stretch", duration: 90 },
      { name: "TRX scapular pull", duration: 60 },
      { name: "Bear Crawl maju-mundur", duration: 60 }
    ]
  },
  {
    label: "Strength",
    duration: 35 * 60,
    exercises: [
      { name: "Pull-up", duration: 40 },
      { name: "Bear Hug Galon Squat", duration: 40 },
      { name: "TRX Split Squat / Single-Leg Squat", duration: 40 },
      { name: "Hindu + Tyson Push-up", duration: 40 },
      { name: "Overhead Press Galon (Strict)", duration: 40 },
      { name: "Band Woodchop / Twist Galon", duration: 40 }
    ]
  },
  {
    label: "Finisher",
    duration: 6 * 60,
    exercises: [
      { name: "TRX Rows (Ganjil)", duration: 60 },
      { name: "Jump Rope (Genap)", duration: 60 }
    ]
  },
  {
    label: "Cooldown",
    duration: 7 * 60,
    exercises: [
      { name: "TRX Chest Stretch", duration: 60 },
      { name: "Spinal Twist", duration: 60 },
      { name: "Pec stretch di pintu", duration: 60 },
      { name: "Deep squat hold", duration: 60 },
      { name: "Leher & bahu gerak ringan", duration: 60 }
    ]
  }
];

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
