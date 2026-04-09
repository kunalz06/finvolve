import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Finvolve | Next Gen Engineering",
  description: "A modern engineering agency helping you ship high-quality products at lightning speed.",
};

export default function FinvolveLayout({ children }) {
  return (
    <div className="finvolve-shell font-sans antialiased text-gray-900 min-h-screen">
      <Navbar />
      <main className="min-h-screen pt-[92px] md:pt-[104px]">
        {children}
      </main>
      <Footer />
    </div>
  );
}
