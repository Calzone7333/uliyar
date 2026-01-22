export const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:8082'
    : 'https://uliyar.com'; // Adjust this to your production API URL if different

// If the backend is served on the same domain but different port during dev
// and same domain/path in production, you can adjust accordingly.
