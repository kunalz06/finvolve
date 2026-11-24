import { ASSESSMENT_WEIGHTS, CLASS_TIME, COURSE_END, COURSE_PREREQUISITES, COURSE_WEEKS, FINAL_EXAM_TIME } from "@/lib/course-plan.mjs";
import { COURSE_START } from "@/lib/course.mjs";
import styles from "./course.module.css";

export default function CoursePlan() {
    return <>
        <section className={styles.section} aria-labelledby="prerequisites-heading">
            <h2 id="prerequisites-heading">Before you join</h2>
            <p>Each module starts at an intermediate level and progresses to advanced applications. Review these foundations before the first class.</p>
            <ul className={styles.planList}>{COURSE_PREREQUISITES.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
        <section className={styles.section} aria-labelledby="course-plan-heading" id="course-plan">
            <h2 id="course-plan-heading">Four-week course plan</h2>
            <p>{COURSE_START} to {COURSE_END}. Three 90-minute live sessions per week, {CLASS_TIME}, plus 3–5 hours of independent work each week. The final exam is two hours.</p>
            <div className={styles.faqs}>
                {COURSE_WEEKS.map(({ title, dates, classes, work }, index) => (
                    <details key={title} open={index === 0 ? true : undefined}>
                        <summary>Week {index + 1} · {title} · {dates}</summary>
                        <ul className={styles.planList}>{classes.map(([date, topic]) => <li key={date}><strong>{date}</strong> — {topic}</li>)}</ul>
                        {work.length ? <>
                            <p><strong>Assignment</strong> {work[0][1]}<br /><strong>Project checkpoint</strong> {work[1][1]}<br />
                            Both are due on {dates.split("–").at(-1)} by 11:59 PM IST.</p>
                        </> : <p>Polish and demonstrate the integrated capstone using the three assessed project checkpoints. <strong>Final exam:</strong> {FINAL_EXAM_TIME}.</p>}
                    </details>
                ))}
            </div>
        </section>
        <section className={styles.section} aria-labelledby="grading-heading">
            <h2 id="grading-heading">How you’ll be assessed</h2>
            <ul className={styles.planList}>
                <li><strong>Assignments · {ASSESSMENT_WEIGHTS.assignment}%</strong> Three assignments worth 10 marks each.</li>
                <li><strong>Project checkpoints · {ASSESSMENT_WEIGHTS.project}%</strong> Three assessed checkpoints worth 15 marks each.</li>
                <li><strong>Final exam · {ASSESSMENT_WEIGHTS.exam}%</strong> A two-hour assessment across all three modules.</li>
            </ul>
            <p>Assignments and project checkpoints earn 20% for completion, 20% for submitting on time, and 60% for work quality. Quality covers correctness, reasoning, testing, and documentation. Late work can still earn completion and quality marks until that submission is graded. Timeliness uses the timestamp of the last submitted version.</p>
        </section>
    </>;
}
