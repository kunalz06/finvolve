import { v2 as cloud } from "cloudinary";
import { cloudinaryCoursePath, courseCloudinaryConfig, courseCloudinaryDownload, lookupCourseUpload, matchesCourseUpload } from "../src/lib/server/course-cloudinary.mjs";
if (process.env.VERCEL_ENV !== "preview") throw Error("Preview required.");
const config = courseCloudinaryConfig();
if (!config) throw Error("Cloudinary configuration is missing.");
const expected = "Finvolve Cloudinary preview round-trip check. Synthetic data only.\n";
const list = await cloud.api.resources({ ...config, resource_type: "raw", type: "authenticated", prefix: "course-preview/assets/", max_results: 40 });
let found = false;
for (const row of list.resources) {
    if (row.bytes !== Buffer.byteLength(expected) || !row.public_id.endsWith(".txt")) continue;
    const asset = cloudinaryCoursePath(row.public_id);
    if (!asset || !matchesCourseUpload(asset, await lookupCourseUpload(config, asset))) continue;
    const response = await fetch(courseCloudinaryDownload(config, asset, false), { signal: AbortSignal.timeout(12000) });
    if (!response.ok) { console.log("COURSE_STORAGE_DOWNLOAD_HTTP", response.status); continue; }
    if (await response.text() !== expected) continue;
    if (!response.headers.get("content-disposition")?.startsWith("attachment")) throw Error("Attachment response expected.");
    found = true;
    break;
}
if (!found) throw Error("The private file did not match.");
console.log("COURSE_STORAGE_ROUND_TRIP_OK 67 bytes authenticated attachment");
