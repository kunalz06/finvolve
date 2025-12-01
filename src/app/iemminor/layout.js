import Link from 'next/link';
import { ArrowDownCircle } from 'lucide-react';
import "../finvolve/globals.css"; // Reuse globals for Tailwind

export const metadata = {
    title: "IEM Minor Degree Registration",
    description: "Registration portal for IEM Minor Degree",
};

{/* Main Content - White Background */ }
<main className="flex-grow container mx-auto p-4 md:p-8">
    {children}
</main>

{/* Footer */ }
<footer className="bg-slate-100 border-t border-slate-200 p-6 text-center">
    <p className="text-slate-600 mb-2">
        Made with <span className="font-bold text-sky-600">FINVOLVE</span> by <span className="font-bold">INSTITUTE OF ENGINEERING AND MANAGEMENT</span>
    </p>
    <Link href="/iemminor/about" className="text-sky-500 hover:underline text-sm">
        About Us
    </Link>
</footer>
        </div >
    );
}
