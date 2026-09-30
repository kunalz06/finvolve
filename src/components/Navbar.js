"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Zap } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import Button from "@/components/ui/Button";

const navLinks = [
  { name: "Home", href: "/dev" },
  { name: "Services", href: "/dev/services" },
  { name: "Cloud", href: "/dev/cloud" },
  { name: "About", href: "/dev/about" },
  { name: "Contact", href: "/dev/contact" },
];

function isLinkActive(pathname, href) {
  if (href === "/dev") return pathname === "/dev" || pathname === "/dev/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 md:pt-4">
        <div className={`container mx-auto transition-all duration-200 ${scrolled ? "max-w-6xl" : ""}`}>
          <div className="glass-surface-strong flex min-h-16 items-center justify-between rounded-2xl px-3 py-2.5 sm:px-4 md:px-5">
            <Link href="/dev" className="group flex min-w-0 items-center gap-3" aria-label="DEV Infinity home">
              <span className="brand-gradient flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-[var(--shadow-color)] transition-transform duration-200 group-hover:-translate-y-0.5">
                <Zap size={20} />
              </span>
              <span className="min-w-0">
                <span className="block truncate font-code-brand text-base font-black text-[var(--heading)] sm:text-lg">
                  DEV Infinity
                </span>
                <span className="hidden text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--muted)] sm:block">
                  Product engineering studio
                </span>
              </span>
            </Link>

            <div className="hidden items-center gap-1 lg:flex">
              <div className="glass-nav-strip flex items-center gap-1 rounded-xl p-1">
                {navLinks.map((link) => {
                  const active = isLinkActive(pathname, link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={`rounded-lg px-3 py-2 text-sm font-bold transition-colors ${active
                        ? "bg-[var(--primary-soft)] text-[var(--primary)] shadow-sm"
                        : "text-[var(--muted)] hover:bg-[var(--surface-strong)] hover:text-[var(--heading)]"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>
              <ThemeToggle />
              <Button href="/dev/request" size="small" className="ml-1">
                Start Project
              </Button>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <ThemeToggle compact />
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setMobileMenuOpen((open) => !open)}
                aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
                aria-expanded={mobileMenuOpen}
                type="button"
              >
                {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <button
        type="button"
        aria-label="Close navigation"
        className={`fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-sm transition-opacity duration-200 lg:hidden ${mobileMenuOpen ? "visible opacity-100" : "invisible opacity-0"}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      <div className={`fixed inset-x-0 top-[76px] z-50 px-3 transition-all duration-200 sm:px-5 lg:hidden ${mobileMenuOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-3 opacity-0"}`}>
        <div className="container mx-auto">
          <div className="glass-surface-strong rounded-2xl p-3">
            <div className="grid gap-1">
              {navLinks.map((link) => {
                const active = isLinkActive(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-xl px-4 py-3 text-sm font-bold ${active
                      ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                      : "text-[var(--foreground)] hover:bg-[var(--surface-muted)]"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <Button href="/dev/request" className="mt-2 w-full">
                Start Project
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
