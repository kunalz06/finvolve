import Link from 'next/link';
import { Mail, ArrowRight, Github, Linkedin, Zap } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/finvolve" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Zap className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold text-gray-900">Finvolve</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Accelerating the digital future through elite engineering and design thinking.
            </p>
            <div className="flex items-center gap-3">
              <SocialLink icon={Linkedin} href="#" />
              <SocialLink icon={Github} href="#" />
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Services</h4>
            <ul className="space-y-3">
              <FooterLink href="/finvolve/services">Web Development</FooterLink>
              <FooterLink href="/finvolve/services">Mobile Apps</FooterLink>
              <FooterLink href="/finvolve/services">AI Solutions</FooterLink>
              <FooterLink href="/finvolve/services">Custom Software</FooterLink>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-3">
              <FooterLink href="/finvolve/about">About Us</FooterLink>
              <FooterLink href="/finvolve/contact">Careers</FooterLink>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Newsletter</h4>
            <p className="text-gray-500 text-sm mb-4">
              Stay updated with the latest in tech.
            </p>
            <form className="flex flex-col gap-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-white border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
              <button className="bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 text-sm">
                Subscribe <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-white">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {currentYear} Finvolve Engineering Agency. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/finvolve/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/finvolve/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }) {
  return (
    <li>
      <Link href={href} className="text-gray-500 hover:text-primary transition-colors text-sm">
        {children}
      </Link>
    </li>
  );
}

function SocialLink({ icon: Icon, href }) {
  return (
    <a 
      href={href} 
      className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary hover:border-primary transition-all duration-300"
    >
      <Icon size={18} />
    </a>
  );
}
