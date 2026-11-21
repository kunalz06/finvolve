"use client";

import { COURSE_TITLE, inr } from "@/lib/course.mjs";
import styles from "./course.module.css";

const dateFormatter = new Intl.DateTimeFormat("en-IN", { dateStyle: "long", timeZone: "Asia/Kolkata" });

function formatDate(value) {
    return value && dateFormatter.format(new Date(value));
}

function printableDocument(title, description, rows, testMode) {
    const escape = (value) => String(value ?? "").replace(/[&<>"']/g, (character) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
    return `<!doctype html>
<html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(title)} | DEV Infinity</title>
<style>
@page { margin: 18mm; }
body { color: #16203a; background: #fff; font: 16px/1.55 system-ui, sans-serif; margin: 0; }
main { border: 2px solid #ae1029; max-width: 45rem; padding: clamp(1.25rem, 5vw, 3rem); margin: 1.5rem auto; }
strong { color: #ae1029; } h1 { font-size: 2rem; margin: .5rem 0 1rem; } p { overflow-wrap: anywhere; }
dl { margin-top: 1.75rem; } dt { font-weight: 700; } dd { margin: 0 0 .7rem; overflow-wrap: anywhere; }
@media print { main { margin: 0; break-inside: avoid; } }
</style>
<main><strong>DEV Infinity</strong><h1>${escape(title)}</h1>
${testMode ? "<p>Razorpay Test Mode</p>" : ""}
<p>${escape(description)}</p><dl>${rows.filter(([, value]) => Boolean(value)).map(([label, value]) =>
        `<dt>${escape(label)}</dt><dd>${escape(value)}</dd>`).join("")}</dl></main></html>`;
}

function DocumentActions({ title, description, rows, testMode, fileName }) {
    const html = printableDocument(title, description, rows, testMode);

    function print() {
        const frame = document.createElement("iframe");
        frame.title = title;
        frame.setAttribute("aria-hidden", "true");
        frame.style.cssText = "position: fixed; width: 0; height: 0; border: 0;";
        frame.onload = () => {
            const target = frame.contentWindow;
            target.addEventListener("afterprint", () => frame.remove(), { once: true });
            target.print();
        };
        frame.srcdoc = html;
        document.body.appendChild(frame);
    }

    function download() {
        const url = URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" }));
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = fileName;
        anchor.click();
        window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    }

    return <div className={styles.actions}>
        <button type="button" className={styles.secondary} onClick={print}>Print {title.toLowerCase()} / save as PDF</button>
        <button type="button" className={styles.secondary} onClick={download}>Download {title.toLowerCase()}</button>
    </div>;
}

export function CourseDocuments({ enrollment, showCertificate = false, testMode = false }) {
    if (!enrollment) return null;
    const hasReceipt = Boolean(enrollment.paymentId && enrollment.confirmedAt);
    if (!hasReceipt && !showCertificate) return null;

    return <section className={styles.panel} aria-label="Course documents">
        {hasReceipt && <>
            <h2>Payment receipt</h2>
            <p>{inr(enrollment.amount)} · {formatDate(enrollment.confirmedAt)}</p>
            <DocumentActions title="Payment receipt" fileName="dev-infinity-course-receipt.html" testMode={testMode}
                description={COURSE_TITLE} rows={[
                    ["Student", enrollment.name],
                    ["Email", enrollment.email],
                    ["Payment confirmed", formatDate(enrollment.confirmedAt)],
                    ["Course fee", inr(enrollment.amount - (enrollment.hardcopyPrice || 0))],
                    ["Printed study materials", enrollment.hardcopyPrice ? inr(enrollment.hardcopyPrice) : null],
                    ["Amount paid", inr(enrollment.amount)],
                    ["Razorpay payment ID", enrollment.paymentId],
                    ["Order reference", enrollment.orderId],
                    ["Payment status", enrollment.paymentStatus === "refunded" ? "Refunded" : "Confirmed"],
                ]} />
        </>}
        {showCertificate && <>
            <h2>Certificate of completion</h2>
            {enrollment.courseCompleted ? <DocumentActions title="Certificate of completion" fileName="dev-infinity-course-certificate.html" testMode={testMode}
                description={`DEV Infinity certifies that ${enrollment.name} successfully completed the ${COURSE_TITLE}.`}
                rows={[["Student", enrollment.name], ["Course", COURSE_TITLE], ["Completion confirmed", formatDate(enrollment.courseCompletedAt)]]} />
                : <p>Your certificate will be available after DEV Infinity confirms successful course completion.</p>}
        </>}
    </section>;
}
