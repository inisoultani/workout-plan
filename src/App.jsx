import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import WorkoutSelector from './pages/WorkoutSelector';
import WorkoutTimer from './pages/WorkoutTimer'

function App() {
 
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        {/* Selector screen */}
        <Route path="/" element={<WorkoutSelector />} />

        {/* Workout screen (param is day) */}
        <Route path="/program/:day" element={<WorkoutTimer />} />
      </Routes>
    </Router>
  );

}

export default App
