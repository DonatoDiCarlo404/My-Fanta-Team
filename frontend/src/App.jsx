import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavbarMenuComponent from './components/NavbarMenuComponent';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TeamDetails from './pages/TeamDetails';
import PlayerDetails from './pages/PlayerDetails';
import Classifica from './pages/Classifica';
import Error from './pages/Error';
import AddPlayers from './pages/AddPlayers';
import FooterComponent from './components/FooterComponent';
import { API_URL } from './config';

function App() {
  // Keep-alive ping per mantenere il backend attivo
  useEffect(() => {
    // Ping iniziale al caricamento
    const pingBackend = async () => {
      try {
        await fetch(`${API_URL}/test`);
      } catch (error) {
        // Ignora gli errori del ping
        console.log('Keep-alive ping');
      }
    };

    pingBackend(); // Primo ping immediato

    // Ping ogni 10 minuti (600000 ms) per mantenere il server sveglio
    const intervalId = setInterval(pingBackend, 600000);

    // Cleanup: rimuovi l'intervallo quando il componente viene smontato
    return () => clearInterval(intervalId);
  }, []);

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
          <Route path="/team/:id/classifica" element={<Classifica />} />
          <Route path="/team/:id/add-players" element={<AddPlayers />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </div>
      <FooterComponent />
    </Router>
  );
}

export default App
