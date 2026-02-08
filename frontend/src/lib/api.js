import axios from 'axios';

// --- SOLUÇÃO NUCLEAR: URL DIRETA ---
// Removemos process.env, window.ENV e sanitização.
// O endereço é fixo. Não tem como dar undefined.

const BACKEND_URL = 'https://milagres-backend-851808661322.us-central1.run.app';

export const API_BASE_URL = BACKEND_URL;

// Garante que a URL final tenha o /api
export const API_URL = `${API_BASE_URL}/api`;

export const api = axios.create({
  baseURL: API_URL,
});

// Logs para você ver no Console do navegador se funcionou
console.log('🔌 Conectando na API:', API_URL);