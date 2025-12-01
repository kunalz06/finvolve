"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className={styles.navbar}>
            <div className={`container ${styles.navContainer}`}>
                <Link href="/finvolve" className={styles.logo}>
                    Finvolve
                </Link>

                {/* Mobile Menu Button */}
                <button className={styles.mobileBtn} onClick={toggleMenu} aria-label="Toggle menu">
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Links */}
                <div className={`${styles.links} ${isOpen ? styles.active : ''}`}>
                    <Link href="/finvolve" className={styles.link} onClick={() => setIsOpen(false)}>Home</Link>
                    <Link href="/finvolve/about" className={styles.link} onClick={() => setIsOpen(false)}>About</Link>
                    <Link href="/finvolve/contact" className={styles.link} onClick={() => setIsOpen(false)}>Contact</Link>
                    <Link href="/finvolve/quick-start" className={styles.link} onClick={() => setIsOpen(false)} style={{ color: '#f59e0b' }}>Quick Start</Link>

                    <Link href="/finvolve/request" className={`btn btn-primary ${styles.cta}`} onClick={() => setIsOpen(false)}>Get Started</Link>
                </div>
            </div>
        </nav>
    );
}
