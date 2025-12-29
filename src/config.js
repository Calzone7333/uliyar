
// DYNAMIC SERVER IP CONFIGURATION
// This automatically detects the IP you are using to access the site
// and sends API requests to the SAME IP but on port 8082.

const requestIp = window.location.hostname;

// If you access via localhost, requestIp = "localhost" -> API: "http://localhost:8082"
// If you access via 192.168.1.2, requestIp = "192.168.1.2" -> API: "http://192.168.1.2:8082"
// If you access via 115.97.59.230, requestIp = "115.97.59.230" -> API: "http://115.97.59.230:8082"

export const API_BASE_URL = `http://${requestIp}:8082`;

console.log("🔵 API Configured to:", API_BASE_URL);
