const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    nomeSquadra: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    players: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    }],
},
    { timestamps: true }
);

module.exports = mongoose.model('Team', teamSchema);