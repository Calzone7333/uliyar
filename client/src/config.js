const isProduction = window.location.hostname === 'uliyar.com' || window.location.hostname === 'www.uliyar.com';
export const API_BASE_URL = isProduction
    ? 'https://uliyar.com'
    : `http://${window.location.hostname}:8082`;

// If the backend is served on the same domain but different port during dev
// and same domain/path in production, you can adjust accordingly.
