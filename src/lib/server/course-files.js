import { randomUUID } from "node:crypto";
import { getStorage } from "firebase-admin/storage";
import { getAdminApp } from "@/lib/firebase-admin";
import { CourseError } from "./course-payments";

export const FILE_TYPES = {
    asset: ["application/pdf", "application/zip", "video/mp4", "video/webm", "text/plain"],
    submission: ["application/pdf", "application/zip", "application/x-zip-compressed", "text/plain"],
};

function bucket() {
    const name = process.env.COURSE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    if (!name) throw new CourseError("Course file storage is unavailable.", 503);
    return getStorage(getAdminApp()).bucket(name);
}

function maxBytes(role, mime) {
    return role === "submission" ? 20 * 1024 ** 2 : mime.startsWith("video/") ? 500 * 1024 ** 2 : 50 * 1024 ** 2;
}

export async function prepareCourseUpload(prefix, role, { mime, size }) {
    if (!FILE_TYPES[role].includes(mime) || size < 1 || size > maxBytes(role, mime)) {
        throw new CourseError("This file type or size is unsupported.");
    }
    const path = `${prefix}/${randomUUID()}`;
    const headers = {
        "Content-Type": mime,
        "x-goog-if-generation-match": "0",
        "x-goog-content-length-range": `${size},${size}`,
    };
    const [url] = await bucket().file(path).getSignedUrl({
        version: "v4",
        action: "write",
        expires: Date.now() + 15 * 60_000,
        contentType: mime,
        extensionHeaders: {
            "x-goog-if-generation-match": headers["x-goog-if-generation-match"],
            "x-goog-content-length-range": headers["x-goog-content-length-range"],
        },
    });
    return { path, url, headers };
}

export async function confirmedCourseFile(prefix, role, value, acceptedTypes = FILE_TYPES[role]) {
    if (!value.path.startsWith(`${prefix}/`) || !/^[a-f0-9-]{36}$/.test(value.path.slice(prefix.length + 1))) {
        throw new CourseError("Invalid file.");
    }
    try {
        const [metadata] = await bucket().file(value.path).getMetadata();
        const size = Number(metadata.size);
        if (!acceptedTypes.includes(metadata.contentType) || !size || size > maxBytes(role, metadata.contentType)) {
            throw new CourseError("This file type or size is unsupported.");
        }
        return { path: value.path, name: value.name.replace(/[\r\n"\\/]/g, "_"), mime: metadata.contentType, size };
    } catch (error) {
        if (Number(error.code) === 404) throw new CourseError("Upload the file before saving.");
        throw error;
    }
}

export async function readCourseFile(file, { inline = false } = {}) {
    if (!file?.path) throw new CourseError("File unavailable.", 404);
    const [url] = await bucket().file(file.path).getSignedUrl({
        version: "v4",
        action: "read",
        expires: Date.now() + (inline ? 120 : 5) * 60_000,
        responseType: file.mime === "application/x-zip-compressed" ? "application/zip" : file.mime,
        responseDisposition: inline ? "inline" : `attachment; filename*=UTF-8''${encodeURIComponent(file.name)}`,
    });
    return { url };
}
