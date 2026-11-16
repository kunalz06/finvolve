import "./globals.css";
import "@/components/chat/chat.css";
import "./liquid-glass.css";
import LiquidMotion from "@/components/ui/LiquidMotion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/chat/ChatWidget";

export const metadata = {
  title: "DEV Infinity | Next Gen Engineering",
  description: "A modern engineering agency helping you ship high-quality products at lightning speed.",
};

export default function DevLayout({ children }) {
  return (
    <div className="dev-shell min-h-screen font-sans text-[var(--foreground)] antialiased">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="min-h-screen pt-[72px] sm:pt-[84px] md:pt-[92px] lg:pt-[104px]">
        {children}
      </main>
      <LiquidMotion />
      <Footer />
      <ChatWidget />
    </div>
  );
}
