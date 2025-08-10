import './App.css'
import HomeWorkoutTimer from './components/home_workout_timer'
import { WorkoutPrograms } from './data/workouts';

function App() {

  const workoutPhases = WorkoutPrograms.find(program => program.day == "Sunday").phases;
  return (
    <>
      <div><HomeWorkoutTimer workoutPhases={workoutPhases} /></div>
    </>
  )
}

export default App
