function normalizeOrigin(value) {
    const raw = String(value || "").trim().replace(/^['"]|['"]$/g, "");
    if (!raw) return "";

    const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

    try {
        const url = new URL(withProtocol);
        if (!["http:", "https:"].includes(url.protocol)) return "";
        return url.origin.replace(/\/$/, "");
    } catch {
        return "";
    }
}

export function getFirstConfiguredOrigin(...values) {
    for (const value of values) {
        const candidates = String(value || "")
            .split(",")
            .map((candidate) => candidate.trim())
            .filter(Boolean);

        for (const candidate of candidates) {
            const origin = normalizeOrigin(candidate);
            if (origin) return origin;
        }
    }

    return "";
}

export function getRequestOrigin(request) {
    const proto = request?.headers?.get("x-forwarded-proto") || "https";
    const host = request?.headers?.get("host");
    return host ? normalizeOrigin(`${proto}://${host}`) : "";
}

export function getCanonicalSiteUrl(request) {
    return (
        getFirstConfiguredOrigin(
            process.env.DEV_APP_SITE_URL,
            process.env.NEXT_PUBLIC_DEV_APP_SITE_URL,
            process.env.NEXT_PUBLIC_SITE_URL,
            process.env.SITE_URL,
        ) || getRequestOrigin(request)
    );
}

export function getCanonicalApiUrl(request) {
    return (
        getFirstConfiguredOrigin(
            process.env.NEXT_PUBLIC_API_BASE_URL,
            process.env.API_BASE_URL,
        ) || getRequestOrigin(request)
    );
}
