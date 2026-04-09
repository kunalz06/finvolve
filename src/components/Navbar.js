"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Zap } from "lucide-react";

const navLinks = [
  { name: "Services", href: "/finvolve/services" },
  { name: "About", href: "/finvolve/about" },
  { name: "Start Project", href: "/finvolve/request" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 z-50 w-full px-3 pt-3 md:px-6 md:pt-5">
      <div className={`container mx-auto transition-all duration-300 ${scrolled ? "max-w-6xl" : "max-w-[1340px]"}`}>
        <div className="relative">
          <div className="glass-orb glass-orb-violet right-12 top-2 h-16 w-28" />
          <div className="glass-orb glass-orb-cyan left-24 top-1 h-14 w-24" />
          <div className={`glass-surface-strong glass-spectrum flex items-center justify-between rounded-[24px] px-3 py-3 md:rounded-[30px] md:px-6 ${scrolled ? "shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_28px_72px_rgba(27,38,68,0.22)]" : ""}`}>
          <Link href="/finvolve" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(124,92,255,0.96),rgba(105,183,255,0.82),rgba(82,215,183,0.72))] shadow-[0_14px_30px_rgba(103,88,255,0.28)] transition-transform duration-300 group-hover:scale-105">
              <Zap className="text-white" size={20} />
            </div>
            <div className="min-w-0">
              <div className="text-lg font-semibold tracking-tight text-slate-900 md:text-xl">Finvolve</div>
              <div className="hidden text-[11px] uppercase tracking-[0.25em] text-slate-500 md:block">
                Software Builders
              </div>
            </div>
          </Link>

          <div className="glass-nav-strip hidden items-center gap-3 rounded-full px-3 py-2 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-all duration-300 hover:bg-white/72 hover:text-slate-900"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/finvolve/contact"
              className="rounded-full border border-white/35 bg-[linear-gradient(135deg,rgba(124,92,255,0.96),rgba(105,183,255,0.78),rgba(255,180,84,0.8))] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(103,88,255,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(103,88,255,0.34)]"
            >
              Contact Us
            </Link>
          </div>

          <button
            className="glass-surface flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-slate-900 transition-colors hover:text-primary md:hidden"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="container mx-auto mt-3 md:hidden">
          <div className="glass-surface-strong rounded-[26px] p-4">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-2xl px-4 py-3 text-base font-medium text-slate-700 transition-all duration-300 hover:bg-white/72 hover:text-slate-900"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/finvolve/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 rounded-full border border-white/35 bg-[linear-gradient(135deg,rgba(124,92,255,0.96),rgba(124,92,255,0.8))] px-5 py-3 text-center text-sm font-semibold text-white"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
