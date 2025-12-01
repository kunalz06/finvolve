import styles from './page.module.css';

export default function About() {
    return (
        <div className="container section">
            <div className={styles.header}>
                <h1 className="section-title">About Finvolve</h1>
                <p className={styles.lead}>
                    We are a team of passionate developers dedicated to building high-quality software solutions.
                </p>
            </div>

            <div className={styles.content}>
                <div className={styles.imagePlaceholder}>
                    {/* Placeholder for an image or graphic */}
                    <div className={styles.placeholderInner}>Finvolve Team</div>
                </div>
                <div className={styles.text}>
                    <h2>Our Mission</h2>
                    <p>
                        At Finvolve, our mission is to empower businesses with cutting-edge technology.
                        We believe in the power of software to transform ideas into reality.
                        Whether it's a mobile app to reach your customers on the go, or a robust web platform
                        to manage your operations, we have the expertise to deliver.
                    </p>

                    <h2>Our Tech Stack</h2>
                    <ul className={styles.list}>
                        <li><strong>Frontend:</strong> React.js, Next.js, HTML5, CSS3</li>
                        <li><strong>Mobile:</strong> Kotlin (Android), React Native</li>
                        <li><strong>Backend:</strong> Node.js, Firebase, SQL/NoSQL</li>
                        <li><strong>Design:</strong> Modern UI/UX principles</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
