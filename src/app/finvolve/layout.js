import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google"; // Import fonts
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-heading" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata = {
  title: "Finvolve | High-Performance Digital Solutions",
  description: "Web Development, App Development, and SEO services built for speed.",
};

export default function FinvolveLayout({ children }) {
  return (
    <div className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased text-white bg-background min-h-screen relative`}>
      <LoadingScreen />
      <div className="speed-bg fixed inset-0 z-0 pointer-events-none" /> {/* Speed Lines Background */}
      <Navbar />
      <main className="min-h-screen pt-[90px] relative z-10"> {/* Adjusted for taller nav */}
        {children}
      </main>
      <Footer />
    </div>
  );
}
