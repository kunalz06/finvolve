"use client";

import Image from "next/image";
import { ArrowRight, GraduationCap } from "lucide-react";
import Button from "@/components/ui/Button";
import usePublicCourseSettings from "@/hooks/usePublicCourseSettings";
import {
  COURSE_FEE, COURSE_START, COURSE_TITLE, INTERNSHIP_THRESHOLD, MODULES, REGISTRATION_DEADLINE, inr,
} from "@/lib/course.mjs";
import styles from "../DevHome.module.css";

export default function HomeCourse() {
  const settings = usePublicCourseSettings();

  return (
    <section className={styles.course} id="company-course" aria-labelledby="home-course-title">
      <div className={styles.courseVisual}>
        <Image src="/course/red-gears.webp" alt="" fill sizes="(max-width: 760px) 100vw, 36vw" />
      </div>
      <div className={styles.courseCopy}>
        <p className={styles.eyebrow}><GraduationCap size={19} aria-hidden="true" /> Company Academy</p>
        <h2 id="home-course-title">{COURSE_TITLE}</h2>
        {settings?.published ? (
          <>
            <ul className={styles.modules} aria-label="Course modules">
              {MODULES.map(({ id, title }) => <li key={id}>{title}</li>)}
            </ul>
            <p className={styles.courseDescription}>Learn through live classes, recordings, assignments, and practical projects. Digital study materials are included.</p>
            <dl className={styles.courseFacts}>
              <div><dt>Course fee</dt><dd>{inr(COURSE_FEE)}</dd></div>
              <div><dt>Registration deadline</dt><dd>{REGISTRATION_DEADLINE}</dd></div>
              <div><dt>Course starts</dt><dd>{COURSE_START}</dd></div>
            </dl>
            <p className={styles.courseDescription}>
              Successfully complete the course to earn a certificate. Students who also score <strong>above {INTERNSHIP_THRESHOLD}%</strong> qualify for a paid internship opportunity.
              {settings.internshipDuration && <> The internship runs {settings.internshipDuration}.</>}
            </p>
          </>
        ) : <p className={styles.courseDescription}>Visit the course page for the program overview and student portal.</p>}
        <div className={styles.actions}>
          {settings?.published && settings.enrollmentOpen && <Button href="/dev/course/portal?mode=enroll">Enroll now <ArrowRight size={17} aria-hidden="true" /></Button>}
          <Button href="/dev/course" variant={settings?.published && settings.enrollmentOpen ? "secondary" : "primary"}>View course details <ArrowRight size={17} aria-hidden="true" /></Button>
        </div>
      </div>
    </section>
  );
}
