export const COURSE_TITLE = "Professional Technology Training Program";
export const COURSE_FEE = 1_630_000;
export const REGISTRATION_DEADLINE = "26 November 2026";
export const REGISTRATION_CLOSE = Date.parse("2026-11-27T00:00:00+05:30");
export const COURSE_START = "1 December 2026";
export const INTERNSHIP_THRESHOLD = 80;

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
    published: false,
    enrollmentEnabled: false,
    hardcopyPrice: null,
    schedule: "",
    refundPolicy: "",
    internshipDuration: "",
    internshipStipend: "",
    internshipOnboarding: "",
    internshipTerms: "",
    completionCriteria: "",
};

export function canPublish(settings) {
    return ["internshipDuration", "internshipStipend", "internshipOnboarding", "internshipTerms", "completionCriteria"]
        .every((key) => settings[key]?.trim());
}

export function registrationOpen(settings, now = Date.now()) {
    return Boolean(settings.published && settings.enrollmentEnabled && canPublish(settings) && now < REGISTRATION_CLOSE);
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
        eligible: completed && work.length > 0 && graded.length === work.length && earned * 100 >= possible * INTERNSHIP_THRESHOLD,
    };
}

export function inr(paise) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: paise % 100 ? 2 : 0 }).format(paise / 100);
}
