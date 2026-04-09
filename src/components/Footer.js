import Link from "next/link";
import { Mail, ArrowRight, Github, Linkedin, Zap } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full px-3 pb-4 pt-8 md:px-6 md:pb-8 md:pt-14">
      <div className="container mx-auto">
        <div className="glass-surface-strong glass-spectrum relative overflow-hidden rounded-[34px] px-6 py-12 md:px-10 md:py-14">
          <div className="glass-orb glass-orb-amber -right-8 top-8 h-28 w-32" />
          <div className="glass-orb glass-orb-mint left-12 bottom-10 h-24 w-24" />
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <Link href="/finvolve" className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(124,92,255,0.96),rgba(105,183,255,0.82),rgba(82,215,183,0.74))] shadow-[0_14px_28px_rgba(103,88,255,0.24)]">
                  <Zap className="text-white" size={20} />
                </div>
                <span className="text-xl font-semibold text-slate-900">Finvolve</span>
              </Link>
              <p className="mb-6 text-sm leading-relaxed text-slate-600">
                Accelerating the digital future through elite engineering and design thinking.
              </p>
              <div className="flex items-center gap-3">
                <SocialLink icon={Linkedin} href="#" />
                <SocialLink icon={Github} href="#" />
              </div>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-slate-900">Services</h4>
              <ul className="space-y-3">
                <FooterLink href="/finvolve/services">Web Development</FooterLink>
                <FooterLink href="/finvolve/services">Mobile Apps</FooterLink>
                <FooterLink href="/finvolve/services">AI Solutions</FooterLink>
                <FooterLink href="/finvolve/services">Custom Software</FooterLink>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-slate-900">Company</h4>
              <ul className="space-y-3">
                <FooterLink href="/finvolve/about">About Us</FooterLink>
                <FooterLink href="/finvolve/contact">Careers</FooterLink>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-slate-900">Newsletter</h4>
              <p className="mb-4 text-sm text-slate-600">
                Stay updated with the latest in tech.
              </p>
              <form className="flex flex-col gap-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full rounded-2xl py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400"
                  />
                </div>
                <button className="rounded-full border border-white/35 bg-[linear-gradient(135deg,rgba(124,92,255,0.96),rgba(105,183,255,0.78),rgba(255,180,84,0.8))] py-3 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(103,88,255,0.24)] transition-all duration-300 hover:-translate-y-0.5">
                  <span className="flex items-center justify-center gap-2">
                    Subscribe <ArrowRight size={16} />
                  </span>
                </button>
              </form>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/40 pt-6 text-sm text-slate-500 md:flex-row">
            <p>&copy; {currentYear} Finvolve Engineering Agency. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/finvolve/privacy-policy" className="transition-colors hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="/finvolve/terms" className="transition-colors hover:text-primary">
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
