const isProduction = window.location.hostname === 'uliyar.com' || window.location.hostname === 'www.uliyar.com';
export const API_BASE_URL = isProduction
    ? `${window.location.protocol}//${window.location.hostname}`
    : `http://${window.location.hostname}:8082`;

// Helper to get image URL
export const getImgUrl = (path) => {
    if (!path) return '';
    // If it's a full URL from our system (contains /uploads/), strip domain and use current API_BASE_URL
    if (path.includes('/uploads/')) {
        const relativePath = path.substring(path.lastIndexOf('/uploads/'));
        return `${API_BASE_URL}${encodeURI(relativePath)}`;
    }
    // External URL
    if (path.startsWith('http')) return path;

    // Relative path - assume it's an upload
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_BASE_URL}${encodeURI(cleanPath)}`;
};

