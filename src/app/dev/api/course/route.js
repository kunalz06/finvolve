import { FieldPath } from "firebase-admin/firestore";
import { z } from "zod";
import { getAdminDb } from "@/lib/firebase-admin";
import { canPublish, COURSE_TERMS_VERSION, DEFAULT_SETTINGS, ITEM_TYPES, MODULES, isAssessment } from "@/lib/course.mjs";
import { assessmentAvailability, plannedCourseItem, rubricMarks } from "@/lib/course-plan.mjs";
import { corsJson, corsPreflight } from "@/lib/server/cors";
import { checkRateLimit } from "@/lib/server/rate-limit";
import {
    CourseError, courseEnrollment, isEnrolled, reconcileCoursePayment, startCoursePayment,
} from "@/lib/server/course-payments";
import {
    COURSE_ITEMS, assetPrefix, configRef, courseItem, courseItems, courseSettings, courseUser, enrollmentView,
    itemRef, loadAdminStudent, loadStudent, publicCourseSettings, requireItem, uploadPrefix, validAssetMimes, validateItemFields,
} from "@/lib/server/course-store";
import { courseCollection } from "@/lib/server/course-environment";
import { confirmedCourseFile, prepareCourseUpload, readCourseFile } from "@/lib/server/course-files";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const id = z.string().regex(/^[a-zA-Z0-9_-]{1,128}$/);
const text = (max) => z.string().trim().max(max);
const file = z.object({ path: text(400), name: text(160).min(1) });
const upload = { mime: text(80), size: z.number().int().positive() };
const settingsStrings = Object.fromEntries(Object.entries(DEFAULT_SETTINGS).filter(([, value]) => typeof value === "string").map(([key]) => [key, text(4000)]));
const settingsSchema = z.object({
    ...settingsStrings,
    published: z.boolean(),
    enrollmentEnabled: z.boolean(),
    hardcopyPrice: z.number().int().min(1).max(100_000_000).nullable(),
});

const itemSchema = z.object({
    id: id.optional(),
    module: z.enum(MODULES.map(({ id: moduleId }) => moduleId)),
    type: z.enum(Object.keys(ITEM_TYPES)),
    title: text(140).min(2),
    description: text(8000),
    published: z.boolean(),
    startsAt: z.union([z.literal(""), z.iso.datetime({ offset: true })]),
    joinUrl: z.union([z.literal(""), z.url({ protocol: /^https$/ }).max(1600)]),
    maxMarks: z.number().int().min(1).max(1000).nullable(),
    asset: file.nullable(),
});

const enrollmentDetails = z.object({
    name: text(120).min(2),
    phone: text(24).regex(/^\+?[\d\s().-]{7,23}$/).refine((value) => value.replace(/\D/g, "").length >= 7),
    dateOfBirth: z.iso.date().refine((date) => date <= new Date(Date.now() + 330 * 60_000).toISOString().slice(0, 10), { message: "Date of birth cannot be in the future." }),
    fieldOfStudy: text(160).min(1),
    graduationDate: z.iso.date(),
    cgpa: text(12).regex(/^\d+(?:\.\d+)?$/),
    experience: text(1500),
    address: text(600),
    hardcopy: z.boolean(),
    termsVersion: z.literal(COURSE_TERMS_VERSION),
    termsAccepted: z.literal(true),
    refundPolicy: text(4000),
    terms: z.array(text(4100)).min(6).max(8),
}).refine((v) => !v.hardcopy || v.address.length >= 10, { message: "Enter the delivery address for printed copies." });

