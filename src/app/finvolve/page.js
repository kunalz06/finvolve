import Link from 'next/link';
import { ArrowRight, Code, Smartphone, Globe, Zap } from 'lucide-react';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.title}>
              Building the Future with <span className={styles.highlight}>Finvolve</span>
            </h1>
            <p className={styles.subtitle}>
              Premium software development services tailored to your needs.
              From Android apps to complex web applications, we bring your ideas to life.
            </p>
            <div className={styles.actions}>
              <Link href="/finvolve/request" className="btn btn-primary">
                Start a Project <ArrowRight size={20} style={{ marginLeft: '8px' }} />
              </Link>
              <Link href="/finvolve/about" className={styles.secondaryBtn}>
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Our Expertise</h2>
          <div className={styles.grid}>
            <div className="card">
              <Globe className={styles.icon} size={40} />
              <h3>Web Development</h3>
              <p>
                Modern web applications built with <strong>React.js</strong> and <strong>Next.js</strong>.
                Fast, SEO-friendly, and scalable.
              </p>
            </div>
            <div className="card">
              <Smartphone className={styles.icon} size={40} />
              <h3>Android Apps</h3>
              <p>
                Native Android applications developed with <strong>Kotlin</strong>.
                Smooth performance and intuitive user interfaces.
              </p>
            </div>
            <div className="card">
              <Code className={styles.icon} size={40} />
              <h3>Custom Software</h3>
              <p>
                Tailored software solutions to solve your unique business challenges.
                Full-stack development services.
              </p>
            </div>
            <div className="card">
              <Zap className={styles.icon} size={40} />
              <h3>High Performance</h3>
              <p>
                Optimized for speed and efficiency. We ensure your applications run smoothly
                under any load.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
