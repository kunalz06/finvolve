import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <div className={`container ${styles.navContainer}`}>
                <Link href="/" className={styles.logo}>
                    Finvolve
                </Link>
                <div className={styles.links}>
                    <Link href="/" className={styles.link}>Home</Link>
                    <Link href="/about" className={styles.link}>About</Link>
                    <Link href="/contact" className={styles.link}>Contact</Link>
                    <Link href="/request" className={`btn btn-primary ${styles.cta}`}>Get Started</Link>
                </div>
            </div>
        </nav>
    );
}
