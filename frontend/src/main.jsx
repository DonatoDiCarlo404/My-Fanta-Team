import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import { API_URL } from './config.js';

// Debug logs per le variabili d'ambiente
console.group('🚀 [APP] Startup Debug Info');
console.log('Environment:', import.meta.env.MODE);
console.log('API URL:', API_URL);
console.log('Production?:', import.meta.env.PROD);
console.groupEnd();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
