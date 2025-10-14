// Middleware per la gestione degli errori

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Gestione degli errori di validazione di Mongoose
    if (err.name === 'ValidationError') {
        return res.status(400).json({ 
            message: 'Errore di validazione',
            errors: Object.values(err.errors).map(e => e.message)
        });
    } 

    // Gestione errori ID non valido
    if (err.name === 'CastError') {
        return res.status(400).json({ 
            message: 'ID non valido'
        });
    }

    // Errori generici
    return res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Errore interno del server'
    });
};

module.exports = { errorHandler };