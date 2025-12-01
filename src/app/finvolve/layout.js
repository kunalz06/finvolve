import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Finvolve - Software Development & Web Services",
  description: "Premium software development services including Android apps, webapps, and more.",
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
