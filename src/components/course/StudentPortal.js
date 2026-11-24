"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { COURSE_FEE, COURSE_TERMS_VERSION, COURSE_TITLE, DEFAULT_SETTINGS, ITEM_TYPES, MODULES, courseTerms, inr, isAssessment } from "@/lib/course.mjs";
import { AccountForm, Notice, SignOut, VerifyEmail, courseRequest, openFile, uploadCourseFile, useCourseAccount, useCourseActions } from "./Account";
import { CourseDocuments } from "./CourseDocuments";
import styles from "./course.module.css";

let checkoutScript;
function loadCheckout() {
    if (window.Razorpay) return Promise.resolve();
    if (!checkoutScript) {
        checkoutScript = new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = resolve;
            script.onerror = () => {
                checkoutScript = undefined;
                script.remove();
                reject(new Error("Razorpay Checkout did not load. Try again."));
            };
            document.head.appendChild(script);
        });
    }
    return checkoutScript;
}

export default function StudentPortal() {
    const search = useSearchParams();
    const { loading, user, verified } = useCourseAccount();
    return <div className={styles.course}><div className={styles.workspace}>
        <Link className={styles.secondary} href="/dev/course"><ArrowLeft size={17} aria-hidden="true" /> Course overview</Link>
        {loading && <p role="status">Loading your account…</p>}
        {!loading && !user && <AccountForm beginWithEnrollment={search.get("mode") === "enroll"} />}
        {user && !verified && <VerifyEmail user={user} />}
        {user && verified && <StudentArea key={user.uid} user={user} />}
    </div></div>;
}

function StudentArea({ user }) {
    const [data, setData] = useState(null);
    const [error, setError] = useState("");
    const refresh = useCallback(async () => {
        const next = await courseRequest(user, "student");
        setData(next);
        return next;
    }, [user]);

    useEffect(() => {
        let active = true;
        courseRequest(user, "student").then(async (next) => {
            if (!active) return;
            setData(next);
            if (next.enrollment?.orderId && next.enrollment.paymentStatus === "pending") {
                const result = await courseRequest(user, "check-payment").catch(() => null);
                if (active && result?.student.hasAccess) setData(result.student);
            }
        }).catch((err) => { if (active) setError(err.message); });
        return () => { active = false; };
    }, [user]);

    const retry = async () => {
        setError("");
        try { await refresh(); } catch (err) { setError(err.message); }
    };

    return <>
        <div className={styles.inline}><h1>{data?.hasAccess ? "Student dashboard" : "Course enrollment"}</h1><SignOut /></div>
        <Notice error={error} />
        {!data && (error ? <button className={styles.secondary} onClick={retry}>Retry</button> : <p role="status">Loading your enrollment…</p>)}
        {data && !data.hasAccess && <Enrollment user={user} data={data} update={setData} refresh={refresh} />}
        {data?.hasAccess && <Dashboard user={user} data={data} refresh={refresh} />}
    </>;
}

