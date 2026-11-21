import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown, ArrowRight, BrainCircuit, Cloud, Code, Database, Globe, Palette, Shield, Smartphone, Sparkles, Workflow,
} from "lucide-react";
import Button from "@/components/ui/Button";
import styles from "./page.module.css";

export const metadata = {
  title: "Machine Learning, Automation & LLM Development | DEV Infinity",
  description: "Build custom machine learning models, workflow automation, and large language model applications with DEV Infinity.",
};

const primaryServices = [
  {
    id: "machine-learning",
    icon: BrainCircuit,
    title: "Machine learning",
    description: "Turn historical data, images, and documents into predictions your team can use. We build the model and the pipeline that keeps it working after launch.",
    projects: [
      "Demand forecasting, classification, and anomaly detection",
      "Computer vision and document classification",
      "Model evaluation, deployment, and monitoring",
    ],
    cta: "Discuss a machine learning project",
  },
  {
    id: "automation",
    icon: Workflow,
    title: "Workflow automation",
    description: "Connect the systems you already use and automate the steps your team repeats. Keep people in control of approvals and exceptions.",
    projects: [
      "API, webhook, and back-office integrations",
      "Document intake, approvals, and reporting",
      "Retries, exception handling, and audit trails",
    ],
    cta: "Discuss an automation project",
  },
  {
    id: "llm-development",
    icon: Sparkles,
    title: "Custom LLM development",
    description: "Build language model solutions around your data and workflows. We can adapt an open-weight model, connect it to your knowledge base, or integrate a hosted model into your product.",
    projects: [
      "Fine-tuning open-weight language models",
      "Knowledge assistants with retrieval and citations",
      "Evaluation, guardrails, and private model serving",
    ],
    cta: "Discuss an LLM project",
  },
];

const otherServices = [
  { id: "web-app", icon: Globe, title: "Web app development", description: "Customer portals, commerce sites, and real-time products." },
  { id: "mobile-app", icon: Smartphone, title: "Mobile app development", description: "Native and cross-platform apps for iOS and Android." },
  { id: "saas", icon: Cloud, title: "Custom SaaS development", description: "Multi-tenant platforms with subscriptions and access controls." },
  { id: "custom-software", icon: Code, title: "Custom software", description: "Internal tools, dashboards, and legacy system modernization." },
  { id: "database", icon: Database, title: "Databases and backend", description: "Data pipelines, APIs, and the systems that connect them." },
  { id: "security", icon: Shield, title: "Security and compliance support", description: "Application reviews, access controls, and security hardening." },
  { id: "design", icon: Palette, title: "UI and UX design", description: "Product research, prototypes, and design systems." },
];

export default function ServicesPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="services-title">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>DEV Infinity Services</p>
          <h1 id="services-title">Machine learning, automation and <span className="brand-gradient-text">custom LLMs</span></h1>
          <p className={styles.lead}>
            Predict outcomes from your data, automate repetitive work, and build language models and assistants for the way your team works.
          </p>
          <div className={styles.actions}>
            <Button href="/dev/request" size="large">Start a project <ArrowRight aria-hidden="true" size={18} /></Button>
            <Button href="#ai" variant="secondary" size="large">Explore services <ArrowDown aria-hidden="true" size={18} /></Button>
          </div>
        </div>
        <div className={styles.heroArt}>
          <Image src="/design/services-ai.webp" alt="" fill priority sizes="(max-width: 720px) 100vw, (max-width: 1300px) 45vw, 550px" />
        </div>
      </section>

      <section className={styles.section} id="ai" aria-labelledby="focus-title">
        <h2 id="focus-title">What we can help you build</h2>
        <div className={styles.focusGrid}>
          {primaryServices.map(({ id, title, icon: Icon, description, projects, cta }) => (
            <article className={styles.focusCard} id={id} key={id}>
              <span className={styles.icon}><Icon size={23} aria-hidden="true" /></span>
              <h3>{title}</h3>
              <p>{description}</p>
              <ul>{projects.map((project) => <li key={project}>{project}</li>)}</ul>
              <Button href={`/dev/request?service=${id}`} variant="outline" size="small">
                {cta} <ArrowRight size={16} aria-hidden="true" />
              </Button>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.delivery} aria-labelledby="delivery-title">
        <div>
          <h2 id="delivery-title">From pilot to production</h2>
          <p>Start with one use case and a measurable goal. Once the pilot has been evaluated, expand it to the systems and teams that need it.</p>
        </div>
        <dl>
          <div><dt>Scope</dt><dd>Map the workflow, available data, and a baseline for quality or time saved.</dd></div>
          <div><dt>Validate</dt><dd>Test on representative inputs and review errors with the people who will use the system.</dd></div>
          <div><dt>Deploy</dt><dd>Integrate with your existing tools, monitor performance, and document the handover.</dd></div>
        </dl>
      </section>

      <section className={styles.section} aria-labelledby="engineering-title">
        <h2 id="engineering-title">Product engineering and design</h2>
        <ul className={styles.serviceList}>
          {otherServices.map(({ id, title, icon: Icon, description }) => (
            <li id={id} key={id}>
              <Link href={`/dev/request?service=${id}`}>
                <Icon className={styles.serviceIcon} size={20} aria-hidden="true" />
                <span><strong>{title}</strong><span>{description}</span></span>
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.contact} aria-labelledby="contact-title">
        <h2 id="contact-title">What are you looking to build?</h2>
        <p>Tell us what you want to predict, automate, or build, and what tools or data you have today.</p>
        <div className={styles.actions}>
          <Button href="/dev/request" size="large">Start a project <ArrowRight size={18} aria-hidden="true" /></Button>
          <Button href="/dev/contact" variant="secondary" size="large">Contact us</Button>
        </div>
      </section>
    </div>
  );
}
