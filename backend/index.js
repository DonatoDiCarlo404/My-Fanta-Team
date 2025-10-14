const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rotte integrate
app.use('/api/auth', authRoutes);

// Connessione a MongoDB
mongoose.connect(process.env.MONGO_URI)
   .then(() => console.log('Connesso a MongoDB'))
   .catch(err => console.error('Errore di connessione a MongoDB:', err));
   
// Route test connessione
app.get('/test', (req, res) => {
    res.json({ message: 'Server connesso!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server corrente sulla porta ${PORT}`);
});