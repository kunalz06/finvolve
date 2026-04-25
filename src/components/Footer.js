"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, ArrowRight, Github, Linkedin, Zap } from "lucide-react";
import { apiUrl } from "@/lib/api";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState({ type: "idle", message: "" });
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  const handleNewsletterSubmit = async (event) => {
    event.preventDefault();
    setNewsletterStatus({ type: "idle", message: "" });
    setNewsletterLoading(true);

    try {
      const response = await fetch(apiUrl("/dev/api/newsletter/subscribe"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Unable to subscribe right now.");

      setNewsletterStatus({
        type: json.emailSent === false ? "warning" : "success",
        message: json.message || "You are subscribed.",
      });
      setNewsletterEmail("");
    } catch (error) {
      setNewsletterStatus({
        type: "error",
        message: error.message || "Unable to subscribe right now.",
      });
    } finally {
      setNewsletterLoading(false);
    }
  };

  return (
    <footer className="w-full px-3 pb-4 pt-8 md:px-6 md:pb-8 md:pt-14">
      <div className="container mx-auto">
        <div className="glass-surface-strong glass-spectrum relative overflow-hidden rounded-[28px] px-5 py-10 md:rounded-[34px] md:px-10 md:py-14">
          <div className="glass-orb glass-orb-amber -right-8 top-8 h-28 w-32" />
          <div className="glass-orb glass-orb-mint left-12 bottom-10 h-24 w-24" />
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <Link href="/dev" className="mb-4 flex items-center justify-center gap-3 md:justify-start">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(124,92,255,0.96),rgba(105,183,255,0.82),rgba(82,215,183,0.74))] shadow-[0_14px_28px_rgba(103,88,255,0.24)]">
                  <Zap className="text-white" size={20} />
                </div>
                <span className="font-code-brand text-xl font-semibold text-slate-900">DEV♾️</span>
              </Link>
              <p className="mb-6 text-center text-sm leading-relaxed text-slate-600 md:text-left">
                Accelerating the digital future through elite engineering and design thinking.
              </p>
              <div className="flex items-center justify-center gap-3 md:justify-start">
                <SocialLink icon={Linkedin} href="#" />
                <SocialLink icon={Github} href="#" />
              </div>
            </div>

            <div className="text-center md:text-left">
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-slate-900">Services</h4>
              <ul className="space-y-3">
                <FooterLink href="/dev/services">Web Development</FooterLink>
                <FooterLink href="/dev/services">Mobile Apps</FooterLink>
                <FooterLink href="/dev/services">AI Solutions</FooterLink>
                <FooterLink href="/dev/services">Custom Software</FooterLink>
              </ul>
            </div>

            <div className="text-center md:text-left">
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-slate-900">Company</h4>
              <ul className="space-y-3">
                <FooterLink href="/dev/about">About Us</FooterLink>
                <FooterLink href="/dev/contact">Careers</FooterLink>
              </ul>
            </div>

            <div className="text-center md:text-left">
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-slate-900">Newsletter</h4>
              <p className="mb-4 text-sm text-slate-600">
                Stay updated with the latest in tech.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={(event) => setNewsletterEmail(event.target.value)}
                    className="w-full rounded-2xl py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={newsletterLoading}
                  className="rounded-full border border-white/35 bg-[linear-gradient(135deg,rgba(124,92,255,0.96),rgba(105,183,255,0.78),rgba(255,180,84,0.8))] py-3 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(103,88,255,0.24)] transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span className="flex items-center justify-center gap-2">
                    {newsletterLoading ? "Subscribing..." : "Subscribe"} <ArrowRight size={16} />
                  </span>
                </button>
                {newsletterStatus.message && (
                  <p className={`rounded-2xl px-3 py-2 text-xs leading-5 ${
                    newsletterStatus.type === "error"
                      ? "border border-red-200 bg-red-50/80 text-red-700"
                      : newsletterStatus.type === "warning"
                        ? "border border-amber-200 bg-amber-50/80 text-amber-700"
                        : "border border-emerald-200 bg-emerald-50/80 text-emerald-700"
                  }`}>
                    {newsletterStatus.message}
                  </p>
                )}
              </form>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/40 pt-6 text-center text-sm text-slate-500 md:flex-row md:text-left">
            <p>&copy; {currentYear} DEV Infinity Software Studio. All rights reserved.</p>
            <div className="flex flex-wrap items-center justify-center gap-4 md:justify-end md:gap-6">
              <Link href="/dev/privacy-policy" className="transition-colors hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="/dev/terms" className="transition-colors hover:text-primary">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }) {
  return (
    <li>
      <Link href={href} className="text-sm text-slate-600 transition-colors hover:text-slate-900">
        {children}
      </Link>
    </li>
  );
}

function SocialLink({ icon: Icon, href }) {
  return (
    <a
      href={href}
      className="glass-surface flex h-11 w-11 items-center justify-center rounded-2xl text-slate-500 transition-all duration-300 hover:-translate-y-0.5 hover:text-primary"
    >
      <Icon size={18} />
    </a>
  );
}
