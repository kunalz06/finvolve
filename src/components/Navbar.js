"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { Menu, X, Zap } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import styles from "./Navbar.module.css";

const HOME_PATH = "/dev";

const navLinks = [
  { name: "Services", href: "/dev/services" },
  { name: "Cloud", href: "/dev/cloud" },
  { name: "About", href: "/dev/about" },
  { name: "Start Project", href: "/dev/request" },
  { name: "Contact Us", href: "/dev/contact", isCta: true },
];

function useNavLinks(pathname) {
  const isHome = pathname === HOME_PATH || pathname === "/";
  if (isHome) return navLinks;
  const activeIdx = navLinks.findIndex((link) => pathname.startsWith(link.href));
  const homeLink = { name: "Home", href: HOME_PATH };
  const filtered = navLinks.filter((_, idx) => idx !== activeIdx);
  return [homeLink, ...filtered];
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const closeTimerRef = useRef(null);
  const visibleLinks = useNavLinks(pathname);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setMenuVisible(true));
      });
    } else {
      setMenuVisible(false);
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const closeMobileMenu = useCallback(() => {
    setMenuVisible(false);
    closeTimerRef.current = setTimeout(() => setMobileMenuOpen(false), 220);
  }, []);

  const openMobileMenu = useCallback(() => {
    setMobileMenuOpen(true);
  }, []);

  const toggleMenu = useCallback(() => {
    if (mobileMenuOpen) closeMobileMenu();
    else openMobileMenu();
  }, [mobileMenuOpen, closeMobileMenu, openMobileMenu]);

  const handleLinkClick = useCallback(() => {
    closeMobileMenu();
  }, [closeMobileMenu]);

  return (
    <nav className={styles.navFixed}>
      <div className={styles.navBar + (scrolled ? " " + styles.navScrolled : "")}>
        <div className={styles.navInner + (scrolled ? " " + styles.navInnerScrolled : "")}>
          <Link href="/dev/" className={styles.navLogoGroup}>
            <div className={styles.navLogoIcon}>
              <Zap size={20} className={styles.navLogoZap} />
            </div>
            <div className={styles.navLogoTextWrap}>
              <div className={styles.navLogoText}>DEV Infinity</div>
              <div className={styles.navLogoSub}>Software Builders</div>
            </div>
          </Link>

          <div className={styles.navDesktop}>
            {visibleLinks.map((link) =>
              link.isCta ? (
                <Link key={link.name} href={link.href} className={styles.navCtaBtn}>
                  {link.name}
                </Link>
              ) : (
                <Link key={link.name} href={link.href} className={styles.navLink}>
                  {link.name}
                </Link>
              )
            )}
            <ThemeToggle />
          </div>

          <div className={styles.navMobileToggle}>
            <ThemeToggle compact />
            <button
              className={styles.navHamburger}
              onClick={toggleMenu}
              aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={mobileMenuOpen}
              type="button"
            >
              <span className={styles.navHamburgerIcon + (mobileMenuOpen ? " " + styles.navHamburgerOpen : "")}>
                <span /><span /><span />
              </span>
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <>
          <div
            className={styles.navOverlay + (menuVisible ? " " + styles.navOverlayVisible : "")}
            onClick={toggleMenu}
            aria-hidden="true"
          />
          <div className={styles.navMobilePanel + (menuVisible ? " " + styles.navMobilePanelVisible : "")}>
            <div className={styles.navMobileLinks}>
              {visibleLinks.map((link, i) =>
                link.isCta ? (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={styles.navMobileCta}
                    onClick={handleLinkClick}
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={styles.navMobileLink}
                    onClick={handleLinkClick}
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    {link.name}
                  </Link>
                )
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
