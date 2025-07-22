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
  const [isResting, setIsResting] = useState(false);
  const [restType, setRestType] = useState(null);
  const [nextAfterRest, setNextAfterRest] = useState(null);

  const defaultRestBetweenExerciseInSet = 7;
  const defaultRestBetweenExercise = 7;
  const defaultRestBetweenSet = 7;

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

        // === Handle end of rest period ===
        if (isResting) {
          
          setIsResting(false);
          setRestType(null);
          // Resume workout timer where you left off (which was already set in state)
          // Handle what to do after rest
          if (nextAfterRest?.type === "exercise") {
            setExerciseIndex(nextAfterRest.exerciseIndex);
          } else if (nextAfterRest?.type === "set") {
            setSetCount(nextAfterRest.setCount);
            setExerciseIndex(0);
          } else if (nextAfterRest?.type === "superset") {
            setSupersetIndex(nextAfterRest.supersetIndex);
            setSetCount(1);
            setExerciseIndex(0);
          }
          const resume = nextAfterRest?.resume ?? 0;
          setNextAfterRest(null);
          return resume; // Timer will re-trigger next tick
        }
        

        const currentPhase = workoutPhases[phaseIndex];
        if (isSupersetPhase(currentPhase)) {
          const currentSuperset = currentPhase.supersets[supersetIndex];
          const nextExerciseIndex = exerciseIndex + 1;

          // === BETWEEN EXERCISE in SUPERSET ===
          if (nextExerciseIndex < currentSuperset.exercises.length) {
            setExerciseIndex(nextExerciseIndex);
            setIsResting(true);
            setRestType("betweenExercise");
            setNextAfterRest({
              type: "exercise",
              exerciseIndex: nextExerciseIndex,
              resume: currentSuperset.exercises[nextExerciseIndex].duration,
            });
            return currentSuperset.restBetweenExercise ?? defaultRestBetweenExerciseInSet;
          }

          // === BETWEEN SET ===
          const nextSetCount = setCount + 1;
          if (nextSetCount <= currentSuperset.sets) {
            setExerciseIndex(0);
            setSetCount(nextSetCount);
            setIsResting(true);
            setRestType("betweenSet");
            setNextAfterRest({
              type: "set",
              setCount: nextSetCount,
              exerciseIndex: nextExerciseIndex,
              resume: currentSuperset.exercises[0].duration,
            });
            return currentSuperset.restBetweenSets ?? defaultRestBetweenSet;
          }

          // === BETWEEN SUPERSET ===
          const nextSupersetIndex = supersetIndex + 1;
          if (nextSupersetIndex < currentPhase.supersets.length) {
            setSupersetIndex(nextSupersetIndex);
            setExerciseIndex(0);
            setSetCount(1);
            setIsResting(true);
            setRestType("betweenSet");
            setNextAfterRest({
              type: "superset",
              supersetIndex: nextSupersetIndex,
              exerciseIndex: 0,
              resume: currentPhase.supersets[nextSupersetIndex].exercises[0].duration,
            });
            return currentSuperset.restBetweenSets ?? defaultRestBetweenSet;
            //return currentPhase.supersets[nextSupersetIndex].exercises[0].duration;
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
            // === BETWEEN EXERCISE in FLAT EXERCISE ===
            const nextExerciseIndex = exerciseIndex + 1;
            if (nextExerciseIndex < currentPhase.exercises.length) {
              setExerciseIndex(nextExerciseIndex);
              setIsResting(true);
              setRestType("betweenExercise");
              setNextAfterRest({
                type: "exercise",
                exerciseIndex: nextExerciseIndex,
                resume: currentPhase.exercises[nextExerciseIndex].duration,
              });
              return currentPhase.restBetweenExercise ?? defaultRestBetweenExercise;
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
  }, [running, phaseIndex, supersetIndex, setCount, exerciseIndex, isResting, restType]);

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

  const goToPrevious = () => {
    const currentPhase = workoutPhases[phaseIndex];

    if (isSupersetPhase(currentPhase)) {
      // Handle supersets
      if (exerciseIndex > 0) {
        const newExerciseIndex = exerciseIndex - 1;
        setExerciseIndex(newExerciseIndex);
        setSeconds(currentPhase.supersets[supersetIndex].exercises[newExerciseIndex].duration);
        return;
      }

      if (setCount > 1) {
        const previousSet = setCount - 1;
        const lastExerciseIdx = currentPhase.supersets[supersetIndex].exercises.length - 1;
        setSetCount(previousSet);
        setExerciseIndex(lastExerciseIdx);
        setSeconds(currentPhase.supersets[supersetIndex].exercises[lastExerciseIdx].duration);
        return;
      }

      if (supersetIndex > 0) {
        const prevSupersetIdx = supersetIndex - 1;
        const prevSuperset = currentPhase.supersets[prevSupersetIdx];
        const lastExerciseIdx = prevSuperset.exercises.length - 1;
        setSupersetIndex(prevSupersetIdx);
        setExerciseIndex(lastExerciseIdx);
        setSetCount(prevSuperset.sets);
        setSeconds(prevSuperset.exercises[lastExerciseIdx].duration);
        return;
      }
    } else {
      // Handle normal phase
      if (exerciseIndex > 0) {
        const newExerciseIndex = exerciseIndex - 1;
        setExerciseIndex(newExerciseIndex);
        setSeconds(currentPhase.exercises[newExerciseIndex].duration);
        return;
      }
    }

    // Fallback to previous phase if possible
    if (phaseIndex > 0) {
      const prevPhaseIdx = phaseIndex - 1;
      const prevPhase = workoutPhases[prevPhaseIdx];
      setPhaseIndex(prevPhaseIdx);

      if (isSupersetPhase(prevPhase)) {
        const lastSupersetIdx = prevPhase.supersets.length - 1;
        const lastSuperset = prevPhase.supersets[lastSupersetIdx];
        const lastExerciseIdx = lastSuperset.exercises.length - 1;

        setSupersetIndex(lastSupersetIdx);
        setExerciseIndex(lastExerciseIdx);
        setSetCount(lastSuperset.sets);
        setSeconds(lastSuperset.exercises[lastExerciseIdx].duration);
      } else {
        const lastExerciseIdx = prevPhase.exercises.length - 1;
        setExerciseIndex(lastExerciseIdx);
        setSeconds(prevPhase.exercises[lastExerciseIdx].duration);
      }
    }
  };

  const getRestDuration = () => {
    if (!isResting) return 0;
    const currentPhase = workoutPhases[phaseIndex];

    if (isSupersetPhase(currentPhase)) {
      const superset = currentPhase.supersets?.[supersetIndex];
      return restType === "betweenSet"
        ? superset?.restBetweenSets ?? defaultRestBetweenSet
        : superset?.restBetweenExercise ?? defaultRestBetweenExerciseInSet;
    }

    if (restType === "betweenExercise") {
      return currentPhase.restBetweenExercise ?? defaultRestBetweenExercise;
    }

    return 0;
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

     
      {isResting ? (
        <>
          <h2 className="text-3xl font-bold text-yellow-400 mb-2">{restType === "betweenSet" ? <div>Rest Between Sets</div> : <div>Rest Between Exercise</div>}</h2>
          <Progress value={((getRestDuration() - seconds) / getRestDuration()) * 100} className="w-full h-4 bg-yellow-800 mb-6" />
        </>
      ) : (
        <>
          <h2 className="text-3xl font-bold">{currentExercise.name}</h2>
          <Progress value={((currentExercise.duration - seconds) / currentExercise.duration) * 100} className="w-full h-4 bg-green-800 mb-2" />
        </>
      )}

       
      <Progress value={((exerciseIndex + 1) / (isSupersetPhase(currentPhase) ? currentPhase.supersets[supersetIndex].exercises.length : currentPhase.exercises.length)) * 100} className="w-full h-4 bg-blue-800 mb-2" />
      <Progress value={(elapsedSeconds.current / totalSeconds) * 100} className="w-full h-4 bg-purple-800 mb-6" />

      <div className="flex gap-4">
        <Button onClick={() => setRunning(!running)}>{running ? "Pause" : "Resume"}</Button>
        <Button onClick={resetCurrentExercise}>Reset Movement</Button>
        <Button onClick={restart}>Restart</Button>
        <Button onClick={() => setRunning(false)}>Finish</Button>
        <Button onClick={skipToNext}>Next Movement</Button>
        <Button onClick={goToPrevious}>Previous Movement</Button>
      </div>
    </div>
  );
}