const schema = z.discriminatedUnion("action", [
    z.object({ action: z.literal("student") }),
    z.object({ action: z.literal("start-payment"), registration: enrollmentDetails.nullable(), quotedAmount: z.number().int().positive() }),
    z.object({ action: z.literal("check-payment"), checkout: z.object({
        razorpay_order_id: z.string().regex(/^order_[a-zA-Z0-9]+$/),
        razorpay_payment_id: z.string().regex(/^pay_[a-zA-Z0-9]+$/),
        razorpay_signature: z.string().regex(/^[a-f0-9]{64}$/),
    }).optional() }),
    z.object({ action: z.literal("progress"), itemId: id, completed: z.boolean() }),
    z.object({ action: z.literal("get-asset"), itemId: id }),
    z.object({ action: z.literal("get-submission"), itemId: id }),
    z.object({ action: z.literal("prepare-submission"), itemId: id, ...upload }),
    z.object({ action: z.literal("submit"), itemId: id, response: text(6000), file: file.nullable(), keepFile: z.boolean() })
        .refine((v) => v.response || v.file || v.keepFile, { message: "Add a written submission or upload a file." }),
    z.object({ action: z.literal("admin-overview"), cursor: id.optional() }),
    z.object({ action: z.literal("admin-student"), uid: id }),
    z.object({ action: z.literal("admin-settings"), settings: settingsSchema }),
    z.object({ action: z.literal("admin-prepare-asset"), ...upload }),
    z.object({ action: z.literal("admin-get-asset"), itemId: id }),
    z.object({ action: z.literal("admin-save-item"), item: itemSchema }),
    z.object({ action: z.literal("admin-reconcile"), uid: id }),
    z.object({ action: z.literal("admin-status"), uid: id, courseCompleted: z.boolean(), suspended: z.boolean() }),
    z.object({ action: z.literal("admin-grade"), uid: id, itemId: id, marks: z.number().int().min(0).max(1000).optional(), completion: z.number().int().min(0).optional(), quality: z.number().int().min(0).optional(), feedback: text(6000), revision: z.number().int().min(0) }),
    z.object({ action: z.literal("admin-submission-file"), uid: id, itemId: id }),
]);

function response(request, data, status = 200) {
    return corsJson(request, data, { status, headers: { "Cache-Control": "private, no-store" } });
}

export function OPTIONS(request) {
    return corsPreflight(request);
}

export async function GET(request) {
    try {
        if (process.env.NODE_ENV === "development" && !process.env.FIRESTORE_EMULATOR_HOST && !process.env.FIREBASE_PROJECT_ID && !process.env.FIREBASE_SERVICE_ACCOUNT_KEY && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            return response(request, publicCourseSettings({ ...DEFAULT_SETTINGS, published: false, enrollmentEnabled: false }));
        }
        return response(request, publicCourseSettings(await courseSettings(getAdminDb())));
    } catch (error) {
        console.error("Course settings unavailable", error.code || error.name);
        return response(request, { published: false, enrollmentOpen: false, hardcopyPrice: null }, 503);
    }
}

export async function POST(request) {
    try {
        const user = await courseUser(request);
        if (Number(request.headers.get("content-length") || 0) > 48_000) throw new CourseError("Request is too large.", 413);
        const raw = await request.json().catch(() => null);
        const parsed = schema.safeParse(raw);
        if (!parsed.success) throw new CourseError(parsed.error.issues[0]?.code === "custom" ? parsed.error.issues[0].message : "Check the form details and try again.");
        const { action } = parsed.data;
        if (action.startsWith("admin-") && !user.isAdmin) throw new CourseError("Administrator access is required.", 403);
        if (!action.startsWith("admin-") && (!user.email || !user.email_verified)) throw new CourseError("Verify your email address to continue.", 403);

        const limit = checkRateLimit(`course:${user.uid}:${action}`, { windowMs: 60_000, maxRequests: action.includes("payment") || action === "admin-reconcile" ? 12 : 90 });
        if (!limit.allowed) throw new CourseError("Too many requests. Try again shortly.", 429);

        const db = getAdminDb();
        return response(request, action.startsWith("admin-")
            ? await adminAction(db, user, parsed.data)
            : await studentAction(db, user, parsed.data));
    } catch (error) {
        if (error instanceof CourseError) return response(request, { error: error.message }, error.status);
        console.error("Course request failed", error.code || error.name);
        return response(request, { error: "The course portal is temporarily unavailable. Please try again." }, 503);
    }
}

