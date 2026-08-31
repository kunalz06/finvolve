import "./globals.css";
import "@/components/chat/chat.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/chat/ChatWidget";

export const metadata = {
  title: "DEV Infinity | Next Gen Engineering",
  description: "A modern engineering agency helping you ship high-quality products at lightning speed.",
};

export default function DevLayout({ children }) {
  return (
    <div className="dev-shell min-h-screen font-sans text-gray-900 antialiased">
      <Navbar />
      <main className="min-h-screen pt-[72px] sm:pt-[84px] md:pt-[92px] lg:pt-[104px]">
        {children}
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
