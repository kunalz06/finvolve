export default function Terms() {
    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm">
            <h1 className="text-3xl font-bold text-blue-900 mb-6">Terms and Conditions</h1>
            <div className="prose prose-blue max-w-none text-gray-700 space-y-4">
                <h2 className="text-xl font-semibold text-blue-800">1. Registration</h2>
                <p>
                    By registering for the Minor Degree program, you agree to provide accurate and complete information. Any false information may lead to cancellation of your registration.
                </p>

                <h2 className="text-xl font-semibold text-blue-800">2. Fees and Payment</h2>
                <p>
                    The registration fee is <strong>Rs 5000 (INR)</strong> and is non-refundable. Please ensure you meet the eligibility criteria before proceeding with the payment.
                </p>

                <h2 className="text-xl font-semibold text-blue-800">3. Document Verification</h2>
                <p>
                    All uploaded documents will be verified by the administration. You must produce original documents when requested.
                </p>

                <h2 className="text-xl font-semibold text-blue-800">4. Attendance</h2>
                <p>
                    Regular attendance is mandatory for the completion of the Minor Degree program.
                </p>
            </div>
        </div>
    );
}
