import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [teams, setTeams] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [teamName, setTeamName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Carica le squadre dell'utente
    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/teams', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) throw new Error('Errore nel caricamento delle squadre');

            const data = await response.json();
            setTeams(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCreateTeam = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/teams', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ nomeSquadra: teamName })
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message);

            // Reindirizza alla pagina della squadra
            navigate(`/team/${data._id}`);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Container className="mt-4">
            <h1 className="mb-4 text-dark">Le Mie Squadre</h1>

            {error && <Alert variant="danger">{error}</Alert>}

            <Button
                variant="primary"
                className="mb-4"
                onClick={() => setShowCreateForm(!showCreateForm)}
            >
                + Crea nuova squadra
            </Button>

            {showCreateForm && (
                <Card className="mb-4">
                    <Card.Body>
                        <Form onSubmit={handleCreateTeam}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nome Squadra</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Button type="submit">Crea Squadra</Button>
                        </Form>
                    </Card.Body>
                </Card>
            )}

            <Row>
                {teams.map(team => (
                    <Col key={team._id} md={4} className="mb-4">
                        <Card>
                            <Card.Body>
                                <Card.Title className='text-white text-center mb-3'>{team.nomeSquadra}</Card.Title>
                                <div className="d-flex gap-2 justify-content-center">
                                    <Button
                                        variant="info"
                                        onClick={() => navigate(`/team/${team._id}`)}
                                    >
                                        <i className="bi bi-pencil-square"> Gestione Squadra</i>
                                    </Button>
                                    <Button
                                        variant="success"
                                        onClick={() => navigate(`/team/${team._id}/add-players`)}
                                    >
                                        <i className="bi bi-person-add"> Aggiungi Giocatore</i>
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Dashboard;