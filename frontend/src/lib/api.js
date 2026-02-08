import axios from 'axios';

const DEFAULT_API_BASE_URL = 'https://milagres-backend-851808661322.us-central1.run.app';

const sanitizeApiBaseUrl = (rawValue) => {
  const value = rawValue?.trim();

  if (!value) {
    return DEFAULT_API_BASE_URL;
  }

  const normalizedValue = value.toLowerCase();
  if (normalizedValue === 'undefined' || normalizedValue === 'null') {
    return DEFAULT_API_BASE_URL;
  }

  return value.replace(/\/+$/, '');
};

// Tenta ler do window.ENV (arquivo público), se não tiver usa process.env
const runtimeApiUrl = (window.ENV && window.ENV.API_URL) || process.env.REACT_APP_API_URL;
const normalizedBaseUrl = sanitizeApiBaseUrl(runtimeApiUrl);

export const API_BASE_URL = normalizedBaseUrl;

export const API_URL = API_BASE_URL.endsWith('/api')
  ? API_BASE_URL
  : `${API_BASE_URL}/api`;

export const api = axios.create({
  baseURL: API_URL,
});
