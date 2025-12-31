
// DYNAMIC SERVER IP CONFIGURATION
// This automatically detects the IP you are using to access the site
// and sends API requests to the SAME IP but on port 8082.

const hostname = window.location.hostname;

// DYNAMIC API CONFIGURATION
// Supports:
// - localhost -> http://localhost:8082
// - 192.168.1.2 -> http://192.168.1.2:8082
// - 115.97.59.230 -> http://115.97.59.230:8082
// - uliyar.com -> http://uliyar.com:8082

export const API_BASE_URL = `http://${hostname}:8082`;

console.log(`🔵 API Configured for ${hostname} ->`, API_BASE_URL);
