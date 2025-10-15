const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const Team = require('../models/Team');
// const Player = require('../models/Player');

// Rotta per creare una nuova squadra
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { nomeSquadra } = req.body;

        // Crea nuova squadra per l'utente autenticato
        const newTeam = await Team.create({
            nomeSquadra,
            userId: req.user.id,
            players: [],
        });

        res.status(201).json(newTeam);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Rotta per ottenere tutte le squadre dell'utente autenticato
router.get("/", authMiddleware, async (req, res) => {
    try {
        const teams = await Team.find({ userId: req.user.id }).populate('players');
        res.json(teams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Rotta per aggiornare una squadra
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updated = await Team.findByIdAndUpdate(id, updateData, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Rotta per eliminare una squadra
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        await Team.findByIdAndDelete(id);
        res.json({ message: "Squadra eliminata con successo" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;