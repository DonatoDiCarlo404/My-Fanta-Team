const API_URL = import.meta.env.VITE_API_URL || 'https://my-fanta-team-backend.onrender.com';

// Production-safe debugging
try {
    const debugInfo = {
        VITE_API_URL: import.meta.env.VITE_API_URL,
        API_URL: API_URL,
        MODE: import.meta.env.MODE,
        IS_PROD: import.meta.env.PROD,
        IS_DEV: import.meta.env.DEV,
        TIME: new Date().toISOString()
    };

    // Force log in both environments
    console.warn('🔧 [CONFIG] Debug Info:', debugInfo);
    
    // Save for console access
    window._debug = debugInfo;
    
} catch (error) {
    console.error('Debug logging failed:', error);
}

export { API_URL };