import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge } from 'react-bootstrap';

const TeamDetails = () => {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingPlayer, setUpdatingPlayer] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/teams/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Errore nel caricamento squadra');
      }

      const data = await response.json();
      setTeam(data);
    } catch (err) {
      console.error('Errore:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, [id]);

  const handleStatChange = async (playerId, field, delta) => {
    try {
      setUpdatingPlayer(playerId);
      const player = team.players.find((p) => p._id === playerId);
      const newValue = Math.max(0, (player[field] || 0) + delta);

      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/api/players/${playerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [field]: newValue }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Errore aggiornamento del giocatore');
      }

      const updated = await res.json();

      // Aggiorna localmente lo stato per evitare un nuovo fetch
      setTeam((prev) => ({
        ...prev,
        players: prev.players.map((p) =>
          p._id === updated._id ? updated : p
        ),
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingPlayer(null);
    }
  };

  const handleRemovePlayer = async (playerId) => {
    if (!window.confirm('Sei sicuro di voler rimuovere questo giocatore dalla squadra?')) return;

    try {
      setUpdatingPlayer(playerId);
      const token = localStorage.getItem('token');

      const res = await fetch(`http://localhost:3000/api/players/${id}/players/${playerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Errore durante la rimozione del giocatore');
      }

      const updatedTeam = await res.json();
      setTeam(updatedTeam);

      setSuccessMessage('Giocatore rimosso dalla squadra!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingPlayer(null);
    }
  };


  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  if (!team) return null;

  return (
    <Container className="mt-4">
      {successMessage && (
        <Alert variant="success" className='text-center'>
        {successMessage}
        </Alert>
      )}
      {error && (
        <Alert variant="danger" className='text-center'>
        {error}
        </Alert>
      )}
      <h2 className="text-center mb-4">Squadra: {team.nomeSquadra}</h2>
      <Row>
        {team.players.map((player) => (
          <Col key={player._id} md={4} className="mb-3">
            <Card className="shadow-sm h-100 position-relative">
              <Card.Body>
                <Button
                  variant="danger"
                  size="sm"
                  className="position-absolute top-0 end-0 m-2 rounded-circle"
                  onClick={() => handleRemovePlayer(player._id)}
                  disabled={updatingPlayer === player._id}
                >
                  {updatingPlayer === player._id ? (
                    <Spinner size="sm" />
                  ) : (
                    <i className="bi bi-x-lg"></i>
                  )}
                </Button>
                <Card.Title className='text-white'>{player.nome}</Card.Title>
                <Card.Subtitle className="mb-2 text-white">{player.ruolo}</Card.Subtitle>
                <Card.Text>
                  <Badge bg="primary" className="me-2">Gol: {player.gol || 0}</Badge>
                  <Badge bg="success" className="me-2">Assist: {player.assist || 0}</Badge>
                  <Badge bg="warning" className="me-2">Amm.: {player.ammonizioni || 0}</Badge>
                  <Badge bg="danger">Esp.: {player.espulsioni || 0}</Badge>
                </Card.Text>

                <div className="d-flex flex-wrap gap-3 justify-content-center">
                  {/* --- GOL --- */}
                  <div className="d-flex align-items-center gap-1">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleStatChange(player._id, 'gol', +1)}
                      disabled={updatingPlayer === player._id}
                    >
                      {updatingPlayer === player._id ? <Spinner size="sm" /> : <i className="bi bi-chevron-double-up"> Gol</i>}
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleStatChange(player._id, 'gol', -1)}
                      disabled={updatingPlayer === player._id}
                    >
                      {updatingPlayer === player._id ? <Spinner size="sm" /> : <i className="bi bi-chevron-double-down"> Gol</i>}
                    </Button>
                  </div>
                  {/* --- ASSIST --- */}
                  <div className="d-flex align-items-center gap-1">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleStatChange(player._id, 'assist', +1)}
                      disabled={updatingPlayer === player._id}
                    >
                      {updatingPlayer === player._id ? <Spinner size="sm" /> : <i className="bi bi-chevron-double-up"> Assist</i>}
                    </Button>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleStatChange(player._id, 'assist', -1)}
                      disabled={updatingPlayer === player._id}
                    >
                      {updatingPlayer === player._id ? <Spinner size="sm" /> : <i className="bi bi-chevron-double-down"> Assist</i>}
                    </Button>
                  </div>
                  {/* --- AMMONIZIONI --- */}
                  <div className="d-flex align-items-center gap-1">
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => handleStatChange(player._id, 'ammonizioni', +1)}
                      disabled={updatingPlayer === player._id}
                    >
                      {updatingPlayer === player._id ? <Spinner size="sm" /> : <i className="bi bi-chevron-double-up"> Ammonizioni</i>}
                    </Button>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => handleStatChange(player._id, 'ammonizioni', -1)}
                      disabled={updatingPlayer === player._id}
                    >
                      {updatingPlayer === player._id ? <Spinner size="sm" /> : <i className="bi bi-chevron-double-down"> Ammonizioni</i>}
                    </Button>
                  </div>
                  {/* --- ESPULSIONI --- */}
                  <div className="d-flex align-items-center gap-1">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleStatChange(player._id, 'espulsioni', +1)}
                      disabled={updatingPlayer === player._id}
                    >
                      {updatingPlayer === player._id ? <Spinner size="sm" /> : <i className="bi bi-chevron-double-up"> Espulsioni</i>}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleStatChange(player._id, 'espulsioni', -1)}
                      disabled={updatingPlayer === player._id}
                    >
                      {updatingPlayer === player._id ? <Spinner size="sm" /> : <i className="bi bi-chevron-double-down"> Espulsioni</i>}
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default TeamDetails;
