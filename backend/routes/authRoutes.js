const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Creazione rotta per la registrazione
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password)
            return res.status(400).json({ message: 'Tutti i campi sono obbligatori' });

        const existing= await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Utente già esistente' });
        
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: passwordHash });
        await newUser.save();

        res.status(201).json({ message: 'Utente registrato con successo' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore del server' });
    }
});

// Creazione rotta per il login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Utente non trovato' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Password non valida' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.json({
            token,
            user: { id: user._id, username: user.username, email: user.email },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore del server' });
    }
})

module.exports = router;