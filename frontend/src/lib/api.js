const envApiBaseUrl = process.env.REACT_APP_API_URL?.trim();

const normalizedBaseUrl = envApiBaseUrl
  ? envApiBaseUrl.replace(/\/+$/, '')
  : 'https://milagres-backend-851808661322.us-central1.run.app';

export const API_BASE_URL = normalizedBaseUrl;

export const API_URL = API_BASE_URL.endsWith('/api')
  ? API_BASE_URL
  : `${API_BASE_URL}/api`;
