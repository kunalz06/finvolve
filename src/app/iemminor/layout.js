import Link from 'next/link';
import "../dev/globals.css"; // Reuse globals for Tailwind

export const metadata = {
    title: "IEM Minor Degree Registration",
    description: "Registration portal for IEM Minor Degree",
};

export default function IemMinorLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900">
            <header className="bg-white/95 p-4 shadow-md">
                <div className="container mx-auto flex items-center justify-start gap-4">
                    <img src="/iem-logo.png" alt="IEM Logo" className="h-16 w-auto shrink-0 object-contain md:h-20" />
                    <h1 className="text-lg font-extrabold uppercase tracking-wide text-[#252052] md:text-3xl">
                        INSTITUTE OF ENGINEERING AND MANAGEMENT
                    </h1>
                </div>
            </header>

            {/* Main Content - White Background */}
            <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center justify-center">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white p-4 text-sm border-t border-slate-100">
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-slate-600">
                    <p>
                        Made with Finvolve by Institute of Engineering and Management
                    </p>
                    <Link href="/iemminor/about" className="text-slate-800 hover:underline font-medium mt-2 md:mt-0">
                        About
                    </Link>
                </div>
            </footer>
        </div>
    );
}
