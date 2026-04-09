const store = globalThis.__finvolveRateLimitStore || new Map();
globalThis.__finvolveRateLimitStore = store;

export function getRequestIp(request) {
    const forwardedFor = request.headers.get("x-forwarded-for");
    if (forwardedFor) {
        return forwardedFor.split(",")[0].trim();
    }

    return request.headers.get("x-real-ip") || "unknown";
}

export function checkRateLimit(key, { windowMs, maxRequests }) {
    const now = Date.now();
    const entry = store.get(key);

    if (!entry || now > entry.expiresAt) {
        store.set(key, { count: 1, expiresAt: now + windowMs });
        return { allowed: true, remaining: maxRequests - 1, retryAfterMs: 0 };
    }

    if (entry.count >= maxRequests) {
        return {
            allowed: false,
            remaining: 0,
            retryAfterMs: Math.max(0, entry.expiresAt - now),
        };
    }

    entry.count += 1;
    store.set(key, entry);

    return {
        allowed: true,
        remaining: Math.max(0, maxRequests - entry.count),
        retryAfterMs: 0,
    };
}
