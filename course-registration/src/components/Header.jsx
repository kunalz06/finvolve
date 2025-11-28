import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
    return (
        <header className="bg-blue-900 text-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 bg-white rounded-full overflow-hidden flex-shrink-0">
                        <Image
                            src="/iemminorcourse/cropped-logo-2.webp"
                            alt="IEM Logo"
                            fill
                            className="object-contain p-1"
                        />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold leading-tight">
                            Institute of Engineering and Management
                        </h1>
                        <p className="text-sm text-blue-200">Good Education Good Jobs</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
