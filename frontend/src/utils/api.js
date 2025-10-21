// Returns the backend API URL based on environment
export function getApiUrl() {
    return import.meta.env.VITE_API_URL || "http://localhost:5000";
}

// Returns full image URL, with fallback if missing
export function getImageUrl(imagePath) {
    if (!imagePath) return "https://via.placeholder.com/220x140?text=No+Image";

    return imagePath.startsWith("http") ?
        imagePath :
        `${getApiUrl()}/uploads/${imagePath.replace(/^uploads[\\/]/, "")}`;
}