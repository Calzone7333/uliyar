export const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://127.0.0.1:8082'
    : '';

// If the backend is served on the same domain but different port during dev
// and same domain/path in production, you can adjust accordingly.