function Enrollment({ user, data, update, refresh }) {
    const { enrollment, settings } = data;
    const [selectedHardcopy, setHardcopy] = useState(false);
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const { busy, error, message, setMessage, run } = useCourseActions(user);
    const locked = Boolean(enrollment?.orderId);
    const needsForm = !locked || !enrollment.termsAcceptedAt;
    const terms = courseTerms(settings.published ? settings : DEFAULT_SETTINGS);
    const printedPrice = locked ? enrollment.hardcopyPrice : settings.hardcopyPrice;
    const hardcopy = locked ? enrollment.hardcopy : Boolean(printedPrice && selectedHardcopy);
    const amount = locked ? enrollment.amount : COURSE_FEE + (hardcopy ? printedPrice : 0);

    async function check(request, checkout) {
        const result = await request("check-payment", { checkout });
        update(result.student);
        if (!result.student.hasAccess) {
            setMessage(result.processing ? "Razorpay is confirming your payment. Check the status again shortly." : "Payment has yet to be confirmed.");
        }
    }

    function pay(event) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        run(async (request) => {
            await loadCheckout();
            const details = await request("start-payment", {
                registration: needsForm ? {
                    name: form.get("name"), phone: form.get("phone"), dateOfBirth: form.get("dateOfBirth"),
                    fieldOfStudy: form.get("fieldOfStudy"), graduationDate: form.get("graduationDate"),
                    cgpa: form.get("cgpa"), experience: form.get("experience"),
                    address: form.get("address") || "", hardcopy,
                    termsVersion: COURSE_TERMS_VERSION, termsAccepted: form.has("termsAccepted"),
                    refundPolicy: settings.refundPolicy || "", terms,
                } : null,
                quotedAmount: amount,
            }).catch(async (err) => {
                await refresh().catch(() => {});
                throw err;
            });
            if (details.confirmed) { await refresh(); return; }
            const razorpay = new window.Razorpay({
                key: details.keyId, order_id: details.orderId, amount: details.amount, currency: details.currency,
                name: "DEV Infinity", description: COURSE_TITLE,
                prefill: { name: needsForm ? form.get("name") : enrollment.name, email: user.email, contact: needsForm ? form.get("phone") : enrollment.phone },
                theme: { color: "#ae1029" },
                handler: (checkout) => {
                    setCheckoutOpen(false);
                    run((next) => check(next, checkout));
                },
                modal: { ondismiss: () => { setCheckoutOpen(false); void refresh().catch(() => {}); } },
            });
            razorpay.open();
            setCheckoutOpen(true);
            void refresh().catch(() => {});
        });
    }

    const unavailable = enrollment?.suspended || enrollment?.paymentStatus === "refunded";
    const closedMessage = settings.preview && !settings.paymentMode
        ? "Test checkout is unavailable until Razorpay Test Mode is configured."
        : settings.published || settings.preview ? "Registration is currently closed." : "Registration will open once the course details are published.";
    return <section className={`${styles.panel} ${styles.narrow}`}>
        <h2>{COURSE_TITLE}</h2>
        <Notice error={error} message={message} />
        {unavailable && <p className={styles.banner}>This enrollment is unavailable. <Link href="/dev/contact">Contact DEV Infinity</Link> for help.</p>}
        {!unavailable && !settings.enrollmentOpen && <p className={styles.banner}>{closedMessage}</p>}
        {!unavailable && settings.enrollmentOpen && <form className={styles.fields} onSubmit={pay}>
            {settings.paymentMode === "test" && <p className={styles.banner}>Razorpay Test Mode. No real payment will be collected.</p>}
            {!needsForm ? <p>Checkout details are saved for {enrollment.name}. Materials: {hardcopy ? "digital and printed copies" : "digital copies"}.</p> : <>
                <label>Full name<input name="name" autoComplete="name" defaultValue={enrollment?.name || user.displayName || ""} required minLength={2} maxLength={120} /></label>
                <label>Contact number<input name="phone" autoComplete="tel" type="tel" defaultValue={enrollment?.phone || ""} required minLength={7} maxLength={24} /></label>
                <label>Email address<input name="email" type="email" value={user.email} readOnly /></label>
                <div className={styles.split}>
                    <label>Date of birth<input type="date" name="dateOfBirth" required max={new Date(Date.now() + 330 * 60_000).toISOString().slice(0, 10)} defaultValue={enrollment?.dateOfBirth || ""} /></label>
                    <label>Expected graduation date<input type="date" name="graduationDate" required defaultValue={enrollment?.graduationDate || ""} /></label>
                </div>
                <label>Current field of study<input name="fieldOfStudy" maxLength={160} required defaultValue={enrollment?.fieldOfStudy || ""} /></label>
                <label>Current CGPA<input name="cgpa" inputMode="decimal" pattern="[0-9]+(\.[0-9]+)?" maxLength={12} required defaultValue={enrollment?.cgpa || ""} /></label>
                <p>Students with backlogs can apply.</p>
                <label>Previous experience (optional)<textarea name="experience" maxLength={1500} defaultValue={enrollment?.experience || ""} /></label>
                <fieldset className={styles.fields}>
                    <legend>Study materials</legend>
                    <label className={styles.check}><input type="radio" name="materials" disabled={locked} checked={!hardcopy} onChange={() => setHardcopy(false)} />Digital copies included</label>
                    {printedPrice ? <label className={styles.check}><input type="radio" name="materials" disabled={locked} checked={hardcopy} onChange={() => setHardcopy(true)} />Digital and printed copies · {inr(printedPrice)} extra</label> :
                        <p className={styles.offerNote}>Printed copies are currently unavailable at checkout.</p>}
                </fieldset>
                {hardcopy && <label>Delivery address<textarea name="address" autoComplete="street-address" required minLength={10} maxLength={600} defaultValue={enrollment?.address || ""} /></label>}
            </>}
            <p><strong>Total {inr(amount)}</strong></p>
            {needsForm && <fieldset>
                <legend>Enrollment terms</legend>
                <ul className={styles.enrollmentTerms}>{terms.map((term) => <li key={term}>{term}</li>)}</ul>
                {settings.refundPolicy && <div><strong>Refund policy</strong><p className={styles.preline}>{settings.refundPolicy}</p></div>}
                <p><Link href="/dev/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy policy</Link></p>
                <label className={styles.check}><input key={JSON.stringify([terms, settings.refundPolicy])} type="checkbox" name="termsAccepted" required /> I accept the enrollment terms.</label>
            </fieldset>}
            <div><button type="submit" className={styles.primary} disabled={busy || checkoutOpen}>{busy || checkoutOpen ? "Please wait…" : `Pay ${inr(amount)} securely`}</button></div>
        </form>}
        {unavailable && <CourseDocuments enrollment={enrollment} testMode={settings.preview} />}
        {locked && !unavailable && <button type="button" className={styles.secondary} disabled={busy || checkoutOpen} onClick={() => run((request) => check(request))}>Check payment status</button>}
    </section>;
}

