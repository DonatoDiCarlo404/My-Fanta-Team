import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [teams, setTeams] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [teamName, setTeamName] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [deletingTeam, setDeletingTeam] = useState(null);
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

    const handleDeleteTeam = async (teamId) => {
        if (!window.confirm('Sei sicuro di voler eliminare questa squadra? L\'operazione è irreversibile.')) return;

        try {
            setDeletingTeam(teamId);
            const token = localStorage.getItem('token');

            const response = await fetch(`http://localhost:3000/api/teams/${teamId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || 'Errore durante l\'eliminazione della squadra');

            // Rimuovi la squadra dalla lista locale
            setTeams((prev) => prev.filter((team) => team._id !== teamId));

            // Mostra messaggio di successo temporaneo
            setSuccessMessage('Squadra eliminata con successo!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setDeletingTeam(null);
        }
    };

    return (
        <Container className="mt-4">
            <h1 className="mb-4 text-white">Le Mie Squadre</h1>

            {successMessage && (
                <Alert variant="success" className="text-center">
                    {successMessage}
                </Alert>
            )}
            {error && (
                <Alert variant="danger" className="text-center">
                    {error}
                </Alert>
            )}


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
                        <Card className="position-relative">
                            <Card.Body>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    className="position-absolute top-0 end-0 m-2 rounded-circle"
                                    onClick={() => handleDeleteTeam(team._id)}
                                    disabled={deletingTeam === team._id}
                                >
                                    {deletingTeam === team._id ? (
                                        <span className="spinner-border spinner-border-sm" />
                                    ) : (
                                        <i className="bi bi-x-lg"></i>
                                    )}
                                </Button>

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