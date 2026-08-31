"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import Button from "@/components/ui/Button";

const HOME_PATH = "/dev";

const navLinks = [
  { name: "Services", href: "/dev/services" },
  { name: "Cloud", href: "/dev/cloud" },
  { name: "About", href: "/dev/about" },
  { name: "Start Project", href: "/dev/request" },
  { name: "Contact Us", href: "/dev/contact", isCta: true },
];

/**
 * Determine which links to show based on the current pathname.
 * - On home page: show all links (no Home button)
 * - On any other page: hide the link matching the current path, prepend Home
 */
function useNavLinks(pathname) {
  const isHome = pathname === HOME_PATH || pathname === "/";

  if (isHome) {
    return navLinks;
  }

  // Find the active link whose href matches the current path
  const activeIdx = navLinks.findIndex((link) => pathname.startsWith(link.href));

  // Build the visible links: Home + all navLinks except the active one
  const homeLink = { name: "Home", href: HOME_PATH };
  const filtered = navLinks.filter((_, idx) => idx !== activeIdx);
  return [homeLink, ...filtered];
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const visibleLinks = useNavLinks(pathname);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <>
      <nav className="fixed left-0 top-0 z-50 w-full px-3 pt-3 md:px-6 md:pt-5">
        <div className={"container mx-auto transition-all duration-200 " + (scrolled ? "max-w-6xl" : "max-w-[1340px]")}>
          <div className={"glass-surface-strong flex items-center justify-between rounded-2xl px-3 py-3 transition-transform duration-200 md:px-6 " + (scrolled ? "-translate-y-1" : "")}>
            <Link href="/dev/" className="group flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[var(--border)] bg-[var(--primary)] shadow-[var(--shadow-soft)] transition-transform duration-200 group-hover:-translate-y-0.5">
                <Zap className="text-white" size={20} />
              </div>
              <div className="min-w-0">
                <div className="font-code-brand text-lg font-black md:text-xl" style={{ color: 'var(--heading, #0f172a)' }}>DEV Infinity</div>
                <div className="hidden font-code-brand text-[11px] uppercase sm:block" style={{ color: 'var(--muted, #64748b)' }}>
                  Software Builders
                </div>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="glass-nav-strip hidden items-center gap-3 rounded-xl px-3 py-2 lg:flex">
              {visibleLinks.map((link) =>
                link.isCta ? (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="rounded-lg border-2 border-[var(--border)] bg-[var(--accent)] px-4 py-2 text-sm font-bold text-white shadow-[var(--shadow-soft)] transition-all duration-200 hover:-translate-y-0.5"
                  >
                    {link.name}
                  </Link>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="rounded-lg px-3 py-2 text-sm font-bold transition-all duration-200 hover:bg-[var(--surface-strong)]" style={{ color: 'var(--muted, #475569)' }}
                  >
                    {link.name}
                  </Link>
                )
              )}
              <ThemeToggle />
            </div>

            {/* Mobile/tablet toggle */}
            <div className="flex items-center gap-2 lg:hidden">
              <ThemeToggle compact />
              <Button
                className="glass-surface-strong relative z-50 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-[var(--border)] shadow-[var(--shadow-soft)] transition-colors hover:-translate-y-0.5 hover:bg-[var(--surface-muted)]"
                style={{ color: 'var(--heading, #0f172a)' }}
                onClick={() => setMobileMenuOpen((open) => !open)}
                aria-label="Toggle navigation"
                type="button"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileMenuOpen ? (
                    <motion.span
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="pointer-events-none flex items-center justify-center"
                    >
                      <X size={24} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="pointer-events-none flex items-center justify-center"
                    >
                      <Menu size={24} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                key="mobile-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md lg:hidden"
                onClick={() => setMobileMenuOpen(false)}
                aria-hidden="true"
              />
              {/* Menu */}
              <motion.div
                key="mobile-menu"
                initial={{ opacity: 0, y: -16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="fixed left-0 top-[72px] z-50 w-full px-3 md:top-[84px] lg:hidden"
              >
                <div className="glass-surface-strong rounded-2xl p-4 shadow-2xl border-2 border-[var(--border)]">
                  <div className="flex flex-col gap-2">
                    {visibleLinks.map((link, i) =>
                      link.isCta ? (
                        <motion.div
                          key={link.name}
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.04 * i, duration: 0.18 }}
                        >
                          <Link
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block rounded-xl border-2 border-[var(--border)] bg-[var(--accent)] px-5 py-3.5 text-center text-sm font-bold text-white shadow-[var(--shadow-soft)] transition-all duration-200 hover:-translate-y-0.5"
                          >
                            {link.name}
                          </Link>
                        </motion.div>
                      ) : (
                        <motion.div
                          key={link.name}
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.04 * i, duration: 0.18 }}
                        >
                          <Link
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block rounded-xl px-4 py-3.5 text-base font-bold transition-all duration-200 hover:bg-[var(--surface-muted)]" style={{ color: 'var(--foreground, #1e293b)' }}
                          >
                            {link.name}
                          </Link>
                        </motion.div>
                      )
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
