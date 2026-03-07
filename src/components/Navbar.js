"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
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
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white/95 backdrop-blur-md shadow-sm py-3" 
          : "bg-white py-4"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/finvolve" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Zap className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold text-gray-900">
            Finvolve
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/finvolve/contact"
            className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-hover transition-colors shadow-button"
          >
            Contact Us
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-900 hover:text-primary transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-t border-gray-100 p-6 md:hidden shadow-lg">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-gray-600 hover:text-primary transition-colors py-2"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/finvolve/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 px-5 py-3 bg-primary text-white text-sm font-semibold rounded-lg text-center"
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
