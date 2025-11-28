import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import styles from './page.module.css';

export const metadata = {
    title: 'Our Apps | Finvolve',
    description: 'Access our suite of applications and tools.',
};

export default function AppsPage() {
    const apps = [
        {
            id: 'minor-degree',
            title: 'Minor Degree Registration',
            description: 'Official portal for IEM students to register for minor degrees in CyberSecurity, Pega, AI-ML, and DataScience.',
            icon: <BookOpen className={styles.icon} size={40} />,
            href: '/iemminorcourse',
        },
        // Future apps can be added here
    ];

    return (
        <div className="container">
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1 className={styles.title}>
                        Our <span className={styles.highlight}>Applications</span>
                    </h1>
                    <p className={styles.subtitle}>
                        Explore our suite of specialized tools and portals designed to enhance your experience.
                    </p>
                </div>
            </section>

            {/* Apps Grid */}
            <section className="section">
                <div className={styles.grid}>
                    {apps.map((app) => (
                        <div key={app.id} className="card">
                            <div className={styles.cardContent}>
                                {app.icon}
                                <h3 className={styles.cardTitle}>
                                    {app.title}
                                </h3>
                                <p className={styles.cardDescription}>
                                    {app.description}
                                </p>
                                <a
                                    href={app.href}
                                    className="btn btn-primary"
                                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    Open App
                                    <ArrowRight size={20} style={{ marginLeft: '8px' }} />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
