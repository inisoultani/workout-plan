import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import WorkoutSelector from './pages/WorkoutSelector';
import WorkoutTimer from './pages/WorkoutTimer'

function App() {
 
  return (
    <Router>
      <Routes>
        {/* Selector screen */}
        <Route path="/" element={<WorkoutSelector />} />

        {/* Workout screen (param is day) */}
        <Route path="/program/:day" element={<WorkoutTimer />} />
      </Routes>
    </Router>
  );

  // if (screen === "workout" && selectedDay) {
  //   return (
  //     <WorkoutTimer
  //       selectedDay={selectedDay}
  //       onExit={() => {
  //         setSelectedDay("Sunday");
  //         setScreen("selector");
  //       }}
  //     />
  //   );
  // }

  // return (
  //   <WorkoutSelector
  //     onStart={(program) => {
  //       setScreen("workout");
  //       setSelectedDay(program.day);
  //     }}
  //   />
  // );
  // }
}

export default App
