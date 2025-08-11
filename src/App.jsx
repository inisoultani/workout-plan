import './App.css'
import WorkoutTimer from './components/WorkoutTimer'
import { WorkoutPrograms } from './data/workouts';

function App() {

  const workoutPhases = WorkoutPrograms.find(program => program.day == "Sunday").phases;
  return (
    <>
      <div><WorkoutTimer workoutPhases={workoutPhases} /></div>
    </>
  )
}

export default App
