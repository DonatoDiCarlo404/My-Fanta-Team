import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Alert, NavDropdown } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import PlayerCard from '../components/PlayerCardComponent';

const AddPlayers = () => {
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState('');
  const [teamId, setTeamId] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Carica i giocatori quando viene selezionata una squadra
    const fetchPlayers = async (teamId) => {
      try {
        const response = await fetch(`http://localhost:3000/api/external/players?teamId=${teamId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) throw new Error('Errore nel caricamento dei giocatori');

        const data = await response.json();
        setPlayers(data);
      } catch (err) {
        setError(err.message);
      }
    };

    if (teamId) {
      fetchPlayers(teamId);
    }
  }, [teamId]);

  const handleAddPlayer = async (player) => {
    try {
        console.log('Sending player data:', player);

        // Prima creiamo il giocatore
        const playerResponse = await fetch('http://localhost:3000/api/players', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                apiId: player.id,
                nome: player.nome,
                ruolo: player.ruolo,
                squadra: player.squadra,
                nazionalità: player.nazionalità
            })
        });

        const playerData = await playerResponse.json();
        
        if (!playerResponse.ok) {
            throw new Error(playerData.message || 'Errore nella creazione del giocatore');
        }

        console.log('Player created:', playerData);

        // Poi aggiungiamo il giocatore alla squadra
        const teamResponse = await fetch(`http://localhost:3000/api/players/${id}/players`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                playerId: playerData._id
            })
        });

        if (!teamResponse.ok) {
            const errorData = await teamResponse.json();
            throw new Error(errorData.message || 'Errore nell\'aggiornamento della squadra');
        }

        // Rimuovi il giocatore dalla lista
        setPlayers(players.filter(p => p.id !== player.id));
        
    } catch (err) {
        console.error('Error details:', err);
        setError(err.message);
    }
};

  return (
    <Container className="mt-4">
      <h1 className='d-flex justify-content-center text-dark'>Aggiungi Giocatori alla Squadra</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Group className="mb-4 d-grid justify-content-center">
        <Form.Label>Seleziona una Squadra di Serie A</Form.Label>
        <Form.Control 
          as="select"
          onChange={(e) => setTeamId(e.target.value)}
        >
          <option value="">Seleziona...</option>
          <option value="102">Atalanta</option>
          <NavDropdown.Divider />
          <option value="103">Bologna</option>
          <NavDropdown.Divider />
          <option value="104">Cagliari</option>
          <NavDropdown.Divider />
          <option value="7397">Como</option>
          <NavDropdown.Divider />
          <option value="457">Cremonese</option>
          <NavDropdown.Divider />
          <option value="99">Fiorentina</option>
          <NavDropdown.Divider />
          <option value="107">Genoa</option>
          <NavDropdown.Divider />
          <option value="108">Inter</option>
          <NavDropdown.Divider />
          <option value="109">Juventus</option>
          <NavDropdown.Divider />
          <option value="110">Lazio</option>
          <NavDropdown.Divider />
          <option value="5890">Lecce</option>
          <NavDropdown.Divider />
          <option value="98">Milan</option>
          <NavDropdown.Divider />
          <option value="113">Napoli</option>
          <NavDropdown.Divider />
          <option value="112">Parma</option>
          <NavDropdown.Divider />
          <option value="487">Pisa</option>
          <NavDropdown.Divider />
          <option value="100">Roma</option>
          <NavDropdown.Divider />
          <option value="471">Sassuolo</option>
          <NavDropdown.Divider />
          <option value="586">Torino</option>
          <NavDropdown.Divider />
          <option value="115">Udinese</option>
          <NavDropdown.Divider />
          <option value="502">Hellas Verona</option>
        </Form.Control>
      </Form.Group>

      <Row>
        {players.map(player => (
          <Col key={player.id} md={4}>
            <PlayerCard 
              player={player} 
              onAddPlayer={handleAddPlayer}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AddPlayers;