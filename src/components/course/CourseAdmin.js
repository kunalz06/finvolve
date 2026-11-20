"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ITEM_TYPES, MODULES, inr, isAssessment } from "@/lib/course.mjs";
import { AccountForm, Notice, SignOut, courseRequest, openFile, uploadCourseFile, useCourseAccount, useCourseActions } from "./Account";
import styles from "./course.module.css";

const settingsFields = {
    schedule: "Course schedule",
    refundPolicy: "Refund policy",
    completionCriteria: "Successful course completion criteria",
    internshipDuration: "Internship duration",
    internshipStipend: "Internship stipend",
    internshipOnboarding: "Internship onboarding requirements",
    internshipTerms: "Other internship terms",
};

export default function CourseAdmin() {
    const { loading, user } = useCourseAccount();
    return <div className={styles.course}><div className={styles.workspace}>
        <Link className={styles.secondary} href="/dev/course">Course overview</Link>
        {loading && <p role="status">Loading your account…</p>}
        {!loading && !user && <AccountForm admin />}
        {user && <AdminArea key={user.uid} user={user} />}
    </div></div>;
}

function AdminArea({ user }) {
    const [tab, setTab] = useState("Students");
    const [data, setData] = useState(null);
    const [cursor, setCursor] = useState(undefined);
    const [pages, setPages] = useState([]);
    const [selected, setSelected] = useState("");
    const [item, setItem] = useState(null);
    const { busy, error, run } = useCourseActions(user);

    const refresh = useCallback(async () => {
        setData(await courseRequest(user, "admin-overview", { cursor }));
    }, [user, cursor]);

    useEffect(() => {
        let active = true;
        courseRequest(user, "admin-overview", { cursor }).then((next) => { if (active) setData(next); }).catch((err) => {
            if (active) setData({ error: err.message });
        });
        return () => { active = false; };
    }, [user, cursor]);

    function move(next) {
        setData(null);
        setSelected("");
        if (next) {
            setPages([...pages, cursor]);
            setCursor(next);
        } else {
            setCursor(pages.at(-1));
            setPages(pages.slice(0, -1));
        }
    }

    return <>
        <div className={styles.inline}><h1>Course administration</h1><SignOut /></div>
        <Notice error={error || data?.error} />
        {data?.error && <button className={styles.secondary} disabled={busy} onClick={() => run(refresh)}>Retry</button>}
        {!data && <p role="status">Loading course administration…</p>}
        {data && !data.error && <>
            <nav className={styles.tabs} aria-label="Course administration">
                {["Students", "Course content", "Publication settings"].map((label) => <button key={label} type="button" className={styles.secondary} aria-pressed={tab === label} onClick={() => setTab(label)}>{label}</button>)}
            </nav>
            {tab === "Students" && <>
                <section className={styles.panel}>
                    <h2>Students and payments</h2>
                    {data.students.length === 0 && <p>Enrollment records appear here when students begin checkout.</p>}
                    <ul className={styles.adminList}>
                        {data.students.map((student) => <li key={student.uid}>
                            <div><strong>{student.name}</strong><br /><span>{student.email} · {student.paymentStatus} · {inr(student.amount)}</span></div>
                            <button className={styles.secondary} type="button" aria-pressed={selected === student.uid} onClick={() => setSelected(student.uid)}>View record<span className={styles.srOnly}> for {student.name}</span></button>
                        </li>)}
                    </ul>
                    <div className={styles.actions}>
                        {pages.length > 0 && <button className={styles.secondary} onClick={() => move()}>Previous page</button>}
                        {data.nextCursor && <button className={styles.secondary} onClick={() => move(data.nextCursor)}>Next page</button>}
                    </div>
                </section>
                {selected && <StudentRecord user={user} uid={selected} items={data.items} refreshList={refresh} key={selected} />}
            </>}
            {tab === "Course content" && <>
                <section className={styles.panel}>
                    <div className={styles.inline}><h2>Course content</h2><button type="button" className={styles.primary} onClick={() => setItem({})}>Add course item</button></div>
                    {data.items.length === 0 && <p>Add live classes, recordings, materials, assignments, or projects.</p>}
                    <ul className={styles.adminList}>
                        {data.items.map((current) => <li key={current.id}>
                            <div><strong>{current.title}</strong><br /><span>{MODULES.find(({ id }) => id === current.module)?.title} · {ITEM_TYPES[current.type]} · {current.published ? "Published" : "Draft"}</span></div>
                            <button type="button" className={styles.secondary} onClick={() => setItem(current)}>Edit<span className={styles.srOnly}> {current.title}</span></button>
                        </li>)}
                    </ul>
                </section>
                {item && <ItemEditor key={item.id || "new"} item={item} user={user} done={async () => { await refresh(); setItem(null); }} cancel={() => setItem(null)} />}
            </>}
            {tab === "Publication settings" && <SettingsForm user={user} settings={data.settings} refresh={refresh} />}
        </>}
    </>;
}

