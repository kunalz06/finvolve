import fs from "fs";
import path from "path";

function normalizeValue(rawValue) {
    let value = rawValue.trim();

    if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
    ) {
        value = value.slice(1, -1);
    }

    return value.replace(/\\n/g, "\n");
}

export function loadLocalEnv() {
    const envFiles = [".env.local", ".env"];

    for (const fileName of envFiles) {
        const filePath = path.join(process.cwd(), fileName);
        if (!fs.existsSync(filePath)) {
            continue;
        }

        const content = fs.readFileSync(filePath, "utf8");
        for (const line of content.split(/\r?\n/)) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith("#")) {
                continue;
            }

            const separatorIndex = trimmed.indexOf("=");
            if (separatorIndex === -1) {
                continue;
            }

            const key = trimmed.slice(0, separatorIndex).trim();
            const rawValue = trimmed.slice(separatorIndex + 1);

            if (!key || process.env[key] !== undefined) {
                continue;
            }

            process.env[key] = normalizeValue(rawValue);
        }
    }
}
