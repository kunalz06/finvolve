export const COURSE_TITLE = "Professional Technology Training Program";
export const COURSE_FEE = 1_630_000;
export const REGISTRATION_DEADLINE = "26 November 2026";
export const REGISTRATION_CLOSE = Date.parse("2026-11-27T00:00:00+05:30");
export const COURSE_START = "1 December 2026";
export const INTERNSHIP_THRESHOLD = 80;
export const COURSE_TERMS_VERSION = "2026-11-21";
export const MODULES = [
    { id: "machine-learning", title: "Machine Learning", description: "Explore how models learn from data, and put machine learning fundamentals into practice." },
    { id: "cybersecurity", title: "Cybersecurity", description: "Learn how to recognize common threats, protect systems, and apply core defensive security practices." },
    { id: "software-stack", title: "Software Stack", description: "Understand how the pieces of a modern software stack fit together to build and deploy applications." },
];

export const ITEM_TYPES = {
    live: "Live class",
    recording: "Recording",
    material: "Study material",
    assignment: "Assignment",
    project: "Project",
};

export const DEFAULT_SETTINGS = {
    published: true,
    enrollmentEnabled: true,
    hardcopyPrice: null,
    schedule: "",
    refundPolicy: "",
    internshipDuration: "3 months, online",
    internshipStipend: "Discussed with interested candidates",
    internshipOnboarding: "",
    internshipTerms: "",
    completionCriteria: "DEV Infinity confirms successful course completion.",
};

export function courseTerms(settings) {
    const duration = settings.internshipDuration || DEFAULT_SETTINGS.internshipDuration;
    const stipend = settings.internshipStipend || DEFAULT_SETTINGS.internshipStipend;
    return [
        "Students with backlogs may apply.",
        "Enrollment is confirmed after Razorpay confirms the payment. Digital study materials are included. Printed copies are optional when available.",
        "Students who successfully complete the course receive a certificate of completion.",
        "Students who successfully complete the course and score above 80% are eligible for a paid internship opportunity with DEV Infinity.",
        `Internship duration and mode: ${duration}`,
        `Internship stipend: ${stipend}`,
        settings.internshipOnboarding,
        settings.internshipTerms,
    ].filter(Boolean);
}

export function canPublish(settings) {
    return ["internshipDuration", "internshipStipend", "completionCriteria"]
        .every((key) => settings[key]?.trim());
}

export function registrationOpen(settings, now = Date.now()) {
    return Boolean(settings.published && settings.enrollmentEnabled && canPublish(settings) && now < REGISTRATION_CLOSE);
}

export function courseCheckoutMode(environment, keyId, keySecret) {
    if (!keySecret || !/^rzp_(test|live)_[a-zA-Z0-9]+$/.test(keyId || "")) return null;
    const mode = keyId.startsWith("rzp_test_") ? "test" : "live";
    if (environment === "preview" && mode !== "test") return null;
    if (environment === "production" && mode !== "live") return null;
    return mode;
}

export function courseCheckoutOpen(settings, environment, mode, now = Date.now()) {
    if (!mode) return false;
    if (environment === "preview") return mode === "test" && now < REGISTRATION_CLOSE;
    if (environment === "production" && mode !== "live") return false;
    return registrationOpen(settings, now);
}

export function isAssessment(item) {
    return item.type === "assignment" || item.type === "project";
}

export function summarizeProgress(items, progress = {}, submissions = {}, completed = false) {
    const work = items.filter(isAssessment);
    const graded = work.filter(({ id, maxMarks }) => Number.isFinite(submissions[id]?.marks) &&
        submissions[id].marks >= 0 && submissions[id].marks <= maxMarks);
    const possible = graded.reduce((sum, item) => sum + item.maxMarks, 0);
    const earned = graded.reduce((sum, { id }) => sum + submissions[id].marks, 0);
    const score = possible > 0 ? earned / possible * 100 : null;
    const finished = items.filter((item) => isAssessment(item) ? Boolean(submissions[item.id]) : progress[item.id] === true).length;
    return {
        finished,
        total: items.length,
        graded: graded.length,
        assessments: work.length,
        score,
        eligible: completed && work.length > 0 && graded.length === work.length && earned * 100 > possible * INTERNSHIP_THRESHOLD,
    };
}

export function inr(paise) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: paise % 100 ? 2 : 0 }).format(paise / 100);
}