function SettingsForm({ user, settings, refresh }) {
    const { busy, error, message, setMessage, run } = useCourseActions(user);

    function save(event) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const price = form.get("hardcopyPrice");
        run(async (request) => {
            await request("admin-settings", { settings: {
                ...Object.fromEntries(Object.keys(settingsFields).map((key) => [key, form.get(key)])),
                hardcopyPrice: price === "" ? null : Math.round(Number(price) * 100),
                published: form.has("published"),
                enrollmentEnabled: form.has("enrollmentEnabled"),
            } });
            await refresh();
            setMessage("Publication settings saved.");
        });
    }

    return <section className={styles.panel}>
        <h2>Publication settings</h2>
        <p>Define the completion criteria and internship terms to publish. Add the schedule, refund policy, and printed-copy price as each is confirmed.</p>
        <Notice error={error} message={message} />
        <form className={styles.fields} onSubmit={save}>
            <label>Printed-copy price in rupees<input type="number" name="hardcopyPrice" step=".01" min=".01" max="1000000" defaultValue={settings.hardcopyPrice === null ? "" : settings.hardcopyPrice / 100} /></label>
            {Object.entries(settingsFields).map(([key, label]) => <label key={key}>{label}<textarea name={key} maxLength={4000} defaultValue={settings[key]} /></label>)}
            <label className={styles.check}><input type="checkbox" name="published" defaultChecked={settings.published} /> Publish course details</label>
            <label className={styles.check}><input type="checkbox" name="enrollmentEnabled" defaultChecked={settings.enrollmentEnabled} /> Enable checkout through 26 November 2026 (IST)</label>
            <div><button className={styles.primary} disabled={busy}>{busy ? "Saving…" : "Save settings"}</button></div>
        </form>
    </section>;
}

function indiaDateTime(value) {
    return value ? new Date(Date.parse(value) + 330 * 60_000).toISOString().slice(0, 16) : "";
}

function ItemEditor({ user, item, done, cancel }) {
    const [type, setType] = useState(item.type || "live");
    const { busy, error, run } = useCourseActions(user);
    const assessment = isAssessment({ type });
    const usesAsset = type !== "live";
    const recording = type === "recording";

    function save(event) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const selectedFile = form.get("asset");
        run(async (request) => {
            const asset = selectedFile?.size ? await uploadCourseFile(user, "admin-prepare-asset", selectedFile) : null;
            await request("admin-save-item", { item: {
                id: item.id,
                module: item.id ? item.module : form.get("module"),
                type,
                title: form.get("title"),
                description: form.get("description"),
                published: form.has("published"),
                startsAt: type === "live" ? `${form.get("startsAt")}:00+05:30` : "",
                joinUrl: type === "live" ? form.get("joinUrl") : "",
                maxMarks: assessment ? (item.id ? item.maxMarks : Number(form.get("maxMarks"))) : null,
                asset,
            } });
            await done();
        });
    }

    return <section className={styles.panel}>
        <h2>{item.id ? "Edit course item" : "Add course item"}</h2>
        <Notice error={error} />
        <form className={styles.fields} onSubmit={save}>
            <div className={styles.split}>
                <label>Module<select name="module" defaultValue={item.module || MODULES[0].id} disabled={Boolean(item.id)}>{MODULES.map(({ id, title }) => <option value={id} key={id}>{title}</option>)}</select></label>
                <label>Item type<select value={type} disabled={Boolean(item.id)} onChange={(event) => setType(event.target.value)}>{Object.entries(ITEM_TYPES).map(([key, label]) => <option value={key} key={key}>{label}</option>)}</select></label>
            </div>
            <label>Title<input name="title" required minLength={2} maxLength={140} defaultValue={item.title || ""} /></label>
            <label>{assessment ? "Instructions" : recording ? "Description and transcript" : "Description"}<textarea name="description" required={assessment} maxLength={8000} defaultValue={item.description || ""} /></label>
            {type === "live" && <div className={styles.split}>
                <label>Class date and time (IST)<input name="startsAt" type="datetime-local" required defaultValue={indiaDateTime(item.startsAt)} /></label>
                <label>Joining link<input name="joinUrl" type="url" placeholder="https://" required defaultValue={item.joinUrl || ""} /></label>
            </div>}
            {assessment && <label>Maximum marks<input type="number" name="maxMarks" required min="1" max="1000" disabled={Boolean(item.id)} defaultValue={item.maxMarks || ""} /></label>}
            {usesAsset && <label>File {recording ? "(MP4 or WebM, up to 500 MB)" : "(PDF, ZIP, or TXT, up to 50 MB)"}
                <input key={type} name="asset" type="file" accept={recording ? ".mp4,.webm" : ".pdf,.zip,.txt"} required={!assessment && !item.asset} />
                {item.asset && <small>Current file {item.asset.name}</small>}
            </label>}
            <label className={styles.check}><input type="checkbox" name="published" defaultChecked={item.published} /> Show to enrolled students</label>
            <div className={styles.actions}>
                <button className={styles.primary} disabled={busy}>{busy ? "Saving…" : "Save course item"}</button>
                <button className={styles.secondary} type="button" disabled={busy} onClick={cancel}>Cancel</button>
                {item.asset && <button className={styles.secondary} type="button" disabled={busy} onClick={() => run(async (request) => {
                    openFile((await request("admin-get-asset", { itemId: item.id })).url);
                })}>Open current file</button>}
            </div>
        </form>
    </section>;
}

