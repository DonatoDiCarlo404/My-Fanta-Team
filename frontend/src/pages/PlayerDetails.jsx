import React from 'react';
import { useParams, Link } from 'react-router-dom';

const PlayerDetails = () => {
  const { id } = useParams();

  return (
    <div>
      <h2>Dettagli Giocatore #{id}</h2>
      <p>Statistiche e informazioni sul giocatore.</p>
      <Link to="/dashboard">← Torna alla Dashboard</Link>
    </div>
  );
};

export default PlayerDetails;