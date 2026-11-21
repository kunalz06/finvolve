"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, BriefcaseBusiness, CalendarDays, ChevronDown, ClipboardCheck, Layers3, Laptop, Play, Shield, Video } from "lucide-react";
import { courseApiUrl } from "@/lib/api";
import { COURSE_FEE, COURSE_START, COURSE_TITLE, MODULES, REGISTRATION_DEADLINE, inr } from "@/lib/course.mjs";
import styles from "./course.module.css";

const moduleIcons = [Laptop, Shield, Layers3];
const formats = [[Video, "Live classes"], [Play, "Recorded lectures"], [ClipboardCheck, "Assignments"], [Layers3, "Practical projects"], [BookOpen, "Digital study materials"]];

export default function CourseLanding({ allowDraft }) {
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        const controller = new AbortController();
        fetch(courseApiUrl(), { signal: controller.signal, cache: "no-store" })
            .then((response) => response.ok ? response.json() : { published: false })
            .then(setSettings)
            .catch(() => { if (!controller.signal.aborted) setSettings({ published: false }); });
        return () => controller.abort();
    }, []);

    if (!allowDraft && !settings?.published) {
        return <div className={styles.course}><section className={styles.workspace}>
            <h1>{COURSE_TITLE}</h1>
            <p>{settings === null ? "Loading course details…" : "Course details will be available when enrollment information is published."}</p>
            <Link className={styles.secondary} href="/dev/course/portal">Student Login</Link>
        </section></div>;
    }

    const closed = settings?.published && !settings.enrollmentOpen;
    const faqs = [
        ["How do I enroll?", "Create an account or sign in, enter your registration details, choose your study materials, and complete checkout. Your dashboard unlocks after payment is confirmed."],
        ["What study materials are included?", "Digital study materials are included in the course fee. Printed copies can be purchased separately when the option is available."],
        ["When are live classes?", settings?.schedule || "The live class schedule is awaiting confirmation. Enrolled students can view class times and joining links in the portal."],
        ["How is the internship awarded?", "Complete the course successfully and score at least 80% to qualify for a guaranteed paid internship with DEV Infinity. Your score is calculated from the total marks earned across assignments and projects."],
        ...(settings?.refundPolicy ? [["What is the refund policy?", settings.refundPolicy]] : []),
    ];

    return (
        <div className={styles.course}>
            <section className={styles.hero} aria-labelledby="course-title">
                <div>
                    <p className={styles.eyebrow}>Company Academy</p>
                    <h1 id="course-title" aria-label={COURSE_TITLE}>Professional<br />Technology<br /><span>Training Program</span></h1>
                    <p className={styles.intro}>Build practical technology skills through live classes, recorded lectures, assignments, and hands-on projects.</p>
                    <dl className={styles.dates}>
                        <div><CalendarDays aria-hidden="true" /><div><dt>Registration deadline</dt><dd><time dateTime="2026-11-26">{REGISTRATION_DEADLINE}</time></dd></div></div>
                        <div><CalendarDays aria-hidden="true" /><div><dt>Course starts</dt><dd><time dateTime="2026-12-01">{COURSE_START}</time></dd></div></div>
                    </dl>
                    <p className={styles.mobileFee}>Course fee <strong>{inr(COURSE_FEE)}</strong></p>
                    <CourseActions closed={closed} />
                    {closed && <p className={styles.mobileClosed}>Registration is currently closed.</p>}
                </div>
                <aside className={styles.offer} aria-label="Course enrollment">
                    <Image className={styles.art} src="/course/red-gears.webp" alt="" width={1000} height={500} priority />
                    <div className={styles.offerBody}>
                        <p className={styles.eyebrow}>Course enrollment</p>
                        <p className={styles.price}>{inr(COURSE_FEE)}</p>
                        <CourseActions closed={closed} vertical />
                        {settings?.published && !settings.enrollmentOpen && <p className={styles.offerNote}>Registration is currently closed.</p>}
                    </div>
                </aside>
            </section>

            <section className={styles.section} id="curriculum" aria-labelledby="modules-heading">
                <p className={styles.eyebrow}>Curriculum</p>
                <h2 id="modules-heading">Course Modules</h2>
                <div className={styles.moduleGrid}>
                    {MODULES.map((module, index) => {
                        const Icon = moduleIcons[index];
                        return <article key={module.id} className={styles.module}><Icon className={styles.tileIcon} aria-hidden="true" /><h3>{module.title}</h3><p>{module.description}</p></article>;
                    })}
                </div>
            </section>

            <section className={styles.section} aria-labelledby="experience-heading">
                <p className={styles.eyebrow}>Learning experience</p>
                <h2 id="experience-heading">What’s Included</h2>
                <ul className={styles.formats}>
                    {formats.map(([Icon, label]) => <li key={label}><Icon className={styles.tileIcon} aria-hidden="true" /><span>{label}</span></li>)}
                </ul>
                <div className={styles.materialNote}><BookOpen aria-hidden="true" /><p>Digital study materials are included. Printed copies are an optional purchase.</p></div>
            </section>

            <section className={styles.section} aria-labelledby="internship-heading">
                <div className={styles.internship}>
                    <BriefcaseBusiness aria-hidden="true" />
                    <div>
                        <h2 id="internship-heading">Paid Internship Opportunity</h2>
                        <p>Complete the course successfully and score at least <strong>80%</strong> to qualify for a guaranteed paid internship with DEV Infinity.</p>
                        {settings?.published ? <dl className={styles.terms}>
                            <div><dt>Course completion</dt><dd>{settings.completionCriteria}</dd></div>
                            <div><dt>Duration</dt><dd>{settings.internshipDuration}</dd></div>
                            <div><dt>Stipend</dt><dd>{settings.internshipStipend}</dd></div>
                            <div><dt>Onboarding</dt><dd>{settings.internshipOnboarding}</dd></div>
                            <div><dt>Other terms</dt><dd>{settings.internshipTerms}</dd></div>
                        </dl> : <p className={styles.offerNote}>Internship terms are awaiting confirmation.</p>}
                    </div>
                </div>
            </section>

            <section className={styles.section} aria-labelledby="faq-heading">
                <h2 id="faq-heading">Frequently Asked Questions</h2>
                <div className={styles.faqs}>
                    {faqs.map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown aria-hidden="true" /></summary><p>{answer}</p></details>)}
                </div>
            </section>

            <section className={styles.bottom} aria-label="Enroll in the course">
                <h2>Ready to get started?</h2>
                <CourseActions closed={closed} />
            </section>
        </div>
    );
}

function CourseActions({ closed, vertical = false }) {
    return <div className={vertical ? styles.verticalActions : styles.actions}>
        {!closed && <Link className={styles.primary} href="/dev/course/portal?mode=enroll">Enroll Now <ArrowRight size={19} aria-hidden="true" /></Link>}
        <Link className={styles.secondary} href="/dev/course/portal">Student Login</Link>
    </div>;
}
