const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    apiId: {
        type: Number,
        required: true,
    }, // Id del giocatore nell'API esterna
    nome: {
        type: String,
        required: true,
    },
    squadra: {
        type: String,
        required: true,
    },
    ruolo: {
        type: String,
        required: true,
    },
    nazionalità: {
        type: String,
        required: true,
    },
    gol: {
        type: Number,
        default: 0
    },
    assist: {
        type: Number,
        default: 0
    },
    ammonizioni: {
        type: Number,
        default: 0
    },
    espulsioni: {
        type: Number,
        default: 0
    },
},
    { timestamps: true }
);

module.exports = mongoose.model('Player', playerSchema);