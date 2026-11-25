import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
    cloudinaryCoursePath, courseCloudinaryConfig, courseCloudinaryDownload, createCourseUpload, matchesCourseUpload,
} from "../src/lib/server/course-cloudinary.mjs";

const config = courseCloudinaryConfig({ CLOUDINARY_URL: "cloudinary://test-key:test-secret@course-media" });
const now = 1_800_000_000_000;

test("an upload grant binds the private asset ID and expected bytes without exposing the API secret", () => {
    const grant = createCourseUpload(config, "course/submissions/student/assignment", { mime: "application/pdf", size: 256 }, now);
    assert.match(grant.path, /^course\/submissions\/student\/assignment\/[a-f0-9-]+\.pdf$/);
    assert.equal(grant.url, "https://api.cloudinary.com/v1_1/course-media/raw/upload");
    const { api_key, signature, ...signed } = grant.fields;
    const canonical = Object.entries(signed).sort().map(([key, value]) => `${key}=${value}`).join("&");
    assert.equal(signature, createHash("sha1").update(canonical + config.api_secret).digest("hex"));
    assert.equal(api_key, "test-key");
    assert.equal(signed.type, "authenticated");
    assert.equal(signed.overwrite, "false");
    assert.equal(signed.context, "course_bytes=256");
    assert.doesNotMatch(JSON.stringify(grant), /test-secret/);
});

test("file grants enforce Cloudinary Free limits and keep raw and video paths distinct", () => {
    const prefix = "course-preview/assets/admin";
    const mib = 1024 ** 2;
    assert.equal(createCourseUpload(config, prefix, { mime: "application/pdf", size: 10 * mib + 1 }), null);
    assert.equal(createCourseUpload(config, prefix, { mime: "video/mp4", size: 100 * mib + 1 }), null);
    assert.equal(createCourseUpload(config, prefix, { mime: "text/html", size: 1 }), null);
    const grant = createCourseUpload(config, prefix, { mime: "video/webm", size: 100 * mib }, now);
    assert.equal(grant.fields.allowed_formats, "webm");
    assert.equal(grant.fields.public_id + ".webm", grant.path);
    assert.equal(cloudinaryCoursePath(grant.path).resourceType, "video");
    assert.equal(cloudinaryCoursePath(grant.fields.public_id), null);
});

test("verification rejects public, oversized, mismatched and unapproved assets", () => {
    const grant = createCourseUpload(config, "course/assets/admin", { mime: "video/mp4", size: 256 }, now);
    const asset = cloudinaryCoursePath(grant.path);
    const record = {
        public_id: asset.publicId, resource_type: "video", type: "authenticated", format: "mp4", bytes: 256,
        context: { custom: { course_bytes: "256" } },
    };
    assert.equal(matchesCourseUpload(asset, record), true);
    assert.equal(matchesCourseUpload(asset, { ...record, type: "upload" }), false);
    assert.equal(matchesCourseUpload(asset, { ...record, public_id: "other" }), false);
    assert.equal(matchesCourseUpload(asset, { ...record, format: "webm" }), false);
    assert.equal(matchesCourseUpload(asset, { ...record, bytes: 257 }), false);
    assert.equal(matchesCourseUpload(asset, { ...record, context: {} }), false);
});

test("private downloads expire and raw public IDs keep exactly one extension", () => {
    const grant = createCourseUpload(config, "course/assets/admin", { mime: "application/zip", size: 256 }, now);
    const asset = cloudinaryCoursePath(grant.path);
    const result = new URL(courseCloudinaryDownload(config, asset, false, now));
    assert.equal(result.pathname, "/v1_1/course-media/raw/download");
    assert.equal(result.searchParams.get("public_id"), grant.path);
    assert.equal(result.searchParams.get("format"), null);
    assert.equal(result.searchParams.get("type"), "authenticated");
    assert.equal(result.searchParams.get("attachment"), "true");
    assert.equal(Number(result.searchParams.get("expires_at")), now / 1000 + 300);
    assert.ok(result.searchParams.get("signature"));
});
