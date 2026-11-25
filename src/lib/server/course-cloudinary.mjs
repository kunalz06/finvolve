import { randomUUID } from "node:crypto";
import { v2 as cloudinary } from "cloudinary";

const TYPE = "authenticated";
const MiB = 1024 ** 2;
const media = {
    pdf: { mime: "application/pdf", resourceType: "raw", maxBytes: 10 * MiB },
    zip: { mime: "application/zip", resourceType: "raw", maxBytes: 10 * MiB },
    txt: { mime: "text/plain", resourceType: "raw", maxBytes: 10 * MiB },
    mp4: { mime: "video/mp4", resourceType: "video", maxBytes: 100 * MiB },
    webm: { mime: "video/webm", resourceType: "video", maxBytes: 100 * MiB },
};
const coursePath = /^course(?:-preview)?\/(?:assets\/[\w-]+|submissions\/[\w-]+\/[\w-]+)\/[a-f0-9-]{36}\.(pdf|zip|txt|mp4|webm)$/;
const extensions = Object.fromEntries(Object.entries(media).map(([format, { mime }]) => [mime, format]));

export function courseCloudinaryConfig(env = process.env) {
    const cloud = env.CLOUDINARY_URL;
    if (!cloud) return null;
    try {
        const url = new URL(cloud);
        if (url.protocol !== "cloudinary:" || !/^[a-z0-9_-]+$/i.test(url.hostname) || !url.username || !url.password) return null;
        return { cloud_name: url.hostname, api_key: decodeURIComponent(url.username), api_secret: decodeURIComponent(url.password) };
    } catch {
        return null;
    }
}

export function cloudinaryCoursePath(path) {
    const match = coursePath.exec(path);
    if (!match) return null;
    const format = match[1];
    const asset = media[format];
    const publicId = asset.resourceType === "raw" ? path : path.slice(0, -(format.length + 1));
    return { ...asset, format, publicId };
}

export function createCourseUpload(config, prefix, { mime, size }, now = Date.now()) {
    const format = extensions[mime];
    const path = `${prefix}/${randomUUID()}.${format}`;
    const asset = cloudinaryCoursePath(path);
    if (!asset || !Number.isSafeInteger(size) || size < 1 || size > asset.maxBytes) return null;
    const params = {
        public_id: asset.publicId,
        timestamp: String(Math.floor(now / 1000)),
        type: TYPE,
        overwrite: "false",
        context: `course_bytes=${size}`,
        ...(asset.resourceType === "video" ? { allowed_formats: format } : {}),
    };
    const signature = cloudinary.utils.api_sign_request(params, config.api_secret);
    return {
        path,
        url: `https://api.cloudinary.com/v1_1/${config.cloud_name}/${asset.resourceType}/upload`,
        fields: { ...params, api_key: config.api_key, signature },
    };
}

export function lookupCourseUpload(config, asset) {
    return cloudinary.api.resource(asset.publicId, {
        ...config, resource_type: asset.resourceType, type: TYPE, context: true, timeout: 6000,
    });
}

export function matchesCourseUpload(asset, record) {
    const { bytes, public_id, resource_type, type, format, context } = record;
    return public_id === asset.publicId && resource_type === asset.resourceType && type === TYPE &&
        (asset.resourceType === "raw" || format === asset.format) &&
        Number.isSafeInteger(bytes) && bytes > 0 && bytes <= asset.maxBytes &&
        context?.custom?.course_bytes === String(bytes);
}

export function courseCloudinaryDownload(config, asset, inline, now = Date.now()) {
    return cloudinary.utils.private_download_url(asset.publicId, asset.resourceType === "raw" ? undefined : asset.format, {
        ...config, resource_type: asset.resourceType, type: TYPE,
        expires_at: Math.floor(now / 1000) + (inline ? 120 : 5) * 60,
        attachment: !inline,
    });
}
