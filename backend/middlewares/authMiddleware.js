// Creazione del middleware di autenticazione

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({ message: "Autenticazione negata: token mancante o non valido." }); 
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Contiene l'ID dell'utente
        next();
        } catch (error) {
            return res.status(401).json({ message: "Autenticazione negata: token non valido o scaduto." }); 
        }
};

module.exports = { authMiddleware };