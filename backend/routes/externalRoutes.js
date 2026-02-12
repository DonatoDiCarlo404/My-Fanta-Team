const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const { authMiddleware } = require('../middlewares/authMiddleware');
require('dotenv').config();

// ID delle squadre Serie A su football-data.org
const SERIE_A_TEAMS = [
    108, // Inter
    109, // Juventus
    110, // Lazio
    98,  // Milan
    99,  // Fiorentina
    100, // Roma
    102, // Atalanta
    103, // Bologna
    104, // Cagliari
    107, // Genoa
    108, // Inter
    112, // Parma
    113, // Napoli
    115, // Udinese
    450, // Hellas Verona
    471, // Torino
    488, // Empoli
    511, // Sassuolo
    514, // Salernitana
    584, // Monza
    1106 // Como
];

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

// Endpoint per sincronizzare tutti i giocatori con l'API
router.post('/sync-players', authMiddleware, async (req, res) => {
    const options = {
        method: 'GET',
        headers: {
            'X-Auth-Token': process.env.FOOTBALL_API_TOKEN,
            'Content-Type': 'application/json'
        }
    };

    try {
        console.log('Inizio sincronizzazione giocatori...');
        
        // Recupera tutti i giocatori dal database
        const dbPlayers = await Player.find();
        console.log(`Trovati ${dbPlayers.length} giocatori nel database`);
        
        if (dbPlayers.length === 0) {
            return res.json({
                success: true,
                message: 'Nessun giocatore da sincronizzare',
                stats: {
                    totale: 0,
                    aggiornati: 0,
                    invariati: 0,
                    squadreProcessate: 0,
                    errori: []
                }
            });
        }
        
        // Crea una mappa degli ID API per un accesso rapido
        const playerMap = new Map();
        dbPlayers.forEach(player => {
            playerMap.set(player.apiId, player);
        });

        let updated = 0;
        let unchanged = 0;
        let errors = [];

        // Recupera le squadre Serie A dall'API
        console.log('Recupero lista squadre Serie A...');
        const competitionUrl = 'https://api.football-data.org/v4/competitions/SA/teams';
        const teamsResponse = await fetch(competitionUrl, options);
        
        if (teamsResponse.status === 429) {
            return res.status(429).json({
                success: false,
                message: 'Rate limit raggiunto. Riprova tra qualche minuto.',
                error: 'Too Many Requests'
            });
        }
        
        if (!teamsResponse.ok) {
            throw new Error('Errore nel recupero delle squadre Serie A');
        }

        const teamsData = await teamsResponse.json();
        console.log(`Trovate ${teamsData.teams.length} squadre in Serie A`);

        // Per evitare rate limits, processiamo solo le squadre che hanno giocatori nel nostro DB
        let processedTeams = 0;
        const DELAY_MS = 7000; // 7 secondi tra le richieste (per restare sotto 10 richieste/minuto)

        // Per ogni squadra, recupera la rosa e aggiorna i giocatori
        for (const team of teamsData.teams) {
            // Controlla se abbiamo giocatori di questa squadra
            const hasPlayersFromTeam = dbPlayers.some(p => 
                p.squadra === team.name || p.squadra === team.shortName
            );
            
            if (!hasPlayersFromTeam) {
                console.log(`Saltando ${team.name} - nessun giocatore nel database`);
                continue;
            }
            
            console.log(`Processando squadra: ${team.name}`);
            
            // Pausa per rispettare i rate limits dell'API (7 secondi)
            if (processedTeams > 0) {
                console.log(`Attendo ${DELAY_MS/1000} secondi per rate limit...`);
                await new Promise(resolve => setTimeout(resolve, DELAY_MS));
            }
            
            const teamUrl = `https://api.football-data.org/v4/teams/${team.id}`;
            const teamResponse = await fetch(teamUrl, options);
            
            if (teamResponse.status === 429) {
                errors.push(`Rate limit raggiunto su ${team.name}. Fermando la sincronizzazione.`);
                console.log('Rate limit raggiunto, interruzione sincronizzazione');
                break;
            }
            
            if (!teamResponse.ok) {
                errors.push(`Errore nel recupero della squadra ${team.name}`);
                continue;
            }

            const teamData = await teamResponse.json();
            processedTeams++;
            
            if (!teamData.squad) {
                continue;
            }

            // Controlla ogni giocatore della rosa
            for (const apiPlayer of teamData.squad) {
                const dbPlayer = playerMap.get(apiPlayer.id);
                
                if (dbPlayer) {
                    // Verifica se la squadra è cambiata
                    if (dbPlayer.squadra !== teamData.name) {
                        console.log(`Aggiornamento: ${dbPlayer.nome} da ${dbPlayer.squadra} a ${teamData.name}`);
                        
                        await Player.findByIdAndUpdate(dbPlayer._id, {
                            squadra: teamData.name,
                            ruolo: apiPlayer.position || dbPlayer.ruolo,
                            nazionalità: apiPlayer.nationality || dbPlayer.nazionalità
                        });
                        
                        updated++;
                    } else {
                        unchanged++;
                    }
                }
            }
        }

        res.json({
            success: true,
            message: 'Sincronizzazione completata',
            stats: {
                totale: dbPlayers.length,
                aggiornati: updated,
                invariati: unchanged,
                squadreProcessate: processedTeams,
                errori: errors
            }
        });

    } catch (error) {
        console.error('Errore sincronizzazione:', error);
        res.status(500).json({ 
            success: false,
            message: 'Errore durante la sincronizzazione',
            error: error.message 
        });
    }
});

module.exports = router;