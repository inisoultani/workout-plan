import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import WorkoutSelector from './pages/WorkoutSelector';
import WorkoutTimer from './pages/WorkoutTimer'
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import ResetPassword from "./pages/ResetPassword";
import { AuthProvider } from "./components/AuthProvider";
import { WorkoutStateProvider } from "./components/WorkoutStateProvider";
import WorkoutEditor from "./pages/WorkoutEditor";

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
                <WorkoutStateProvider>
                  <WorkoutSelector />
                </WorkoutStateProvider>
              </ProtectedRoute>
            } 
          />

          {/* Workout screen (param is day) */}
          <Route path="/program/:day" element={
              <ProtectedRoute>
                <WorkoutStateProvider>
                  <WorkoutTimer />
                </WorkoutStateProvider>
              </ProtectedRoute>
            }
          />

          {/* Editor screen */}
          <Route path="/editor" element={
             <ProtectedRoute>
             <WorkoutStateProvider>
               <WorkoutEditor />
             </WorkoutStateProvider>
           </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );

}

export default App
