import { useState } from 'react';
import './App.css'
import WorkoutSelector from './pages/WorkoutSelector';
import WorkoutTimer from './pages/WorkoutTimer'

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

export default App
