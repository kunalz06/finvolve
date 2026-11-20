import { randomUUID } from "node:crypto";
import Razorpay from "razorpay";
import { getAdminDb } from "@/lib/firebase-admin";
import { COURSE_FEE, registrationOpen } from "@/lib/course.mjs";
import { courseCollection } from "./course-environment";
import { getRazorpayServerCredentials, verifyRazorpaySignature } from "./payments";

const SOURCE = "professional_technology_course";
const LEASE_MS = 60_000;

export class CourseError extends Error {
    constructor(message, status = 400) {
        super(message);
        this.status = status;
    }
}

export function courseEnrollment(db, uid) {
    return db.collection(courseCollection("course_enrollments")).doc(uid);
}

export const isEnrolled = (record) => record?.paymentStatus === "confirmed" && !record.suspended;

function paymentClient() {
    const keys = getRazorpayServerCredentials();
    if (process.env.VERCEL_ENV === "preview" && !keys.keyId.startsWith("rzp_test_")) {
        throw new CourseError("Checkout requires Razorpay test credentials in Preview.", 503);
    }
    return { ...keys, razorpay: new Razorpay({ key_id: keys.keyId, key_secret: keys.keySecret }) };
}

function paymentDetails(record, keyId) {
    return { orderId: record.orderId, amount: record.amount, currency: "INR", keyId };
}

export async function startCoursePayment(student, registration, settingsRef, quotedAmount) {
    const { razorpay, keyId } = paymentClient();
    const db = getAdminDb();
    const ref = courseEnrollment(db, student.uid);
    const lease = randomUUID();

    const reserved = await db.runTransaction(async (tx) => {
        const [snapshot, config] = await Promise.all([tx.get(ref), tx.get(settingsRef)]);
        const current = snapshot.data();
        if (current?.paymentStatus === "confirmed") return { confirmed: true };
        if (current?.paymentStatus === "refunded" || current?.suspended) {
            throw new CourseError("Contact course support about your enrollment.", 409);
        }
        if (current?.orderId) {
            if (current.amount !== quotedAmount || current.hardcopy !== registration.hardcopy) {
                throw new CourseError("An earlier checkout is saved. Reload the enrollment to review it.", 409);
            }
            return { existing: true, ...current };
        }
        const settings = config.data() || {};
        if (!registrationOpen(settings)) throw new CourseError("Registration is currently closed.", 409);
        if (current?.leaseExpires > Date.now()) {
            throw new CourseError("Checkout is being prepared. Please try again shortly.", 409);
        }
        if (registration.hardcopy && (!Number.isSafeInteger(settings.hardcopyPrice) || settings.hardcopyPrice <= 0)) {
            throw new CourseError("Printed copies are currently unavailable.", 409);
        }

        const hardcopyPrice = registration.hardcopy ? settings.hardcopyPrice : 0;
        if (COURSE_FEE + hardcopyPrice !== quotedAmount) throw new CourseError("The price changed. Reload the enrollment to review it.", 409);
        const details = {
            ...registration,
            address: registration.hardcopy ? registration.address : "",
            email: student.email,
            amount: COURSE_FEE + hardcopyPrice,
            hardcopyPrice,
            paymentStatus: "pending",
            createdAt: current?.createdAt || new Date().toISOString(),
            lease,
            leaseExpires: Date.now() + LEASE_MS,
        };
        tx.set(ref, details, { merge: true });
        return details;
    });

    if (reserved.confirmed) return reserved;
    if (reserved.existing) {
        const settled = await reconcileCoursePayment(ref, reserved);
        if (settled.confirmed) return settled;
        const published = (await settingsRef.get()).data() || {};
        if (settled.processing || settled.refunded || !registrationOpen(published)) {
            throw new CourseError(settled.processing ? "Payment is being confirmed. Check its status shortly." : "Registration is currently closed for this order.", 409);
        }
        return paymentDetails(reserved, keyId);
    }

    try {
        const order = await razorpay.orders.create({
            amount: reserved.amount,
            currency: "INR",
            receipt: `course_${lease.replaceAll("-", "")}`.slice(0, 40),
            notes: { source: SOURCE },
        });
        const orderRef = db.collection(courseCollection("course_orders")).doc(order.id);
        await db.runTransaction(async (tx) => {
            const record = (await tx.get(ref)).data();
            if (record?.lease !== lease) throw new CourseError("Checkout timed out. Please try again.", 409);
            tx.update(ref, { orderId: order.id, lease: null, leaseExpires: 0 });
            tx.create(orderRef, { uid: student.uid });
        });
        return paymentDetails({ ...reserved, orderId: order.id }, keyId);
    } catch (error) {
        await db.runTransaction(async (tx) => {
            const record = (await tx.get(ref)).data();
            if (record?.lease === lease) tx.update(ref, { lease: null, leaseExpires: 0 });
        });
        throw error;
    }
}

