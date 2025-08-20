import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import WorkoutSelector from './pages/WorkoutSelector';
import WorkoutTimer from './pages/WorkoutTimer'
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import ResetPassword from "./pages/ResetPassword";

function App() {
 
  return (
    <AuthProvider>
      <Router basename={import.meta.env.BASE_URL}>
        <Routes>
          {/* Login screen */}
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Selector screen */}
          <Route path="/" element={
              <ProtectedRoute>
                <WorkoutSelector />
              </ProtectedRoute>
            } 
          />

          {/* Workout screen (param is day) */}
          <Route path="/program/:day" element={
              <ProtectedRoute>
                <WorkoutTimer />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );

}

export default App
