import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const tempRoot = path.join(root, ".tmp-netlify-api-routes");
const allowMissingApiBaseUrl = process.env.ALLOW_MISSING_NETLIFY_API_BASE_URL === "true";

function assertNetlifyFrontendEnv() {
    const apiBaseUrl = String(process.env.NEXT_PUBLIC_API_BASE_URL || "").trim();

    if (!apiBaseUrl && !allowMissingApiBaseUrl) {
        console.error(
            [
                "Missing NEXT_PUBLIC_API_BASE_URL.",
                "Netlify is a frontend-only deployment for this app, so browser API calls must point to the Vercel backend.",
                "Set NEXT_PUBLIC_API_BASE_URL to the Vercel app URL in Netlify environment variables.",
            ].join("\n"),
        );
        process.exit(1);
    }

    if (apiBaseUrl && !/^https?:\/\//i.test(apiBaseUrl)) {
        console.error("NEXT_PUBLIC_API_BASE_URL must be an absolute http(s) URL.");
        process.exit(1);
    }
}

const apiRoutes = [
    {
        source: path.join(root, "src", "app", "dev", "api"),
        target: path.join(tempRoot, "dev-api"),
    },
    {
        source: path.join(root, "src", "app", "iemminor", "api"),
        target: path.join(tempRoot, "iemminor-api"),
    },
];

function moveRoutesOut() {
    fs.rmSync(tempRoot, { recursive: true, force: true });
    fs.mkdirSync(tempRoot, { recursive: true });

    for (const route of apiRoutes) {
        if (!fs.existsSync(route.source)) continue;
        fs.mkdirSync(path.dirname(route.target), { recursive: true });
        fs.renameSync(route.source, route.target);
    }
}

function restoreRoutes() {
    for (const route of apiRoutes) {
        if (!fs.existsSync(route.target)) continue;
        fs.mkdirSync(path.dirname(route.source), { recursive: true });
        fs.renameSync(route.target, route.source);
    }

    fs.rmSync(tempRoot, { recursive: true, force: true });
}

assertNetlifyFrontendEnv();
moveRoutesOut();

try {
    const nextCli = path.join(root, "node_modules", "next", "dist", "bin", "next");
    const result = spawnSync(process.execPath, [nextCli, "build"], {
        cwd: root,
        env: {
            ...process.env,
            NETLIFY_STATIC_EXPORT: "true",
        },
        stdio: "inherit",
    });

    process.exitCode = result.status || 0;

    if (result.error) {
        throw result.error;
    }
} finally {
    restoreRoutes();
}
