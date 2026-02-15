import Link from 'next/link';
import { Mail, ArrowRight, Github, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="w-full border-t border-glass-border bg-black/40 backdrop-blur-xl mt-auto relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 py-20 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 lg:gap-12">

                    {/* Brand Column (4 cols) */}
                    <div className="md:col-span-12 lg:col-span-4 flex flex-col gap-6">
                        <Link href="/finvolve" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">F</div>
                            <span className="text-2xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                Finvolve
                            </span>
                        </Link>
                        <p className="text-gray-300 leading-relaxed max-w-sm">
                            Empowering businesses with scalable, secure, and stunning digital solutions.
                            Building the future, one line of code at a time.
                        </p>
                        <div className="flex items-center gap-4">
                            <SocialLink icon={Github} href="#" />
                            <SocialLink icon={Twitter} href="#" />
                            <SocialLink icon={Linkedin} href="#" />
                            <SocialLink icon={Instagram} href="#" />
                        </div>
                    </div>

                    {/* Links Column 1 (2 cols) */}
                    <div className="md:col-span-4 lg:col-span-2">
                        <h4 className="text-lg font-bold text-white mb-6">Company</h4>
                        <ul className="space-y-4">
                            <FooterLink href="/finvolve/about">About</FooterLink>
                            <FooterLink href="/finvolve/contact">Contact</FooterLink>
                            <FooterLink href="/finvolve/careers">Careers</FooterLink>
                            <FooterLink href="/finvolve/blog">Blog</FooterLink>
                        </ul>
                    </div>

                    {/* Links Column 2 (2 cols) */}
                    <div className="md:col-span-4 lg:col-span-2">
                        <h4 className="text-lg font-bold text-white mb-6">Services</h4>
                        <ul className="space-y-4">
                            <FooterLink href="/finvolve/request">Web Development</FooterLink>
                            <FooterLink href="/finvolve/request">Mobile Apps</FooterLink>
                            <FooterLink href="/finvolve/request">SaaS Solutions</FooterLink>
                            <FooterLink href="/finvolve/request">Consulting</FooterLink>
                        </ul>
                    </div>

                    {/* Newsletter Column (4 cols) */}
                    <div className="md:col-span-4 lg:col-span-4">
                        <h4 className="text-lg font-bold text-white mb-6">Stay Updated</h4>
                        <p className="text-gray-300 text-sm mb-4">
                            Subscribe to my newsletter for the latest tech trends and updates.
                        </p>
                        <form className="flex flex-col gap-3">
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:bg-white/10 transition-all focus:ring-1 focus:ring-primary/50"
                                />
                            </div>
                            <button className="bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40">
                                Subscribe <ArrowRight size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/5 bg-black/20 backdrop-blur-md">
                <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Finvolve. All rights reserved.</p>
                    <div className="flex items-center gap-8">
                        <Link href="/finvolve/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/finvolve/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, children }) {
    return (
        <li>
            <Link href={href} className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors" />
                <span className="group-hover:translate-x-1 transition-transform">{children}</span>
            </Link>
        </li>
    );
}

function SocialLink({ icon: Icon, href }) {
    return (
        <a href={href} className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-300 hover:text-white hover:bg-primary hover:scale-110 transition-all duration-300">
            <Icon size={20} />
        </a>
    );
}
