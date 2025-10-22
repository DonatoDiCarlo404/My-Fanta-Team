const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const Team = require('../models/Team');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Rotta per creare un nuovo giocatore
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { apiId, nome, squadra, ruolo, nazionalità } = req.body;
        
        // Verifica se il giocatore esiste già
        const existingPlayer = await Player.findOne({ apiId });
        if (existingPlayer) {
            return res.status(400).json({ message: 'Giocatore già esistente' });
        }

        // Crea nuovo giocatore
        const newPlayer = await Player.create({
            apiId,
            nome,
            squadra,
            ruolo,
            nazionalità
        });

        res.status(201).json(newPlayer);
    } catch (error) {
        console.error('Errore creazione giocatore:', error);
        res.status(500).json({ message: error.message });
    }
});

// Rotta per aggiungere un giocatore a una squadra
router.put('/:teamId/players', authMiddleware, async (req, res) => {
    try {
        const { teamId } = req.params;
        const { playerId } = req.body;

        const updatedTeam = await Team.findByIdAndUpdate(
            teamId,
            { $push: { players: playerId } },
            { new: true }
        );

        if (!updatedTeam) {
            return res.status(404).json({ message: 'Squadra non trovata' });
        }

        res.json(updatedTeam);
    } catch (error) {
        console.error('Errore aggiornamento squadra:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;