import React, { useState, useEffect } from 'react';
import { Container, Table, Tabs, Tab, Alert, Spinner, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

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
        const response = await fetch(`${API_URL}/api/teams/${id}`, {
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

  // Filtra e ordina gli ammoniti (solo quelli con ammonizioni > 0)
  const ammoniti = [...players]
    .filter(player => (player.ammonizioni || 0) > 0)
    .sort((a, b) => (b.ammonizioni || 0) - (a.ammonizioni || 0));

  // Filtra e ordina gli espulsi (solo quelli con espulsioni > 0)
  const espulsi = [...players]
    .filter(player => (player.espulsioni || 0) > 0)
    .sort((a, b) => (b.espulsioni || 0) - (a.espulsioni || 0));

    // Totali
    const totaleGol = marcatori.reduce((sum, player) => sum + (player.gol || 0), 0);
    const totaleAssist = assistman.reduce((sum, player) => sum + (player.assist || 0), 0);
    const totaleAmmonizioni = ammoniti.reduce((sum, player) => sum + (player.ammonizioni || 0), 0);
    const totaleEspulsioni = espulsi.reduce((sum, player) => sum + (player.espulsioni || 0), 0);

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  if (error) return <Alert variant="danger" className="mt-3">{error}</Alert>;

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .custom-tabs .nav-tabs {
            display: flex;
            flex-wrap: wrap;
          }
          .custom-tabs .nav-item {
            flex: 0 0 50%;
            max-width: 50%;
          }
          .custom-tabs .nav-link {
            font-size: 0.85rem;
            padding: 0.5rem 0.25rem;
            text-align: center;
            white-space: normal;
            word-wrap: break-word;
          }
        }
      `}</style>
      <Container className="mt-4">
      <h2 className="text-center mb-4 text-white">Classifiche della Squadra</h2>
      <Button
        variant="primary"
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        Torna alla Squadra
      </Button>

      {marcatori.length === 0 && assistman.length === 0 && ammoniti.length === 0 && espulsi.length === 0 ? (
        <Alert variant="info">
          Nessun giocatore ha ancora statistiche registrate
        </Alert>
      ) : (
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-4 custom-tabs"
        >
          <Tab
            eventKey="marcatori"
            title={`Classifica Marcatori (${marcatori.length})`}
            className='table-dark'
          >
            <div className="custom-tabs-content mb-4 mb-md-0">
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
                  {/* Riga totale gol */}
                  <tr className='fw-bold bg-secondary'>
                    <td colSpan="3" className="text-end">Totale Gol</td>
                    <td>{totaleGol}</td>
                  </tr>
                </tbody>
              </Table>
            ) : (
              <Alert variant="info" className="mt-3">
                Nessun giocatore ha ancora segnato
              </Alert>
            )}
            </div>
          </Tab>

          <Tab
            eventKey="assistman"
            title={`Classifica Assist (${assistman.length})`}
          >
            <div className="custom-tabs-content mb-4 mb-md-0">
            {assistman.length > 0 ? (
              <>
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
                  {/* Riga totale assist */}
                  <tr className='fw-bold bg-secondary'>
                    <td colSpan="3" className="text-end">Totale Assist</td>
                    <td>{totaleAssist}</td>
                  </tr>
                </tbody>
              </Table>
              </>
            ) : (
              <Alert variant="info" className="mt-3">
                Nessun giocatore ha ancora fatto assist
              </Alert>
            )}
            </div>
          </Tab>

          <Tab
            eventKey="ammoniti"
            title={`Classifica Ammoniti (${ammoniti.length})`}
          >
            <div className="custom-tabs-content mb-4 mb-md-0">
            {ammoniti.length > 0 ? (
              <Table striped bordered hover responsive className='table-dark'>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Giocatore</th>
                    <th>Ruolo</th>
                    <th>Ammonizioni</th>
                  </tr>
                </thead>
                <tbody>
                  {ammoniti.map((player, index) => (
                    <tr key={player._id}>
                      <td>{index + 1}</td>
                      <td>{player.nome}</td>
                      <td>{player.ruolo}</td>
                      <td>{player.ammonizioni}</td>
                    </tr>
                  ))}
                  {/* Riga totale ammonizioni */}
                  <tr className='fw-bold bg-secondary'>
                    <td colSpan="3" className="text-end">Totale Ammonizioni</td>
                    <td>{totaleAmmonizioni}</td>
                  </tr>
                </tbody>
              </Table>
            ) : (
              <Alert variant="info" className="mt-3">
                Nessun giocatore ha ancora ricevuto ammonizioni
              </Alert>
            )}
            </div>
          </Tab>

          <Tab
            eventKey="espulsi"
            title={`Classifica Espulsi (${espulsi.length})`}
          >
            <div className="custom-tabs-content mb-4 mb-md-0">
            {espulsi.length > 0 ? (
              <Table striped bordered hover responsive className='table-dark'>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Giocatore</th>
                    <th>Ruolo</th>
                    <th>Espulsioni</th>
                  </tr>
                </thead>
                <tbody>
                  {espulsi.map((player, index) => (
                    <tr key={player._id}>
                      <td>{index + 1}</td>
                      <td>{player.nome}</td>
                      <td>{player.ruolo}</td>
                      <td>{player.espulsioni}</td>
                    </tr>
                  ))}
                  {/* Riga totale espulsioni */}
                  <tr className='fw-bold bg-secondary'>
                    <td colSpan="3" className="text-end">Totale Espulsioni</td>
                    <td>{totaleEspulsioni}</td>
                  </tr>
                </tbody>
              </Table>
            ) : (
              <Alert variant="info" className="mt-3">
                Nessun giocatore ha ancora ricevuto espulsioni
              </Alert>
            )}
            </div>
          </Tab>
        </Tabs>
      )}
    </Container>
    </>
  );
};

export default Classifica;