function Dashboard({ user, data, refresh }) {
    const [active, setActive] = useState(MODULES[0].id);
    const { summary, enrollment, items } = data;
    const displayScore = summary.score === null ? "Awaiting marks" : new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2, roundingMode: "trunc" }).format(summary.score) + "%";

    return <>
        <p className={styles.banner} role="status"><strong>Enrollment confirmed.</strong> Reference {enrollment.orderId}</p>
        <CourseDocuments enrollment={enrollment} showCertificate testMode={data.settings.preview} />
        <div className={styles.split}>
            <section className={styles.panel}>
                <h2>Your progress</h2>
                <p>{summary.finished} of {summary.total} learning activities completed</p>
                <progress className={styles.progress} aria-label="Course activities completed" max={summary.total || 1} value={summary.finished} />
                <p>Assignments 30% · Project checkpoints 45% · Final exam 25%</p>
                <p>Course score <strong>{displayScore}</strong> · {summary.graded} of {summary.assessments} assessments graded</p>
            </section>
            <section className={styles.panel}>
                <h2>Internship eligibility</h2>
                <p><strong>{summary.eligible ? "Eligible for a paid internship opportunity" : enrollment.courseCompleted && summary.assessments > 0 && summary.graded === summary.assessments ? "Internship score requirement unmet" : "Eligibility pending"}</strong></p>
                <p>Successful course completion and a score above 80% are required. Internship duration and mode: {data.settings.internshipDuration || DEFAULT_SETTINGS.internshipDuration}. Stipend: {data.settings.internshipStipend || DEFAULT_SETTINGS.internshipStipend}.</p>
                {data.settings.completionCriteria && <p className={styles.preline}>{data.settings.completionCriteria}</p>}
            </section>
        </div>
        <nav className={styles.tabs} aria-label="Course modules">
            {MODULES.map((module) => <button key={module.id} type="button" className={styles.secondary} aria-pressed={active === module.id} onClick={() => setActive(module.id)}>{module.title}</button>)}
        </nav>
        <section className={styles.stack} aria-label={MODULES.find((module) => module.id === active).title}>
            {items.filter((item) => item.module === active).map((item) => <LearningItem key={item.id} item={item} user={user} data={data} refresh={refresh} />)}
            {items.every((item) => item.module !== active) && <p className={styles.panel}>Course activities for this module will appear here when they’re available.</p>}
        </section>
    </>;
}