function StudentRecord({ user, uid, items, refreshList }) {
    const [data, setData] = useState(null);
    const { busy, error, message, setMessage, run } = useCourseActions(user);

    useEffect(() => {
        let active = true;
        courseRequest(user, "admin-student", { uid }).then((next) => { if (active) setData(next); }).catch((err) => {
            if (active) setData({ error: err.message });
        });
        return () => { active = false; };
    }, [user, uid]);

    async function refresh(request) {
        setData(await request("admin-student", { uid }));
    }

    function saveStatus(event) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        run(async (request) => {
            await request("admin-status", { uid, courseCompleted: form.has("courseCompleted"), suspended: form.has("suspended") });
            await Promise.all([refresh(request), refreshList()]);
            setMessage("Student status saved.");
        });
    }

    if (!data) return <p role="status">Loading student record…</p>;
    if (data.error) return <Notice error={data.error} />;
    const { enrollment, summary, submissions } = data;

    return <section className={styles.panel}>
        <h2>{enrollment.name}</h2>
        <dl className={styles.terms}>
            <div><dt>Contact</dt><dd>{enrollment.email} · {enrollment.phone}</dd></div>
            <div><dt>Payment</dt><dd>{enrollment.paymentStatus} · {inr(enrollment.amount)}{enrollment.orderId ? ` · ${enrollment.orderId}` : ""}{enrollment.paymentId ? ` · ${enrollment.paymentId}` : ""}</dd></div>
            <div><dt>Study materials</dt><dd>{enrollment.hardcopy ? `Digital and printed copies · ${inr(enrollment.hardcopyPrice)} add-on` : "Digital copies"}</dd></div>
            {enrollment.address && <div><dt>Delivery address</dt><dd>{enrollment.address}</dd></div>}
            <div><dt>Performance</dt><dd>{summary.finished}/{summary.total} activities, {summary.graded}/{summary.assessments} graded, {summary.score === null ? "awaiting marks" : `${Math.floor(summary.score * 100) / 100}%`}</dd></div>
            <div><dt>Internship</dt><dd>{enrollment.paymentStatus !== "confirmed" || enrollment.suspended ? "Access inactive" : summary.eligible ? "Eligible" : "Eligibility criteria outstanding"}</dd></div>
        </dl>
        <Notice error={error} message={message} />
        {enrollment.orderId && enrollment.paymentStatus !== "refunded" && <button type="button" className={styles.secondary} disabled={busy} onClick={() => run(async (request) => {
            const result = await request("admin-reconcile", { uid });
            await Promise.all([refresh(request), refreshList()]);
            setMessage(result.confirmed ? "Payment confirmed." : result.refunded ? "Payment refunded." : "Payment has yet to be confirmed.");
        })}>Check with Razorpay</button>}
        <form className={styles.fields} onSubmit={saveStatus}>
            <label className={styles.check}><input type="checkbox" name="courseCompleted" defaultChecked={enrollment.courseCompleted} /> Successful course completion confirmed</label>
            <label className={styles.check}><input type="checkbox" name="suspended" defaultChecked={enrollment.suspended} /> Suspend paid course access</label>
            <div><button type="submit" className={styles.primary} disabled={busy}>Save student status</button></div>
        </form>
        <h3>Submissions and marks</h3>
        {Object.keys(submissions).length === 0 && <p>No work has been submitted.</p>}
        {items.filter(({ id }) => submissions[id]).map((item) => <GradeForm key={`${item.id}-${submissions[item.id].revision}`} item={item} submission={submissions[item.id]} user={user} uid={uid} refresh={refresh} />)}
    </section>;
}

function GradeForm({ item, submission, user, uid, refresh }) {
    const { busy, error, message, setMessage, run } = useCourseActions(user);

    function grade(event) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        run(async (request) => {
            await request("admin-grade", { uid, itemId: item.id, marks: Number(form.get("marks")), feedback: form.get("feedback"), revision: submission.revision });
            await refresh(request);
            setMessage("Marks saved.");
        });
    }

    return <form className={`${styles.panel} ${styles.fields}`} onSubmit={grade}>
        <h3>{item.title}{item.published ? "" : " (draft)"}</h3>
        {submission.response && <p className={styles.preline}>{submission.response}</p>}
        {submission.file && <div><button type="button" className={styles.secondary} disabled={busy} onClick={() => run(async (request) => {
            openFile((await request("admin-submission-file", { uid, itemId: item.id })).url);
        })}>Download {submission.file.name}</button></div>}
        <div className={styles.split}>
            <label>Marks out of {item.maxMarks}<input name="marks" type="number" min="0" max={item.maxMarks} required defaultValue={submission.marks ?? ""} /></label>
            <label>Feedback<textarea name="feedback" maxLength={6000} defaultValue={submission.feedback || ""} /></label>
        </div>
        <Notice error={error} message={message} />
        <div><button type="submit" className={styles.primary} disabled={busy}>{busy ? "Saving…" : "Save marks"}</button></div>
    </form>;
}
