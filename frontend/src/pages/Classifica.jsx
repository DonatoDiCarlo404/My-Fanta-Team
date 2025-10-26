import React, { useState, useEffect } from 'react';
import { Container, Table, Tabs, Tab, Alert, Spinner, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

const Classifica = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('marcatori');
  const { id } = useParams(); // Prendi l'ID della squadra dall'URL
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeamPlayers = async () => {
      try {
        const token = localStorage.getItem('token');
        // Modifica la chiamata API per ottenere i giocatori della squadra specifica
        const response = await fetch(`http://localhost:3000/api/teams/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Errore nel caricamento dei giocatori');

        const data = await response.json();
        setPlayers(data.players || []); // Prendi i giocatori dalla squadra
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamPlayers();
  }, [id]);

  // Filtra e ordina i marcatori (solo quelli con gol > 0)
  const marcatori = [...players]
    .filter(player => (player.gol || 0) > 0)
    .sort((a, b) => (b.gol || 0) - (a.gol || 0));

  // Filtra e ordina gli assistman (solo quelli con assist > 0)
  const assistman = [...players]
    .filter(player => (player.assist || 0) > 0)
    .sort((a, b) => (b.assist || 0) - (a.assist || 0));

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  if (error) return <Alert variant="danger" className="mt-3">{error}</Alert>;

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Classifiche della Squadra</h2>
      <Button
        variant="primary"
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        Torna alla Squadra
      </Button>

      {marcatori.length === 0 && assistman.length === 0 ? (
        <Alert variant="info">
          Nessun giocatore ha ancora segnato gol o fornito assist
        </Alert>
      ) : (
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-4"
        >
          <Tab
            eventKey="marcatori"
            title={`Classifica Marcatori (${marcatori.length})`}
          >
            {marcatori.length > 0 ? (
              <Table striped bordered hover responsive className='table-dark'>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Giocatore</th>
                    <th>Ruolo</th>
                    <th>Gol</th>
                  </tr>
                </thead>
                <tbody>
                  {marcatori.map((player, index) => (
                    <tr key={player._id}>
                      <td>{index + 1}</td>
                      <td>{player.nome}</td>
                      <td>{player.ruolo}</td>
                      <td>{player.gol}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <Alert variant="info" className="mt-3">
                Nessun giocatore ha ancora segnato
              </Alert>
            )}
          </Tab>

          <Tab
            eventKey="assistman"
            title={`Classifica Assist (${assistman.length})`}
          >
            {assistman.length > 0 ? (
              <Table striped bordered hover responsive className='table-dark'>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Giocatore</th>
                    <th>Ruolo</th>
                    <th>Assist</th>
                  </tr>
                </thead>
                <tbody>
                  {assistman.map((player, index) => (
                    <tr key={player._id}>
                      <td>{index + 1}</td>
                      <td>{player.nome}</td>
                      <td>{player.ruolo}</td>
                      <td>{player.assist}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <Alert variant="info" className="mt-3">
                Nessun giocatore ha ancora fatto assist
              </Alert>
            )}
          </Tab>
        </Tabs>
      )}
    </Container>
  );
};

export default Classifica;