export async function reconcileCoursePayment(ref, record, checkout) {
    if (!record?.orderId) return {};
    if (record.paymentStatus === "refunded") return { refunded: true };

    const { razorpay, keySecret } = paymentClient();
    if (checkout && (checkout.razorpay_order_id !== record.orderId || !verifyRazorpaySignature({
        orderId: record.orderId,
        paymentId: checkout.razorpay_payment_id,
        signature: checkout.razorpay_signature,
        keySecret,
    }))) {
        throw new CourseError("Payment verification failed.");
    }

    const payments = checkout
        ? [await razorpay.payments.fetch(checkout.razorpay_payment_id)]
        : (await razorpay.orders.fetchPayments(record.orderId)).items;
    const matches = payments.filter((payment) => payment.order_id === record.orderId &&
        Number(payment.amount) === record.amount && payment.currency === "INR");
    const captured = matches.find((payment) => payment.status === "captured" && payment.captured === true &&
        Number(payment.amount_refunded || 0) < record.amount);
    if (captured) return settleCoursePayment(ref, captured);
    const refunded = matches.find((payment) => payment.status === "refunded" || Number(payment.amount_refunded || 0) >= record.amount);
    if (refunded) return settleCoursePayment(ref, refunded);

    const processing = matches.some((payment) => payment.status === "authorized" || payment.status === "created");
    return { confirmed: false, processing };
}

export async function settleCoursePayment(ref, payment) {
    const db = getAdminDb();
    return db.runTransaction(async (tx) => {
        const record = (await tx.get(ref)).data();
        if (!record || record.orderId !== payment.order_id || record.amount !== Number(payment.amount) || payment.currency !== "INR") return {};
        if (record.paymentId && record.paymentId !== payment.id) return {};
        if (record.paymentStatus === "refunded") return { refunded: true };
        if (payment.status === "refunded" || Number(payment.amount_refunded || 0) >= record.amount) {
            tx.update(ref, { paymentStatus: "refunded", paymentId: payment.id, refundedAt: new Date().toISOString() });
            return { refunded: true };
        }
        if (payment.status !== "captured" || payment.captured !== true) return {};
        if (record.paymentStatus !== "confirmed") {
            tx.update(ref, { paymentStatus: "confirmed", paymentId: payment.id, confirmedAt: new Date().toISOString() });
        }
        return { confirmed: true };
    });
}

export async function reconcileCourseWebhook(orderId, paymentId) {
    const db = getAdminDb();
    const order = (await db.collection(courseCollection("course_orders")).doc(orderId).get()).data();
    if (!order) return;
    const { razorpay } = paymentClient();
    const payment = await razorpay.payments.fetch(paymentId);
    if (payment.order_id === orderId) await settleCoursePayment(courseEnrollment(db, order.uid), payment);
}

export async function reconcileCourseRefund(paymentId) {
    const { razorpay } = paymentClient();
    const payment = await razorpay.payments.fetch(paymentId);
    if (!payment.order_id) return;
    const db = getAdminDb();
    const order = (await db.collection(courseCollection("course_orders")).doc(payment.order_id).get()).data();
    if (order) await settleCoursePayment(courseEnrollment(db, order.uid), payment);
}
