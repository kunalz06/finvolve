export default function RootPage() {
    return (
        <main className="min-h-screen bg-white px-4 py-8 text-slate-900 md:px-8">
            <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl flex-col items-center justify-center text-center">
                <img
                    src="/iem-logo.png"
                    alt="IEM Logo"
                    className="mb-8 h-28 w-auto object-contain md:h-36"
                />
                <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.24em] text-[#252052]">
                    Institute of Engineering and Management
                </p>
                <div className="w-full rounded-[28px] border border-slate-200 bg-white px-6 py-10 shadow-[0_24px_70px_rgba(15,23,42,0.10)] md:px-10">
                    <h1 className="text-4xl font-extrabold tracking-tight text-[#252052] md:text-5xl">
                        Registration Closed
                    </h1>
                    <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600 md:text-lg">
                        Minor course registration is no longer accepting submissions.
                    </p>
                </div>
            </section>
        </main>
    );
}
