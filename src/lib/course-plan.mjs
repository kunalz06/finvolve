export const COURSE_PREREQUISITES = [
    "Python fundamentals: functions, collections, virtual environments, and reading a notebook.",
    "Basic statistics and algebra: distributions, averages, probability, and interpreting charts.",
    "Working knowledge of Git, the command line, SQL, and HTTP/JSON APIs.",
    "Basic networking and security concepts: IP, DNS, authentication, and permissions.",
    "A laptop with a code editor, Git, Python, and the ability to run containers locally or in a hosted workspace.",
];

export const COURSE_WEEKS = [
    {
        title: "Machine Learning", dates: "14–20 December", module: "machine-learning",
        classes: [
            ["14 December", "Train, validation, and test splits, leakage checks, and baseline pipelines"],
            ["16 December", "Feature engineering, tree ensembles, and model tuning"],
            ["19 December", "Calibration, error analysis, explainability, and drift monitoring"],
        ],
        work: [
            ["assignment", "Model evaluation", "Build a baseline pipeline on a supplied dataset. Compare two models, justify the metric, and document potential leakage.", "2026-12-20"],
            ["project", "Predictive model prototype", "Deliver a reproducible model, an evaluation report, and a short plan for monitoring errors and drift after deployment.", "2026-12-20"],
        ],
        opensOn: "2026-12-14",
    },
    {
        title: "Cybersecurity", dates: "21–27 December", module: "cybersecurity",
        classes: [
            ["21 December", "Threat modelling, trust boundaries, and secure configuration"],
            ["23 December", "Identity, least privilege, secrets management, and audit logging"],
            ["26 December", "Defensive alert triage, incident response, and recovery drills using synthetic logs"],
        ],
        work: [
            ["assignment", "Threat model and control review", "Map assets and trust boundaries for the supplied application. Prioritize defensive controls and explain the trade-offs.", "2026-12-27"],
            ["project", "Defensive monitoring case study", "Triage the supplied synthetic logs, document an incident timeline, and present a response and recovery plan.", "2026-12-27"],
        ],
        opensOn: "2026-12-21",
    },
    {
        title: "Software Stack", dates: "28 December–3 January", module: "software-stack",
        classes: [
            ["28 December", "API contracts, database schemas, migrations, and error handling"],
            ["30 December", "Container builds, CI checks, and integration testing"],
            ["2 January", "Deployment, health checks, observability, and rollback"],
        ],
        work: [
            ["assignment", "API and integration tests", "Implement an API endpoint with input validation, a persistent data model, and integration tests for valid and invalid inputs.", "2027-01-03"],
            ["project", "Deployable service", "Package a tested service in a container. Submit setup instructions, health checks, structured logs, and a rollback checklist.", "2027-01-03"],
        ],
        opensOn: "2026-12-28",
    },
    {
        title: "Integration and final exam", dates: "4–10 January", module: "software-stack",
        classes: [
            ["4 January", "Capstone lab: connect the model, API, and defensive controls"],
            ["6 January", "Project clinic: test failure cases and review observability"],
            ["8 January", "Capstone demos and exam review across all three modules"],
        ],
        work: [],
        opensOn: "2027-01-04",
    },
];

export const CLASS_TIME = "7:00–8:30 PM IST";
export const COURSE_END = "10 January 2027";
export const FINAL_EXAM_TIME = "10 January 2027, 6:00–8:00 PM IST";
export const ASSESSMENT_WEIGHTS = { assignment: 30, project: 45, exam: 25 };

export const COURSE_ASSESSMENTS = Object.freeze(Object.fromEntries([
    ...COURSE_WEEKS.flatMap(({ module, opensOn, work }) => work.map(([type, title, description, date]) => {
        const id = `plan-${module}-${type}`;
        const unit = ASSESSMENT_WEIGHTS[type] / 15;
        return [id, {
            id, module, type, title, description, opensAt: `${opensOn}T00:00:00+05:30`,
            dueAt: `${date}T23:59:59.999+05:30`, maxMarks: unit * 5,
            rubric: { completion: unit, timeliness: unit, quality: unit * 3 }, published: true,
        }];
    })),
    ["plan-final-exam", {
        id: "plan-final-exam", module: "software-stack", type: "exam", title: "Final exam",
        description: "A two-hour assessment across all three modules, combining case analysis, interpretation of results, and practical system design. Submit your answers in the portal by 8:00 PM IST.",
        opensAt: "2027-01-10T18:00:00+05:30", dueAt: "2027-01-10T20:00:00+05:30",
        maxMarks: ASSESSMENT_WEIGHTS.exam, published: true,
    }],
]));

export const COURSE_PLAN_ITEMS = Object.freeze({
    ...Object.fromEntries(COURSE_WEEKS.flatMap(({ module, classes }, week) => classes.map(([date, title], index) => {
        const id = `plan-class-${week + 1}-${index + 1}`;
        const day = date.split(" ")[0].padStart(2, "0");
        const month = date.endsWith("January") ? "2027-01" : "2026-12";
        return [id, {
            id, module, type: "live", title, description: "", startsAt: `${month}-${day}T19:00:00+05:30`,
            endsAt: `${month}-${day}T20:30:00+05:30`, published: true,
        }];
    }))),
    ...COURSE_ASSESSMENTS,
});

export const plannedCourseItem = (id) => Object.hasOwn(COURSE_PLAN_ITEMS, id) ? COURSE_PLAN_ITEMS[id] : undefined;

export function assessmentAvailability(item, now = Date.now()) {
    if (item.opensAt && now < Date.parse(item.opensAt)) return "upcoming";
    if (item.type === "exam" && item.dueAt && now > Date.parse(item.dueAt)) return "closed";
    if (item.id === "plan-final-exam" && !item.asset) return "awaiting-paper";
    return "open";
}

export function rubricMarks(item, submission, completion, quality) {
    if (!item.rubric || !Number.isInteger(completion) || completion < 0 || completion > item.rubric.completion ||
        !Number.isInteger(quality) || quality < 0 || quality > item.rubric.quality) return null;
    const timeliness = Date.parse(submission.submittedAt) <= Date.parse(item.dueAt) ? item.rubric.timeliness : 0;
    return { completion, quality, timeliness, marks: completion + quality + timeliness };
}
