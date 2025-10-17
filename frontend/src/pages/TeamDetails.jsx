import React from 'react';
import { useParams, Link } from 'react-router-dom';

const TeamDetails = () => {
  const { id } = useParams();

  return (
    <div>
      <h2>Dettagli Squadra #{id}</h2>
      <p>Giocatori e statistiche della squadra.</p>
      <Link to="/dashboard">← Torna alla Dashboard</Link>
    </div>
  );
};

export default TeamDetails;