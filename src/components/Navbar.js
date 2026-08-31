"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";

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

  return (
    <nav className="fixed left-0 top-0 z-50 w-full px-3 pt-3 md:px-6 md:pt-5">
      <div className={"container mx-auto transition-all duration-200 " + (scrolled ? "max-w-6xl" : "max-w-[1340px]")}>
        <div className={"glass-surface-strong flex items-center justify-between rounded-2xl px-3 py-3 transition-transform duration-200 md:px-6 " + (scrolled ? "-translate-y-1" : "")}>
          <Link href="/dev" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[var(--border)] bg-[var(--primary)] shadow-[var(--shadow-soft)] transition-transform duration-200 group-hover:-translate-y-0.5">
              <Zap className="text-white" size={20} />
            </div>
            <div className="min-w-0">
              <div className="font-code-brand text-lg font-black text-slate-900 md:text-xl">DEV Infinity</div>
              <div className="hidden font-code-brand text-[11px] uppercase text-slate-500 md:block">
                Software Builders
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="glass-nav-strip hidden items-center gap-3 rounded-xl px-3 py-2 md:flex">
            {visibleLinks.map((link) =>
              link.isCta ? (
                <Link
                  key={link.name}
                  href={link.href}
                  className="rounded-lg border-2 border-[var(--border)] bg-[var(--accent)] px-5 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-soft)] transition-all duration-200 hover:-translate-y-0.5"
                >
                  {link.name}
                </Link>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className="rounded-lg px-4 py-2 text-sm font-bold text-slate-600 transition-all duration-200 hover:bg-[var(--surface-strong)] hover:text-slate-900"
                >
                  {link.name}
                </Link>
              )
            )}
            <ThemeToggle />
          </div>

          {/* Mobile toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle compact />
            <button
              className="glass-surface flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-900 transition-colors hover:text-primary"
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
                    className="flex items-center justify-center"
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
                    className="flex items-center justify-center"
                  >
                    <Menu size={24} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="container mx-auto mt-3 md:hidden"
          >
            <div className="glass-surface-strong rounded-2xl p-4">
              <div className="flex flex-col gap-3">
                {visibleLinks.map((link, i) =>
                  link.isCta ? (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 * i, duration: 0.15 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="mt-2 block rounded-xl border-2 border-[var(--border)] bg-[var(--accent)] px-5 py-3 text-center text-sm font-bold text-white shadow-[var(--shadow-soft)]"
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 * i, duration: 0.15 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block rounded-xl px-4 py-3 text-base font-bold text-slate-700 transition-all duration-200 hover:bg-[var(--surface-muted)] hover:text-slate-900"
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  )
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
