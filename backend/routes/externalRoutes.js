const express = require('express');
const router = express.Router();
require('dotenv').config();

router.get('/players', async (req, res) => {
    const { teamId } = req.query;
    if (!teamId) {
        return res.status(400).json({ message: 'teamId è obbligatorio' });
    }
    
    const url = `https://api.football-data.org/v4/teams/${teamId}`;
    const options = {
        method: 'GET',
        headers: {
            'X-Auth-Token': process.env.FOOTBALL_API_TOKEN,
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await fetch(url, options);
        
        // Logga lo status della risposta
        console.log('Status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error data:', errorData);
            return res.status(response.status).json({ 
                message: 'Errore nel recupero dati',
                error: errorData 
            });
        }

        const data = await response.json();
        console.log('Data received:', data);

        if (!data.squad) {
            return res.status(404).json({ message: 'Nessun giocatore trovato' });
        }

        const players = data.squad.map(player => ({
            id: player.id,
            nome: player.name,
            ruolo: player.position,
            nazionalità: player.nationality,
            squadra: data.name // Nome della squadra dalla risposta principale
        }));

        res.json(players);
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ 
            message: 'Errore nel recupero dei dati',
            error: error.message 
        });
    }
});

module.exports = router;