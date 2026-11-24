import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, BrainCircuit, Sparkles, Workflow } from "lucide-react";
import HomeCourse from "@/components/course/HomeCourse";
import Button from "@/components/ui/Button";
import styles from "./DevHome.module.css";

const capabilities = [
  {
    id: "machine-learning",
    icon: BrainCircuit,
    title: "Machine learning",
    detail: "Forecast demand, detect anomalies, and turn images or documents into data your team can use.",
  },
  {
    id: "automation",
    icon: Workflow,
    title: "Workflow automation",
    detail: "Connect your tools and automate repetitive tasks, with approvals and exception handling built in.",
  },
  {
    id: "llm-development",
    icon: Sparkles,
    title: "Custom LLM development",
    detail: "Fine-tune open-weight models or build assistants that answer from your own knowledge base.",
  },
];

export default function DevHome() {
  return (
    <div className={styles.page}>
      <section className={styles.hero} data-home-intro aria-labelledby="home-title">
        <div className={styles.heroArt}>
          <Image src="/design/services-ai.webp" alt="" fill priority sizes="(max-width: 760px) 100vw, 65vw" />
        </div>
        <div className={styles.heroCopy}>
          <h1 id="home-title">AI engineering for <span>products and workflows</span></h1>
          <p>DEV Infinity builds machine learning models, business automation, and custom large language models. We help teams evaluate a pilot, integrate it with their tools, and run it in production.</p>
          <div className={styles.actions}>
            <Button href="/dev/request" size="large">Start a project <ArrowRight size={18} aria-hidden="true" /></Button>
            <Link className={styles.heroLink} href="/dev/services">Explore services <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <Link className={styles.courseJump} href="#company-course">See the training program <ArrowDown size={15} aria-hidden="true" /></Link>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="capabilities-title">
        <h2 id="capabilities-title">What we build</h2>
        <ul className={styles.capabilities}>
          {capabilities.map(({ id, icon: Icon, title, detail }) => (
            <li key={id}>
              <Link href={`/dev/services#${id}`} className={styles.capability}>
                <span className={styles.icon}><Icon size={22} aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{detail}</p>
                <span className={styles.capabilityLink}>Explore service <ArrowRight size={16} aria-hidden="true" /></span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <HomeCourse />

      <section className={styles.contact} aria-labelledby="home-contact-title">
        <div>
          <h2 id="home-contact-title">Tell us what you want to build</h2>
          <p>Bring the workflow, data, or product idea you already have. We’ll help scope a first build around your goals.</p>
        </div>
        <Button href="/dev/request" size="large">Start a project <ArrowRight size={18} aria-hidden="true" /></Button>
      </section>
    </div>
  );
}