async function studentAction(db, user, data) {
    const { action, itemId } = data;
    const ref = courseEnrollment(db, user.uid);
    if (action === "student") return loadStudent(user.uid);
    if (action === "start-payment") {
        return startCoursePayment(user, data.registration, configRef(db), data.quotedAmount);
    }

    const record = (await ref.get()).data();
    if (action === "check-payment") {
        const result = await reconcileCoursePayment(ref, record, data.checkout);
        return { ...result, student: await loadStudent(user.uid) };
    }
    if (!isEnrolled(record)) throw new CourseError("Confirmed enrollment is required.", 403);

    const assessment = ["prepare-submission", "submit", "get-submission"].includes(action);
    const item = await requireItem(db, itemId, { assessment });
    const submission = ref.collection("submissions").doc(itemId);
    if (["prepare-submission", "submit"].includes(action) || (action === "get-asset" && item.type === "exam")) {
        if (assessmentAvailability(item) !== "open") throw new CourseError("This assessment is not open.", 409);
    }
    switch (action) {
        case "progress":
            if (isAssessment(item)) throw new CourseError("Submit the assessment to update progress.");
            await ref.collection("progress").doc(itemId).set({ completed: data.completed });
            return { ok: true };
        case "get-asset":
            return readCourseFile(item.asset, { inline: item.type === "recording" });
        case "get-submission":
            return readCourseFile((await submission.get()).data()?.file);
        case "prepare-submission":
            return prepareCourseUpload(uploadPrefix(user.uid, itemId), "submission", data);
        case "submit": {
            const attachment = data.file ? await confirmedCourseFile(uploadPrefix(user.uid, itemId), "submission", data.file) : null;
            const target = itemRef(db, itemId);
            await db.runTransaction(async (tx) => {
                const [enrollment, publishedItem, prior] = await Promise.all([tx.get(ref), tx.get(target), tx.get(submission)]);
                if (!isEnrolled(enrollment.data())) throw new CourseError("Confirmed enrollment is required.", 403);
                const currentItem = courseItem(itemId, publishedItem.data());
                if (!currentItem?.published || !isAssessment(currentItem) || assessmentAvailability(currentItem) !== "open") {
                    throw new CourseError("This assessment is not open.", 409);
                }
                if (enrollment.data().courseCompleted || Number.isFinite(prior.data()?.marks)) throw new CourseError("This submission is closed for edits.", 409);
                const savedFile = attachment || (data.keepFile ? prior.data()?.file : null) || null;
                if (!data.response && !savedFile) throw new CourseError("Add a written submission or upload a file.");
                tx.set(submission, { response: data.response, file: savedFile, submittedAt: new Date().toISOString(), revision: (prior.data()?.revision || 0) + 1 });
            });
            return { ok: true };
        }
        default:
            throw new CourseError("Invalid action.");
    }
}

