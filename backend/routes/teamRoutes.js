const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Ottieni tutte le squadre dell'utente
router.get('/', authMiddleware, async (req, res) => {
    try {
        const teams = await Team.find({ userId: req.user.id });
        res.json(teams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Ottieni una squadra specifica con i suoi giocatori
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const team = await Team.findById(req.params.id)
            .populate('players'); // Popola i dati dei giocatori

        if (!team) {
            return res.status(404).json({ message: 'Squadra non trovata' });
        }

        // Verifica che l'utente sia il proprietario della squadra
        if (team.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Non autorizzato' });
        }

        res.json(team);
    } catch (error) {
        console.error('Errore recupero squadra:', error);
        res.status(500).json({ message: error.message });
    }
});

// Crea una nuova squadra
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { nomeSquadra } = req.body;

        const newTeam = await Team.create({
            nomeSquadra,
            userId: req.user.id,
            players: []
        });

        res.status(201).json(newTeam);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Aggiorna una squadra esistente
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({ message: 'Squadra non trovata' });
        }

        if (team.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Non autorizzato' });
        }

        const updatedTeam = await Team.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedTeam);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Elimina una squadra
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({ message: 'Squadra non trovata' });
        }

        if (team.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Non autorizzato' });
        }

        await Team.findByIdAndDelete(req.params.id);
        res.json({ message: 'Squadra eliminata con successo' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;