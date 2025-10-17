import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavbarMenuComponent from './components/NavbarMenuComponent';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TeamDetails from './pages/TeamDetails';
import PlayerDetails from './pages/PlayerDetails';
import Classifica from './pages/Classifica';
import Error from './pages/Error';

function App() {
  return (
    <Router>
      <NavbarMenuComponent />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/team/:id" element={<TeamDetails />} />
          <Route path="/player/:id" element={<PlayerDetails />} />
          <Route path="/classifica" element={<Classifica />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
