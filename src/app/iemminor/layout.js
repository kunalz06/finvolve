import Link from 'next/link';
import "../finvolve/globals.css"; // Reuse globals for Tailwind

export const metadata = {
    title: "IEM Minor Degree Registration",
    description: "Registration portal for IEM Minor Degree",
};

export default function IemMinorLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
            {/* Header - Sky Blue */}
            <header className="bg-sky-500 p-4 shadow-md">
                <div className="container mx-auto flex items-center gap-4">
                    {/* Logo */}
                    <div className="bg-white rounded-full p-1 h-12 w-12 flex items-center justify-center overflow-hidden">
                        <img src="/iem-logo.png" alt="IEM Logo" className="h-full w-full object-contain" />
                    </div>
                    <h1 className="text-white text-xl md:text-2xl font-semibold tracking-wide">
                        Institute of Engineering and Management
                    </h1>
                </div>
            </header>

            {/* Main Content - White Background */}
            <main className="flex-grow container mx-auto p-4 md:p-8">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-slate-100 border-t border-slate-200 p-6 text-center">
                <p className="text-slate-600 mb-2">
                    Made with <span className="font-bold text-sky-600">FINVOLVE</span> by <span className="font-bold">INSTITUTE OF ENGINEERING AND MANAGEMENT</span>
                </p>
                <Link href="/iemminor/about" className="text-sky-500 hover:underline text-sm">
                    About Us
                </Link>
            </footer>
        </div>
    );
}
