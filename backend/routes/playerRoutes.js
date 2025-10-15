const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware')
const router = express.Router();
const Player = require('../models/Player');

// Rotta per aggiornare statistiche di un giocatore
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updated = await Player.findByIdAndUpdate(id, updateData, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;