import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Alert, NavDropdown } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import PlayerCard from '../components/PlayerCardComponent';
import { API_URL } from '../config';

const AddPlayers = () => {
  const [players, setPlayers] = useState([]);
  const [teamPlayers, setTeamPlayers] = useState([]); // Nuovo stato per i giocatori della squadra
  const [error, setError] = useState('');
  const [teamId, setTeamId] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // Stato per la ricerca per cognome
  const { id } = useParams();
  const navigate = useNavigate();

  // Funzione per caricare i giocatori della squadra
  const fetchTeamPlayers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/teams/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Errore nel caricamento della squadra');

      const data = await response.json();
      setTeamPlayers(data.players || []);
    } catch (err) {
      console.error('Error fetching team players:', err);
    }
  };

  // Carica i giocatori della squadra all'avvio
  useEffect(() => {
    fetchTeamPlayers();
  }, [id]);

  // Carica i giocatori disponibili quando viene selezionata una squadra
  useEffect(() => {
    const fetchPlayers = async (teamId) => {
      try {
        const response = await fetch(`${API_URL}/api/external/players?teamId=${teamId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) throw new Error('Errore nel caricamento dei giocatori');

        const data = await response.json();
        // Filtra i giocatori già presenti nella squadra
        const filteredPlayers = data.filter(player => 
          !teamPlayers.some(teamPlayer => teamPlayer.apiId === player.id)
        );
        setPlayers(filteredPlayers);
      } catch (err) {
        setError(err.message);
      }
    };

    if (teamId) {
      fetchPlayers(teamId);
    }
  }, [teamId, teamPlayers]);

  const handleAddPlayer = async (player) => {
    try {
      // Prima creiamo/otteniamo il giocatore
      const playerResponse = await fetch(`${API_URL}/api/players`, {
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

      if (!playerResponse.ok) {
        const errorData = await playerResponse.json();
        throw new Error(errorData.message || 'Errore nella creazione del giocatore');
      }

      const playerData = await playerResponse.json();

      // Aggiunta del giocatore alla squadra
      const teamResponse = await fetch(`${API_URL}/api/teams/${id}/players`, {
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
        throw new Error('Errore nell\'aggiornamento della squadra');
      }

      // Aggiorna la lista dei giocatori della squadra
      await fetchTeamPlayers();
      
      // Rimuovi il giocatore dalla lista dei disponibili
      setPlayers(prev => prev.filter(p => p.id !== player.id));

    } catch (err) {
      console.error('Error details:', err);
      setError(err.message);
    }
  };

  return (
    <Container className="mt-4">
      <h1 className='d-flex justify-content-center'>Aggiungi Calciatori alla Squadra</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Group className="mb-4 d-grid justify-content-center">
        <Form.Label className='text-dark'>Seleziona una Squadra di Serie A</Form.Label>
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
          <option value="450">Hellas Verona</option>
        </Form.Control>
      </Form.Group>

      {/* Barra di ricerca per cognome */}
      {teamId && (
        <Form.Group className="mb-4 w-25 mx-auto">
          <Form.Control
            type="text"
            placeholder="🔍 Cerca calciatore..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-center"
          />
        </Form.Group>
      )}

      <Row>
        {players
          .filter(player => {
            // Filtra i giocatori in base al termine di ricerca
            if (!searchTerm) return true;
            return player.nome.toLowerCase().includes(searchTerm.toLowerCase());
          })
          .map(player => (
            <Col key={player.id} md={4}>
              <PlayerCard
                player={player}
                onAddPlayer={handleAddPlayer}
              />
            </Col>
          ))}
      </Row>

      {/* Messaggio se non ci sono risultati */}
      {teamId && searchTerm && players.filter(player => 
        player.nome.toLowerCase().includes(searchTerm.toLowerCase())
      ).length === 0 && (
        <Alert variant="info" className="text-center">
          Nessun giocatore trovato!"{searchTerm}"
        </Alert>
      )}
    </Container>
  );
};

export default AddPlayers;