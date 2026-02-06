const FALLBACK_API_BASE_URL = 'https://milagres-backend-851808661322.us-central1.run.app';

export const API_BASE_URL = process.env.REACT_APP_API_URL || FALLBACK_API_BASE_URL;
export const API_URL = `${API_BASE_URL}/api`;
