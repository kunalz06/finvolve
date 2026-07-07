import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DevHome from "@/components/DevHome";

export default function RootPage() {
    return (
        <div className="dev-shell min-h-screen font-sans text-gray-900 antialiased">
            <Navbar />
            <main className="min-h-screen pt-[92px] md:pt-[104px]">
                <DevHome />
            </main>
            <Footer />
        </div>
    );
}
