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

// Rotta per ottenere tutti i giocatori
router.get('/', authMiddleware, async (req, res) => {
    try {
        const players = await Player.find();
        res.json(players);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Rotta per ottenere un giocatore specifico
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const player = await Player.findById(req.params.id);
        if (!player) {
            return res.status(404).json({ message: 'Giocatore non trovato' });
        }
        res.json(player);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Rotta per aggiornare le statistiche di un giocatore (PATCH invece di PUT)
router.patch('/:id', authMiddleware, async (req, res) => {
    try {
        const { gol, assist, ammonizioni, espulsioni } = req.body;
        
        // Verifica che i valori non siano negativi
        const updates = {};
        if (gol !== undefined) updates.gol = Math.max(0, gol);
        if (assist !== undefined) updates.assist = Math.max(0, assist);
        if (ammonizioni !== undefined) updates.ammonizioni = Math.max(0, ammonizioni);
        if (espulsioni !== undefined) updates.espulsioni = Math.max(0, espulsioni);

        const player = await Player.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        if (!player) {
            return res.status(404).json({ message: 'Giocatore non trovato' });
        }

        res.json(player);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Rotta per aggiungere un giocatore a una squadra
router.put('/:teamId/players', authMiddleware, async (req, res) => {
    try {
        const { teamId } = req.params;
        const { playerId } = req.body;

        // Verifica che il giocatore esista
        const player = await Player.findById(playerId);
        if (!player) {
            return res.status(404).json({ message: 'Giocatore non trovato' });
        }

        const updatedTeam = await Team.findByIdAndUpdate(
            teamId,
            { $push: { players: playerId } },
            { new: true }
        ).populate('players');

        if (!updatedTeam) {
            return res.status(404).json({ message: 'Squadra non trovata' });
        }

        res.json(updatedTeam);
    } catch (error) {
        console.error('Errore aggiornamento squadra:', error);
        res.status(500).json({ message: error.message });
    }
});

// Rotta per rimuovere un giocatore da una squadra
router.delete('/:teamId/players/:playerId', authMiddleware, async (req, res) => {
    try {
        const { teamId, playerId } = req.params;

        // Verifica che la squadra esista
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: 'Squadra non trovata' });
        }

        // Verifica che il giocatore esista
        const player = await Player.findById(playerId);
        if (!player) {
            return res.status(404).json({ message: 'Giocatore non trovato' });
        }

        // Rimuovi il giocatore dalla lista
        const updatedTeam = await Team.findByIdAndUpdate(
            teamId,
            { $pull: { players: playerId } },
            { new: true }
        ).populate('players');

        res.json(updatedTeam);
    } catch (error) {
        console.error('Errore rimozione giocatore dalla squadra:', error);
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;