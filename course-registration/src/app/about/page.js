export default function About() {
    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm">
            <h1 className="text-3xl font-bold text-blue-900 mb-6">About Us</h1>
            <div className="prose prose-blue max-w-none text-gray-700 space-y-4">
                <p>
                    The IEM group is an acclaimed educational group amongst the industry-centred academic training organisations of today. IEM has set sublime standards in addressing the technical and managerial resource shortage in the new era of dynamic globalisation.
                </p>
                <p>
                    The IEM group has risen to fame for its strong foundation in teaching and R&D in multifaceted areas. It aims to serve the future generation as well as the Nation through its commitment towards self sufficiency and unmatchable excellence.
                </p>
                <p>
                    IEM is one of the top-ranked engineering colleges in Kolkata and Eastern India which provides the best engineering course with 100% job assistance. Contact today to know the course details of computer science engineering, mechanical engineering, electrical and electronics engineering, electronics and communication engineering.
                </p>

                <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-100">
                    <h2 className="text-xl font-semibold text-blue-900 mb-2">Contact Information</h2>
                    <p className="text-blue-800 font-medium">
                        <span className="block sm:inline">📞 8010700500</span>
                        <span className="hidden sm:inline mx-2">/</span>
                        <span className="block sm:inline">8069795500</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
