import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Inter, JetBrains_Mono } from "next/font/google";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-sans",
  display: "swap"
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"], 
  variable: "--font-mono" 
});

export const metadata = {
  title: "Finvolve | Next Gen Engineering",
  description: "A modern engineering agency helping you ship high-quality products at lightning speed.",
};

export default function FinvolveLayout({ children }) {
  return (
    <div className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-white text-gray-900 min-h-screen`}>
      <Navbar />
      <main className="min-h-screen pt-[72px]">
        {children}
      </main>
      <Footer />
    </div>
  );
}
