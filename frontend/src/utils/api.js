// src/utils/api.js - Fixed version
export function getApiUrl() {
    // Use the Render URL directly since environment variable isn't working
    const apiUrl = "https://electronic-vzq5.onrender.com";
    console.log('🔗 getApiUrl() returning:', apiUrl);
    return apiUrl;
}

export function getImageUrl(imagePath) {
    const svgFallback = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='140' viewBox='0 0 220 140'%3E%3Crect width='220' height='140' fill='%23f3f4f6'/%3E%3Ctext x='110' y='70' font-family='Arial' font-size='14' text-anchor='middle' dominant-baseline='middle' fill='%236b7280'%3ENo Image%3C/text%3E%3C/svg%3E";

    if (!imagePath || typeof imagePath !== 'string') {
        return svgFallback;
    }

    if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
        return imagePath;
    }

    const baseUrl = getApiUrl();
    const cleanPath = imagePath.replace(/^.*[\\\/]/, '');
    return `${baseUrl}/api/images/${cleanPath}`;
}