export function getApiBaseUrl() {
    const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "")
        .trim()
        .replace(/^['"]|['"]$/g, "")
        .replace(/\/$/, "");

    if (!apiBaseUrl) return "";
    if (/^https?:\/\//i.test(apiBaseUrl)) return apiBaseUrl;
    if (/^[a-z0-9.-]+\.[a-z]{2,}(?::\d+)?(?:\/.*)?$/i.test(apiBaseUrl)) {
        return `https://${apiBaseUrl}`;
    }

    return apiBaseUrl;
}

export function apiUrl(path) {
    if (/^https?:\/\//i.test(path)) return path;

    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const apiBaseUrl = getApiBaseUrl();

    return apiBaseUrl ? `${apiBaseUrl}${normalizedPath}` : normalizedPath;
}
