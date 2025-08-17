import { useState } from 'react';
import './App.css'
import WorkoutSelector from './components/WorkoutSelector';
import WorkoutTimer from './components/WorkoutTimer'

// function App() {
//   return (
//     <>
//       <div><WorkoutSelector /></div>
//       <div><WorkoutTimer /></div>
//     </>
//   )
// }

export default App

function App() {
  const [screen, setScreen] = useState("selector");
  const [selectedDay, setSelectedDay] = useState("Sunday");

  if (screen === "workout" && selectedDay) {
    return (
      <WorkoutTimer
        selectedDay={selectedDay}
        onExit={() => {
          setSelectedDay("Sunday");
          setScreen("selector");
        }}
      />
    );
  }

  return (
    <WorkoutSelector
      onStart={(program) => {
        setScreen("workout");
        setSelectedDay(program.day);
      }}
    />
  );
}