function LearningItem({ item, data, user, refresh }) {
    const { busy, error, run } = useCourseActions(user);
    const [media, setMedia] = useState("");
    const submission = data.submissions[item.id];
    const assessment = isAssessment(item);
    const completed = Boolean(data.progress[item.id]);
    const editable = item.availability === "open" && !data.enrollment.courseCompleted && !Number.isFinite(submission?.marks);
    const formatDate = (date) => new Intl.DateTimeFormat("en-IN", { dateStyle: "full", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(new Date(date));

    function submit(event) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const file = form.get("file");
        run(async (request) => {
            const attachment = file?.size ? await uploadCourseFile(user, "prepare-submission", file, { itemId: item.id }) : null;
            await request("submit", { itemId: item.id, response: form.get("response"), file: attachment, keepFile: !attachment && form.get("keepFile") === "on" });
            await refresh();
        });
    }

    return <article className={styles.panel}>
        <p className={styles.eyebrow}>{ITEM_TYPES[item.type]}</p>
        <h3>{item.title}</h3>
        {item.description && <p className={styles.preline}>{item.description}</p>}
        <Notice error={error} />
        {item.type === "live" && <p><time dateTime={item.startsAt}>{new Intl.DateTimeFormat("en-IN", { dateStyle: "full", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(new Date(item.startsAt))} IST</time></p>}
        {media && <video className={styles.recording} src={media} controls preload="metadata" aria-label={item.title} />}
        <div className={styles.actions}>
            {item.type === "live" && !item.joinUrl && <p>Joining link will appear here when posted.</p>}
            {item.joinUrl && <a className={styles.primary} href={item.joinUrl} target="_blank" rel="noopener noreferrer">Join live class</a>}
            {item.assetName && <button className={styles.secondary} disabled={busy} onClick={() => run(async (request) => {
                const { url } = await request("get-asset", { itemId: item.id });
                if (item.type === "recording") setMedia(url);
                else openFile(url);
            })}>{item.type === "recording" ? "Load recording" : `Download ${item.assetName}`}</button>}
            {!assessment && <button className={styles.secondary} disabled={busy} aria-pressed={completed} onClick={() => run(async (request) => {
                await request("progress", { itemId: item.id, completed: !completed });
                await refresh();
            })}>{completed ? "Completed" : "Mark complete"}</button>}
        </div>
        {assessment && <>
            {item.opensAt && <p>Opens {formatDate(item.opensAt)} IST.<br />{item.type === "exam" ? "Closes" : "Due"} {formatDate(item.dueAt)} IST.</p>}
            {item.availability === "upcoming" && <p>Submissions open at the scheduled time. Refresh the portal at that time.</p>}
            {item.availability === "awaiting-paper" && <p>The exam paper is awaiting upload.</p>}
            {item.availability === "closed" && <p>The exam submission window has closed.</p>}
            {item.rubric && <p>Completion {item.rubric.completion} · Timeliness {item.rubric.timeliness} · Quality {item.rubric.quality}</p>}
            {submission?.rubric && <p>Marks awarded: completion {submission.rubric.completion}, timeliness {submission.rubric.timeliness}, quality {submission.rubric.quality}.</p>}
            <p>Maximum marks {item.maxMarks}. {submission ? Number.isFinite(submission.marks) ? `Received ${submission.marks}/${item.maxMarks}.` : "Submitted. Awaiting review." : "Awaiting submission."}</p>
            {submission?.feedback && <p className={styles.preline}><strong>Feedback</strong> {submission.feedback}</p>}
            {submission?.fileName && <button type="button" className={styles.secondary} disabled={busy} onClick={() => run(async (request) => {
                openFile((await request("get-submission", { itemId: item.id })).url);
            })}>Download your submission</button>}
            {!editable && submission?.response && <p className={styles.preline}>{submission.response}</p>}
            {editable && <form key={submission?.revision || 0} className={styles.fields} onSubmit={submit}>
                <label>Written response<textarea name="response" maxLength={6000} defaultValue={submission?.response || ""} /></label>
                <label>Attachment <small>PDF, ZIP, or TXT up to 20 MB</small><input name="file" type="file" accept=".pdf,.zip,.txt" /></label>
                {submission?.fileName && <label className={styles.check}><input type="checkbox" name="keepFile" defaultChecked /> Keep existing attachment if no new file is selected</label>}
                <div><button className={styles.primary} disabled={busy}>{busy ? "Saving…" : submission ? "Update submission" : "Submit work"}</button></div>
            </form>}
        </>}
    </article>;
}
