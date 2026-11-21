import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";
import {
    DEFAULT_SETTINGS, ITEM_TYPES, MODULES, canPublish, isAssessment, summarizeProgress,
} from "@/lib/course.mjs";
import { courseCollection, courseFilesRoot } from "./course-environment";
import { CourseError, courseEnrollment, enrollmentCheckout, isEnrolled } from "./course-payments";

const COURSE_CONFIG = courseCollection("course_config");
export const COURSE_ITEMS = courseCollection("course_items");

export async function courseUser(request) {
    const match = /^Bearer (\S+)$/.exec(request.headers.get("authorization") || "");
    if (!match) throw new CourseError("Sign in to continue.", 401);
    let user;
    try {
        user = await getAdminAuth().verifyIdToken(match[1], true);
    } catch (error) {
        if (["auth/id-token-revoked", "auth/id-token-expired", "auth/argument-error", "auth/invalid-id-token", "auth/user-disabled", "auth/user-not-found"].includes(error.code)) {
            throw new CourseError("Your session expired. Sign in again to continue.", 401);
        }
        throw error;
    }
    return { ...user, isAdmin: user.admin === true || user.role === "admin" };
}

export function configRef(db) {
    return db.collection(COURSE_CONFIG).doc("professional-technology-2026");
}

export async function courseSettings(db) {
    return { ...DEFAULT_SETTINGS, ...(await configRef(db).get()).data() };
}

export function publicCourseSettings(settings) {
    const checkout = enrollmentCheckout(settings);
    if (!settings.published || !canPublish(settings)) return { published: false, hardcopyPrice: null, ...checkout };
    return { ...settings, ...checkout };
}

export const itemRef = (db, id) => db.collection(COURSE_ITEMS).doc(id);
export const uploadPrefix = (uid, itemId) => `${courseFilesRoot}/submissions/${uid}/${itemId}`;
export const assetPrefix = (uid) => `${courseFilesRoot}/assets/${uid}`;

export async function courseItems(db, includeUnpublished = false) {
    const collection = db.collection(COURSE_ITEMS);
    const result = await (includeUnpublished ? collection : collection.where("published", "==", true)).get();
    return result.docs.map((doc) => ({ ...doc.data(), id: doc.id })).sort((a, b) =>
        MODULES.findIndex((module) => module.id === a.module) - MODULES.findIndex((module) => module.id === b.module) ||
        (a.startsAt || a.createdAt).localeCompare(b.startsAt || b.createdAt));
}

export async function requireItem(db, id, { admin = false, assessment = false } = {}) {
    const item = (await itemRef(db, id).get()).data();
    if (!item || (!admin && !item.published) || (assessment && !isAssessment(item))) {
        throw new CourseError("This course item is unavailable.", 404);
    }
    return item;
}

async function studentWork(ref) {
    const [progress, submissions] = await Promise.all([ref.collection("progress").get(), ref.collection("submissions").get()]);
    return {
        progress: Object.fromEntries(progress.docs.map((doc) => [doc.id, doc.data().completed])),
        submissions: Object.fromEntries(submissions.docs.map((doc) => [doc.id, doc.data()])),
    };
}

export function enrollmentView(record) {
    if (!record) return null;
    const { lease, leaseExpires, ...view } = record;
    void lease;
    void leaseExpires;
    return view;
}

export async function loadStudent(uid) {
    const db = getAdminDb();
    const ref = courseEnrollment(db, uid);
    const [snapshot, settings] = await Promise.all([ref.get(), courseSettings(db)]);
    const record = snapshot.data();
    const result = { settings: publicCourseSettings(settings), enrollment: enrollmentView(record), hasAccess: isEnrolled(record) };
    if (!result.hasAccess) return result;

    const [items, { progress, submissions }] = await Promise.all([courseItems(db), studentWork(ref)]);
    const visibleSubmissions = Object.fromEntries(items.filter(isAssessment).filter(({ id }) => submissions[id]).map(({ id }) => {
        const { file, ...submission } = submissions[id];
        return [id, { ...submission, fileName: file?.name || null }];
    }));
    return {
        ...result,
        items: items.map(({ asset, ...item }) => ({ ...item, assetName: asset?.name || null })),
        progress,
        submissions: visibleSubmissions,
        summary: summarizeProgress(items, progress, visibleSubmissions, record.courseCompleted),
    };
}

export async function loadAdminStudent(db, uid) {
    const ref = courseEnrollment(db, uid);
    const [snapshot, items, work] = await Promise.all([ref.get(), courseItems(db, true), studentWork(ref)]);
    if (!snapshot.exists) throw new CourseError("Student not found.", 404);
    const record = snapshot.data();
    return {
        enrollment: enrollmentView(record),
        ...work,
        summary: summarizeProgress(items.filter((item) => item.published), work.progress, work.submissions, record.courseCompleted),
    };
}

export function validAssetMimes(type) {
    if (type === "recording") return ["video/mp4", "video/webm"];
    return ["application/pdf", "application/zip", "text/plain"];
}

export function validateItemFields(item, asset) {
    if (item.type === "live" && (!item.startsAt || !item.joinUrl)) throw new CourseError("Enter a class date, time, and joining link.");
    if (item.type === "live" && !Number.isFinite(Date.parse(item.startsAt))) throw new CourseError("Enter a valid class date and time.");
    if (isAssessment(item) && (!item.maxMarks || !item.description)) throw new CourseError(`Enter instructions and maximum marks for the ${ITEM_TYPES[item.type].toLowerCase()}.`);
    if (["material", "recording"].includes(item.type) && !asset) throw new CourseError("Attach a file before saving.");
}
