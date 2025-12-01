import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.container}`}>
                <div className={styles.content}>
                    <div className={styles.brand}>
                        <h3>Finvolve</h3>
                        <p>Building the future of software.</p>
                    </div>
                    <div className={styles.links}>
                        <h4>Connect</h4>
                        <a href="mailto:mitraricky06@gmail.com">mitraricky06@gmail.com</a>
                        <a href="tel:+919907958859">+91 99079 58859</a>
                    </div>
                    <div className={styles.links}>
                        <h4>Legal</h4>
                        <a href="/finvolve/terms">Terms & Conditions</a>
                        <a href="/finvolve/privacy-policy">Privacy Policy</a>
                    </div>
                </div>
                <div className={styles.copyright}>
                    &copy; {new Date().getFullYear()} Finvolve. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
