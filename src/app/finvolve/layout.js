import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Finvolve - Full Stack Development Services",
  description: "Premium software solutions including Android apps, web platforms, and custom SaaS tools built by an expert Full Stack Developer.",
};

export default function FinvolveLayout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - var(--nav-height) - 200px)' }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
