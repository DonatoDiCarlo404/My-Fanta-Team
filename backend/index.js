const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connessione a MongoDB
mongoose.connect(process.env.MONGO_URI)
   .then(() => console.log('Connesso a MongoDB'))
   .catch(err => console.error('Errore di connessione a MongoDB:', err));
   
// Route
app.get('/test', (req, res) => {
    res.json({ message: 'Server connesso!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server corrente sulla porta ${PORT}`);
});