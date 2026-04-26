import IemMinorPortal from "@/components/iemminor/IemMinorPortal";

export default function RootPage() {
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
            <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center justify-center">
                <IemMinorPortal />
            </main>
        </div>
    );
}
