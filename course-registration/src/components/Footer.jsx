import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-gray-100 border-t border-gray-200 mt-auto">
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-600 text-sm mb-4 md:mb-0">
                        © {new Date().getFullYear()} Institute of Engineering and Management. All rights reserved.
                    </p>
                    <div className="flex space-x-6">
                        <Link href="/about" className="text-gray-600 hover:text-blue-900 text-sm transition-colors">
                            About Us
                        </Link>
                        <Link href="/terms" className="text-gray-600 hover:text-blue-900 text-sm transition-colors">
                            Terms & Conditions
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
