const FALLBACK_API_BASE_URL = 'https://milagres-backend-851808661322.us-central1.run.app';

const INVALID_PLACEHOLDERS = new Set(['', 'undefined', 'null']);

const normalizeApiBaseUrl = (value) => {
  const normalizedValue = typeof value === 'string' ? value.trim() : '';

  if (INVALID_PLACEHOLDERS.has(normalizedValue.toLowerCase())) {
    return FALLBACK_API_BASE_URL;
  }

  try {
    const parsedUrl = new URL(normalizedValue);
    const isSupportedProtocol = parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';

    if (!isSupportedProtocol) {
      return FALLBACK_API_BASE_URL;
    }

    return parsedUrl.origin;
  } catch {
    return FALLBACK_API_BASE_URL;
  }
};

export const API_BASE_URL = normalizeApiBaseUrl(process.env.REACT_APP_API_URL);
export const API_URL = `${API_BASE_URL}/api`;
