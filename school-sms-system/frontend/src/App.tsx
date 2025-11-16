import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import StudentProfile from './pages/StudentProfile';
import Absences from './pages/Absences';
import Templates from './pages/Templates';
import SendMessage from './pages/SendMessage';
import Logs from './pages/Logs';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/student/:id" element={<StudentProfile />} />
            <Route path="/absences" element={<Absences />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/send-message" element={<SendMessage />} />
            <Route path="/logs" element={<Logs />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;