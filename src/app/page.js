import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DevHome from "./dev/page";

const isNetlifyBuild =
    process.env.NETLIFY === "true" || process.env.NETLIFY_STATIC_EXPORT === "true";

export default function RootPage() {
    if (!isNetlifyBuild) {
        redirect("/dev");
    }

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
