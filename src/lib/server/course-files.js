import { getStorage } from "firebase-admin/storage";
import { getAdminApp } from "@/lib/firebase-admin";
import { CourseError } from "./course-payments";
import {
    cloudinaryCoursePath, courseCloudinaryConfig, courseCloudinaryDownload, createCourseUpload,
    lookupCourseUpload, matchesCourseUpload,
} from "./course-cloudinary.mjs";

const FILE_TYPES = {
    asset: ["application/pdf", "application/zip", "video/mp4", "video/webm", "text/plain"],
    submission: ["application/pdf", "application/zip", "text/plain"],
};

function cloudinaryConfig() {
    const config = courseCloudinaryConfig();
    if (!config) throw new CourseError("Course file storage is unavailable.", 503);
    return config;
}

function legacyBucket() {
    const name = process.env.COURSE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    if (!name) throw new CourseError("Course file storage is unavailable.", 503);
    return getStorage(getAdminApp()).bucket(name);
}

export function prepareCourseUpload(prefix, role, { mime, size }) {
    const result = FILE_TYPES[role].includes(mime) && createCourseUpload(cloudinaryConfig(), prefix, { mime, size });
    if (!result) throw new CourseError("This file type or size is unsupported.");
    return result;
}

export async function confirmedCourseFile(prefix, role, value, acceptedTypes = FILE_TYPES[role]) {
    const asset = value.path.startsWith(`${prefix}/`) && cloudinaryCoursePath(value.path);
    if (!asset || value.path.slice(prefix.length + 1).includes("/")) throw new CourseError("Invalid file.");
    if (!acceptedTypes.includes(asset.mime)) throw new CourseError("This file type is unsupported.");
    const config = cloudinaryConfig();
    let record;
    try {
        record = await lookupCourseUpload(config, asset);
    } catch (error) {
        if (Number(error.http_code || error.error?.http_code) === 404) throw new CourseError("Upload the file before saving.");
        throw new CourseError("The upload could not be verified. Try again shortly.", 503);
    }
    if (!matchesCourseUpload(asset, record)) throw new CourseError("The uploaded file does not match the approved type or size.");
    return {
        path: value.path, name: value.name.replace(/[\r\n"\\/]/g, "_"), mime: asset.mime, size: record.bytes,
    };
}

export async function readCourseFile(file, { inline = false } = {}) {
    if (!file?.path) throw new CourseError("File unavailable.", 404);
    const asset = cloudinaryCoursePath(file.path);
    if (asset) return { url: courseCloudinaryDownload(cloudinaryConfig(), asset, inline && asset.resourceType === "video") };

    // Existing assets keep their original provider until they are re-uploaded.
    const [url] = await legacyBucket().file(file.path).getSignedUrl({
        version: "v4",
        action: "read",
        expires: Date.now() + (inline ? 120 : 5) * 60_000,
        responseType: file.mime === "application/x-zip-compressed" ? "application/zip" : file.mime,
        responseDisposition: inline ? "inline" : `attachment; filename*=UTF-8''${encodeURIComponent(file.name)}`,
    });
    return { url };
}
