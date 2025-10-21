// src/utils/api.js

// Returns the backend API URL based on environment
export function getApiUrl() {
    const apiUrl =
        import.meta.env.VITE_API_URL || "http://localhost:5000";
    console.log('getApiUrl() returning:', apiUrl);
    return apiUrl;
}

// Returns full image URL, with fallback if missing
export function getImageUrl(imagePath) {
    // SVG data URL fallback
    const svgFallback = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='140' viewBox='0 0 220 140'%3E%3Crect width='220' height='140' fill='%23f3f4f6'/%3E%3Ctext x='110' y='70' font-family='Arial' font-size='14' text-anchor='middle' dominant-baseline='middle' fill='%236b7280'%3ENo Image%3C/text%3E%3C/svg%3E";

    if (!imagePath || typeof imagePath !== 'string') {
        return svgFallback;
    }

    if (imagePath.startsWith('data:')) {
        return imagePath;
    }

    if (imagePath.startsWith("http")) {
        return imagePath;
    }

    const baseUrl = getApiUrl();
    const cleanPath = imagePath.replace(/^.*[\\\/]/, '');

    return `${baseUrl}/api/images/${cleanPath}`;
}

// Export both functions
export default {
    getApiUrl,
    getImageUrl
};