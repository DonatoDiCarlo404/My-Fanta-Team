export const API_URL = import.meta.env.VITE_API_URL || 'https://my-fanta-team-backend.onrender.com';

// Debug fetch wrapper
export const debugFetch = async (url, options = {}) => {
    console.log('🚀 Chiamata API a:', url);
    console.log('Opzioni:', options);

    try {
        const response = await fetch(url, options);
        console.log('📥 Stato risposta:', response.status);

        const responseText = await response.text();
        console.log('📝 Risposta raw:', responseText);

        try {
            const data = JSON.parse(responseText);
            console.log('📦 Dati parsati:', data);
            return { data, response };
        } catch (e) {
            console.warn('⚠️ Impossibile parsare JSON, la risposta non è JSON:', e);
            throw new Error(`Errore del server: ${response.status}`);
        }
    } catch (error) {
        console.error('❌ debugFetch errore completo:', error);
        throw error;
    }
};