import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import StudentDashboard from './components/StudentDashboard';

export default function App() {
  const [user, setUser] = useState(null);

  function handleLogin(u) {
    setUser(u);
  }

  function handleLogout() {
    setUser(null);
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={user ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} />} 
      />
      <Route 
        path="/signup" 
        element={user ? <Navigate to="/dashboard" /> : <SignupPage />} 
      />
      <Route 
        path="/dashboard" 
        element={user ? <StudentDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/" />} 
      />
    </Routes>
  );
}
