import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const tempRoot = path.join(root, ".tmp-netlify-api-routes");

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

moveRoutesOut();

try {
    const result = spawnSync("npx", ["next", "build"], {
        cwd: root,
        env: {
            ...process.env,
            NETLIFY_STATIC_EXPORT: "true",
        },
        shell: process.platform === "win32",
        stdio: "inherit",
    });

    process.exitCode = result.status || 0;

    if (result.error) {
        throw result.error;
    }
} finally {
    restoreRoutes();
}
