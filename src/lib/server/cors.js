import { NextResponse } from "next/server";

function splitOrigins(value) {
    return String(value || "")
        .split(",")
        .map((origin) => origin.trim().replace(/\/$/, ""))
        .filter(Boolean);
}

function configuredOrigins() {
    return [
        ...splitOrigins(process.env.CORS_ALLOWED_ORIGINS),
        ...splitOrigins(process.env.NETLIFY_ALLOWED_ORIGINS),
        ...splitOrigins(process.env.NEXT_PUBLIC_SITE_URL),
        ...splitOrigins(process.env.SITE_URL),
    ];
}

function isAllowedOrigin(origin) {
    if (!origin) return false;

    const normalizedOrigin = origin.replace(/\/$/, "");
    if (configuredOrigins().includes(normalizedOrigin)) return true;

    return /^https?:\/\/localhost(:\d+)?$/.test(normalizedOrigin) ||
        /^https?:\/\/127\.0\.0\.1(:\d+)?$/.test(normalizedOrigin);
}

export function getCorsHeaders(request) {
    const origin = request.headers.get("origin");
    if (!isAllowedOrigin(origin)) return {};

    return {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
        Vary: "Origin",
    };
}

export function corsJson(request, body, init = {}) {
    return NextResponse.json(body, {
        ...init,
        headers: {
            ...(init.headers || {}),
            ...getCorsHeaders(request),
        },
    });
}

export function corsPreflight(request) {
    return new NextResponse(null, {
        status: 204,
        headers: getCorsHeaders(request),
    });
}
