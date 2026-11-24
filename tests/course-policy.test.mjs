import test from "node:test";
import assert from "node:assert/strict";
import {
    canPublish, courseCheckoutMode, courseCheckoutOpen, courseTerms, DEFAULT_SETTINGS, REGISTRATION_CLOSE, registrationOpen, summarizeProgress,
} from "../src/lib/course.mjs";

test("checkout requires published internship terms and closes at midnight IST", () => {
    const settings = {
        ...DEFAULT_SETTINGS,
        internshipDuration: "Confirmed duration",
        internshipStipend: "Confirmed stipend",
        internshipOnboarding: "Confirmed onboarding",
        internshipTerms: "Confirmed terms",
        completionCriteria: "Confirmed criteria",
        published: true,
        enrollmentEnabled: true,
    };
    assert.equal(canPublish(settings), true);
    assert.equal(registrationOpen({ ...settings, internshipStipend: "" }, REGISTRATION_CLOSE - 1), false);
    assert.equal(registrationOpen({ ...settings, enrollmentEnabled: false }, REGISTRATION_CLOSE - 1), false);
    assert.equal(registrationOpen(settings, REGISTRATION_CLOSE - 1), true);
    assert.equal(registrationOpen(settings, REGISTRATION_CLOSE), false);
});

test("internship eligibility requires completion and all marks, with a strict weighted threshold above 80%", () => {
    const items = [
        { id: "a", type: "assignment", maxMarks: 30 },
        { id: "p", type: "project", maxMarks: 70 },
        { id: "r", type: "recording" },
    ];
    const marks = { a: { marks: 30 }, p: { marks: 50 } };
    assert.equal(summarizeProgress(items, {}, marks, false).eligible, false);
    assert.equal(summarizeProgress(items, {}, { a: marks.a }, true).eligible, false);
    assert.equal(summarizeProgress(items, {}, { ...marks, p: { marks: 49 } }, true).eligible, false);
    assert.equal(summarizeProgress(items, {}, marks, true).eligible, false);
    assert.deepEqual(summarizeProgress(items, { r: true }, { ...marks, p: { marks: 51 } }, true), {
        finished: 3, total: 3, graded: 2, assessments: 2, score: 81, eligible: true,
    });
});


test("test checkout stays in Preview and requires a test credential pair", () => {
    const beforeClose = REGISTRATION_CLOSE - 1;
    assert.equal(courseCheckoutMode("preview", "rzp_live_public", "key"), null);
    assert.equal(courseCheckoutMode("preview", "rzp_test_public", ""), null);
    assert.equal(courseCheckoutMode("preview", "rzp_test_public", "key"), "test");
    assert.equal(courseCheckoutMode("production", "rzp_test_public", "key"), null);
    assert.equal(courseCheckoutMode("production", "rzp_live_public", "key"), "live");
    assert.equal(courseCheckoutOpen(DEFAULT_SETTINGS, "preview", "test", beforeClose), true);
    assert.equal(courseCheckoutOpen(DEFAULT_SETTINGS, "preview", "test", REGISTRATION_CLOSE), false);
    assert.equal(courseCheckoutOpen(DEFAULT_SETTINGS, "preview", "live", beforeClose), false);
    assert.equal(courseCheckoutOpen({ ...DEFAULT_SETTINGS, published: false }, "production", "live", beforeClose), false);
    assert.equal(courseCheckoutOpen(DEFAULT_SETTINGS, "production", "live", beforeClose), true);
});


test("enrollment terms include the confirmed internship arrangement and accept applicants with backlogs", () => {
    const terms = courseTerms(DEFAULT_SETTINGS).join(" ");
    assert.match(terms, /Students with backlogs may apply/);
    assert.match(terms, /certificate of completion/);
    assert.match(terms, /above 80%/);
    assert.match(terms, /3 months, online/);
    assert.match(terms, /Discussed with interested candidates/);
});

test("four-week plan covers twelve live classes and 100 marks, including a timed final", async () => {
    const { COURSE_PLAN_ITEMS, COURSE_ASSESSMENTS, assessmentAvailability, rubricMarks } = await import("../src/lib/course-plan.mjs");
    const { COURSE_START_DATE, REGISTRATION_DATE } = await import("../src/lib/course.mjs");
    const classes = Object.values(COURSE_PLAN_ITEMS).filter(({ type }) => type === "live");
    const assessed = Object.values(COURSE_ASSESSMENTS);
    const exam = COURSE_ASSESSMENTS["plan-final-exam"];
    assert.equal(classes.length, 12);
    assert.equal(classes[0].startsAt.slice(0, 10), COURSE_START_DATE);
    assert.equal(REGISTRATION_DATE, "2026-12-03");
    assert.equal(registrationOpen(DEFAULT_SETTINGS, Date.parse("2026-12-03T23:59:59+05:30")), true);
    assert.equal(assessed.reduce((sum, item) => sum + item.maxMarks, 0), 100);
    assert.deepEqual(assessed.filter((item) => item.type === "assignment").map((item) => item.maxMarks), [10, 10, 10]);
    assert.deepEqual(assessed.filter((item) => item.type === "project").map((item) => item.maxMarks), [15, 15, 15]);
    assert.equal(Date.parse(exam.dueAt) - Date.parse(exam.opensAt), 2 * 60 * 60_000);
    assert.equal(assessmentAvailability(exam, Date.parse(exam.opensAt) - 1), "upcoming");
    assert.equal(assessmentAvailability(exam, Date.parse(exam.opensAt)), "awaiting-paper");
    assert.equal(assessmentAvailability({ ...exam, asset: {} }, Date.parse(exam.opensAt)), "open");
    assert.equal(assessmentAvailability({ ...exam, asset: {} }, Date.parse(exam.dueAt) + 1), "closed");
    const assignment = assessed[0];
    assert.equal(rubricMarks(assignment, { submittedAt: assignment.dueAt }, 2, 5).marks, 9);
    assert.equal(rubricMarks(assignment, { submittedAt: "2026-12-21T00:00:00+05:30" }, 2, 5).marks, 7);
    assert.equal(rubricMarks(assignment, { submittedAt: assignment.dueAt }, 2, 7), null);
    assert.equal(summarizeProgress(assessed, {}, { [exam.id]: { marks: 25 } }, true).score, 25);
    const noSubmission = summarizeProgress(assessed, {}, { [exam.id]: { marks: 0, missing: true } }, true);
    assert.equal(noSubmission.finished, 0);
    assert.equal(noSubmission.graded, 1);
});
