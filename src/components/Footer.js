"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import { apiUrl } from "@/lib/api";
import Button from "@/components/ui/Button";
import BrandMark from "@/components/BrandMark";

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
    <footer className="w-full px-4 sm:px-6 pb-4 pt-8 md:pb-8 md:pt-14">
      <div className="container mx-auto">
        <div className="glass-surface-strong relative overflow-hidden rounded-2xl px-4 py-8 sm:px-5 sm:py-10 md:px-10 md:py-14">
          <div className="grid grid-cols-1 gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <Link href="/" className="mb-4 flex items-center justify-center gap-3 md:justify-start">
                <BrandMark withWordmark />
              </Link>
              <p className="mb-6 text-center text-sm leading-relaxed text-[var(--muted)] md:text-left">
                Product engineering, dashboards, automation, and sharp delivery for ambitious teams.
              </p>
              <div className="flex items-center justify-center gap-3 md:justify-start">
                <SocialLink icon={Linkedin} href="#" />
                <SocialLink icon={Github} href="#" />
              </div>
            </div>

            <div className="text-center md:text-left">
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-strong)]">Services</h4>
              <ul className="space-y-3">
                <FooterLink href="/dev/services">Web Development</FooterLink>
                <FooterLink href="/dev/services">Mobile Apps</FooterLink>
                <FooterLink href="/dev/services">AI Solutions</FooterLink>
                <FooterLink href="/dev/cloud">Cloud & AI APIs</FooterLink>
                <FooterLink href="/dev/services">Custom Software</FooterLink>
              </ul>
            </div>

            <div className="text-center md:text-left">
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-strong)]">Company</h4>
              <ul className="space-y-3">
                <FooterLink href="/dev/about">About Us</FooterLink>
                <FooterLink href="/dev/contact">Contact</FooterLink>
              </ul>
            </div>

            <div className="text-center md:text-left">
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-strong)]">Newsletter</h4>
              <p className="mb-4 text-sm text-[var(--muted)]">Short, useful notes from the build floor.</p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={18} />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={(event) => setNewsletterEmail(event.target.value)}
                    className="w-full rounded-xl py-2.5 sm:py-3 pl-10 pr-4 text-sm text-[var(--heading)] placeholder-slate-400"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={newsletterLoading}
                  variant="primary"
                  size="large"
                  className="touch-target py-2.5 sm:py-3 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span className="flex items-center justify-center gap-2">
                    {newsletterLoading ? "Subscribing..." : "Subscribe"} <ArrowRight size={16} />
                  </span>
                </Button>
                {newsletterStatus.message && (
                  <p className={`rounded-xl px-3 py-2 text-xs leading-5 ${
                    newsletterStatus.type === "error"
                      ? "border border-[var(--red-primary)] bg-[var(--red-soft)] text-[var(--red-dark)]"
                      : newsletterStatus.type === "warning"
                        ? "border border-[var(--accent-amber)] bg-[var(--accent-amber)]/20 text-[var(--accent-amber)]"
                        : "border border-[var(--accent-mint)] bg-[var(--accent-mint)]/20 text-[var(--accent-mint)]"
                  }`}>
                    {newsletterStatus.message}
                  </p>
                )}
              </form>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--border-soft)] pt-6 text-center text-sm text-[var(--muted)] md:flex-row md:text-left">
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
      <Link href={href} className="text-sm font-semibold text-[var(--muted)] transition-colors hover:text-[var(--heading)]">
        {children}
      </Link>
    </li>
  );
}

function SocialLink({ icon: Icon, href }) {
  return (
    <a
      href={href}
      className="glass-surface flex h-11 w-11 items-center justify-center rounded-xl text-[var(--muted)] transition-all duration-200 hover:-translate-y-0.5 hover:text-primary"
    >
      <Icon size={18} />
    </a>
  );
}
