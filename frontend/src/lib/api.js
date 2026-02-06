const FALLBACK_API_BASE_URL = 'https://milagres-backend-851808661322.us-central1.run.app';

const normalizeBaseUrl = (value) => {
  if (typeof value !== 'string') {
    return '';
  }

  const trimmedValue = value.trim();
  const lowerCaseValue = trimmedValue.toLowerCase();

  if (!trimmedValue || lowerCaseValue === 'undefined' || lowerCaseValue === 'null') {
    return '';
  }

  return trimmedValue.replace(/\/+$/, '');
};

const configuredApiBaseUrl = normalizeBaseUrl(process.env.REACT_APP_API_URL);

export const API_BASE_URL = configuredApiBaseUrl || FALLBACK_API_BASE_URL;
export const API_URL = `${API_BASE_URL}/api`;
