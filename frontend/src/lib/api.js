const FALLBACK_API_BASE_URL = 'https://milagres-backend-851808661322.us-central1.run.app';

const rawApiBaseUrl = process.env.REACT_APP_API_URL;
const normalizedApiBaseUrl = typeof rawApiBaseUrl === 'string' ? rawApiBaseUrl.trim() : '';
const hasInvalidConfiguredValue = ['undefined', 'null', ''].includes(normalizedApiBaseUrl.toLowerCase());

export const API_BASE_URL = hasInvalidConfiguredValue ? FALLBACK_API_BASE_URL : normalizedApiBaseUrl;
export const API_URL = `${API_BASE_URL}/api`;
