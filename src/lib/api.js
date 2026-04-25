export function getApiBaseUrl() {
    return (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
}

export function apiUrl(path) {
    if (/^https?:\/\//i.test(path)) return path;

    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const apiBaseUrl = getApiBaseUrl();

    return apiBaseUrl ? `${apiBaseUrl}${normalizedPath}` : normalizedPath;
}
