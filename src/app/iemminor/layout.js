import Link from 'next/link';
import "../dev/globals.css"; // Reuse globals for Tailwind

export const metadata = {
    title: "IEM Minor Degree Registration",
    description: "Registration portal for IEM Minor Degree",
};

export default function IemMinorLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900">
            {/* Header - Sky Blue */}
            <header className="bg-sky-300 p-4 shadow-md">
                <div className="container mx-auto flex items-center gap-4">
                    {/* Logo */}
                    <div className="bg-white rounded-full p-1 h-16 w-16 flex items-center justify-center overflow-hidden shrink-0">
                        <img src="/iem-logo.png" alt="IEM Logo" className="h-full w-full object-contain" />
                    </div>
                    <h1 className="text-red-600 text-xl md:text-3xl font-bold tracking-wide uppercase">
                        Institute of Engineering and Management
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