async function adminAction(db, user, data) {
    const { action, uid, itemId } = data;
    if (action === "admin-overview") {
        let query = db.collection(courseCollection("course_enrollments")).orderBy(FieldPath.documentId()).limit(26);
        if (data.cursor) query = query.startAfter(data.cursor);
        const [students, items, settings] = await Promise.all([query.get(), courseItems(db, true), courseSettings(db)]);
        const page = students.docs.slice(0, 25);
        return { students: page.map((doc) => ({ uid: doc.id, ...enrollmentView(doc.data()) })), nextCursor: students.size > 25 ? page.at(-1).id : null, items, settings };
    }
    if (action === "admin-settings") {
        if (data.settings.published && !canPublish(data.settings)) throw new CourseError("Provide the completion criteria, internship duration, and stipend arrangement before publishing.");
        await configRef(db).set(data.settings);
        return { ok: true };
    }
    if (action === "admin-prepare-asset") return prepareCourseUpload(assetPrefix(user.uid), "asset", data);
    if (action === "admin-get-asset") {
        const item = await requireItem(db, itemId, { admin: true });
        return readCourseFile(item.asset, { inline: item.type === "recording" });
    }
    if (action === "admin-save-item") {
        const { id: existingId, asset: uploaded, ...item } = data.item;
        const collection = db.collection(COURSE_ITEMS);
        const ref = existingId ? collection.doc(existingId) : collection.doc();
        const prior = existingId ? await requireItem(db, existingId, { admin: true }) : null;
        const planned = plannedCourseItem(existingId);
        const asset = uploaded ? await confirmedCourseFile(assetPrefix(user.uid), "asset", uploaded, validAssetMimes(item.type)) : prior?.asset || null;
        if (!planned && item.type === "exam") throw new CourseError("Use the scheduled final exam item.");
        if (!planned) validateItemFields(item, asset);
        else if (planned.type === "live" && !item.joinUrl) throw new CourseError("Enter a class joining link.");
        else if (planned.type === "exam" && !asset) throw new CourseError("Upload the exam paper.");
        await db.runTransaction(async (tx) => {
            const current = (await tx.get(ref)).data();
            if (current && !planned && (current.type !== item.type || current.maxMarks !== item.maxMarks || current.module !== item.module)) {
                throw new CourseError("The module, item type, and maximum marks are fixed after creation.", 409);
            }
            if (prior && current?.updatedAt !== prior.updatedAt) throw new CourseError("This item changed. Reload it and try again.", 409);
            const updatedAt = new Date().toISOString();
            tx.set(ref, planned ? { joinUrl: item.joinUrl, asset, updatedAt } :
                { ...item, asset, createdAt: current?.createdAt || updatedAt, updatedAt });
        });
        return { ok: true };
    }

    const ref = courseEnrollment(db, uid);
    if (action === "admin-student") return loadAdminStudent(db, uid);
    if (action === "admin-reconcile") return reconcileCoursePayment(ref, (await ref.get()).data());
    if (action === "admin-status") {
        await db.runTransaction(async (tx) => {
            const record = (await tx.get(ref)).data();
            if (!record) throw new CourseError("Student not found.", 404);
            if (data.courseCompleted && record.paymentStatus !== "confirmed") throw new CourseError("Complete payment confirmation before marking the course complete.");
            tx.update(ref, {
                courseCompleted: data.courseCompleted,
                courseCompletedAt: data.courseCompleted ? record.courseCompletedAt || new Date().toISOString() : null,
                suspended: data.suspended,
            });
        });
        return { ok: true };
    }
    const target = itemRef(db, itemId);
    const submission = ref.collection("submissions").doc(itemId);
    if (action === "admin-submission-file") return readCourseFile((await submission.get()).data()?.file);

    await db.runTransaction(async (tx) => {
        const [item, current] = await Promise.all([tx.get(target), tx.get(submission)]);
        const assessmentItem = courseItem(itemId, item.data());
        if (!assessmentItem || !isAssessment(assessmentItem)) throw new CourseError("Assessment not found.", 404);
        const previous = current.data();
        const work = previous?.missing ? null : previous;
        if (!work && (!assessmentItem.dueAt || Date.now() <= Date.parse(assessmentItem.dueAt))) throw new CourseError("Submission not found.", 404);
        if ((previous?.revision ?? 0) !== data.revision) throw new CourseError("This submission changed. Reload it before grading.", 409);
        const rubric = assessmentItem.rubric && rubricMarks(assessmentItem, work || {}, data.completion, data.quality);
        const marks = work ? (assessmentItem.rubric ? rubric?.marks : data.marks) : 0;
        if (!Number.isInteger(marks) || marks < 0 || marks > assessmentItem.maxMarks) throw new CourseError("Enter valid marks for this assessment.");
        tx.set(submission, {
            ...(work ? {} : { revision: 0, missing: true }),
            marks, ...(rubric ? { rubric } : {}), feedback: data.feedback, gradedAt: new Date().toISOString(),
        }, { merge: true });
    });
    return { ok: true };
}
