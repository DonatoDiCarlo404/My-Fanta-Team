import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import PlayerCard from '../components/PlayerCardComponent';
import { API_URL } from '../config';

const AddPlayers = () => {
  const [players, setPlayers] = useState([]);
  const [teamPlayers, setTeamPlayers] = useState([]); // Nuovo stato per i giocatori della squadra
  const [serieATeams, setSerieATeams] = useState([]);
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

  // Carica le squadre Serie A dal backend (ID ufficiali football-data)
  useEffect(() => {
    const fetchSerieATeams = async () => {
      try {
        const response = await fetch(`${API_URL}/api/external/serie-a-teams`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) throw new Error('Errore nel caricamento delle squadre Serie A');

        const data = await response.json();
        setSerieATeams(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchSerieATeams();
  }, []);

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
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
        >
          <option value="">Seleziona...</option>
          {serieATeams.map((team) => (
            <option key={team.id} value={team.id}>{team.nome}</option>
          ))}
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