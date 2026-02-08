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

const normalizedBaseUrl = sanitizeApiBaseUrl(process.env.REACT_APP_API_URL);

export const API_BASE_URL = normalizedBaseUrl;

export const API_URL = API_BASE_URL.endsWith('/api')
  ? API_BASE_URL
  : `${API_BASE_URL}/api`;
