const isProduction = window.location.hostname === 'uliyar.com' || window.location.hostname === 'www.uliyar.com';
export const API_BASE_URL = isProduction
    ? `${window.location.protocol}//${window.location.hostname}`
    : `http://${window.location.hostname}:8082`;

// Helper to get image URL
export const getImgUrl = (path) => {
    if (!path) return '';

    // Normalize path: replace backslashes and ensure logical correctness
    let cleanPath = path.replace(/\\/g, '/');

    // If it's a full URL
    if (cleanPath.startsWith('http')) {
        // If it's our own domain, strip it to handle protocol changes or port changes
        if (cleanPath.includes(window.location.hostname)) {
            try {
                const urlObj = new URL(cleanPath);
                cleanPath = urlObj.pathname;
            } catch (e) {
                // Fallback
            }
        } else {
            return cleanPath;
        }
    }

    // Ensure it starts with /
    if (!cleanPath.startsWith('/')) {
        cleanPath = '/' + cleanPath;
    }

    // If it's an upload path, route it through /api/uploads to ensure it works via proxy
    if (cleanPath.startsWith('/uploads/')) {
        return `${API_BASE_URL}/api${encodeURI(cleanPath)}`;
    }

    // Fallback for other paths
    return `${API_BASE_URL}${encodeURI(cleanPath)}`;

