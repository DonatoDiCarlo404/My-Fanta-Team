import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, ProgressBar } from 'react-bootstrap';
import { API_URL } from '../config';

const PlayerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/players/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Giocatore non trovato');
        const data = await response.json();
        setPlayer(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [id]);

  if (loading) return <div>Caricamento...</div>;
  if (error) return <div>Errore: {error}</div>;
  if (!player) return <div>Giocatore non trovato</div>;

  const maxStats = 50; // Valore massimo per le barre di progresso

  return (
    <Container className="mt-4">
      <Card>
        <Card.Body className="text-center text-white">
          <Card.Title className="mb-4">{player.nome}</Card.Title>
          <div className="mb-4">
            <p><strong>Ruolo:</strong> {player.ruolo}</p>
            <p><strong>Squadra:</strong> {player.squadra}</p>
            <p><strong>Nazionalità:</strong> {player.nazionalità}</p>
          </div>

          <div className="mb-3">
            <label>Gol</label>
            <ProgressBar 
              now={(player.gol / maxStats) * 100} 
              label={player.gol}
              variant="success"
              className="mb-2"
            />
          </div>

          <div className="mb-3">
            <label>Assist</label>
            <ProgressBar 
              now={(player.assist / maxStats) * 100} 
              label={player.assist}
              variant="info"
              className="mb-2"
            />
          </div>

          <div className="mb-3">
            <label>Ammonizioni</label>
            <ProgressBar 
              now={(player.ammonizioni / maxStats) * 100} 
              label={player.ammonizioni}
              variant="warning"
              className="mb-2"
            />
          </div>

          <div className="mb-4">
            <label>Espulsioni</label>
            <ProgressBar 
              now={(player.espulsioni / maxStats) * 100} 
              label={player.espulsioni}
              variant="danger"
            />
          </div>

          <Button 
            variant="primary" 
            onClick={() => navigate(-1)}
          >
            Torna alla Squadra
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PlayerDetails;