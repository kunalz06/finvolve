'use client';

import { useState } from 'react';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function RegistrationForm() {
    const [formData, setFormData] = useState({
        name: '',
        registrationNumber: '',
        enrollmentNumber: '',
        semester: '3rd',
        course: 'CyberSecurity',
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            if (!file) {
                throw new Error('Please upload your registration certificate.');
            }

            const res = await loadRazorpay();
            if (!res) {
                throw new Error('Razorpay SDK failed to load. Are you online?');
            }

            // 1. Create Order - Calls the Sub-App's API
            const orderResponse = await fetch('/iemminorcourse/api/create-order', {
                method: 'POST',
            });

            if (!orderResponse.ok) {
                throw new Error('Failed to create payment order');
            }

            const orderData = await orderResponse.json();

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "IEM Minor Degree",
                description: "Course Registration Fee",
                order_id: orderData.id,
                handler: async function (response) {
                    try {
                        // Payment Success - Proceed with Registration
                        setStatus({ type: 'info', message: 'Payment successful! Finalizing registration...' });

                        // 2. Upload File
                        const storageRef = ref(storage, `certificates/${Date.now()}_${file.name}`);
                        const snapshot = await uploadBytes(storageRef, file);
                        const downloadURL = await getDownloadURL(snapshot.ref);

                        // 3. Save Data to Firestore
                        await addDoc(collection(db, 'registrations'), {
                            ...formData,
                            certificateUrl: downloadURL,
                            paymentId: response.razorpay_payment_id,
                            orderId: response.razorpay_order_id,
                            signature: response.razorpay_signature,
                            createdAt: new Date(),
                            status: 'paid'
                        });

                        setStatus({ type: 'success', message: 'Registration successful!' });
                        setFormData({ name: '', registrationNumber: '', enrollmentNumber: '', semester: '3rd', course: 'CyberSecurity' });
                        setFile(null);
                    } catch (err) {
                        console.error("Error saving registration:", err);
                        setStatus({ type: 'error', message: 'Payment successful but registration failed. Please contact support.' });
                    } finally {
                        setLoading(false);
                    }
                },
                prefill: {
                    name: formData.name,
                    contact: "", // Add if you have phone field
                    email: "" // Add if you have email field
                },
                theme: {
                    color: "#2563eb"
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                        setStatus({ type: 'error', message: 'Payment cancelled.' });
                    }
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error("Error submitting form: ", error);
            setStatus({ type: 'error', message: error.message || 'Something went wrong. Please try again.' });
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-blue-600 px-8 py-6">
                <h2 className="text-2xl font-bold text-white text-center">
                    Minor Degree Registration
                </h2>
                <p className="text-blue-100 text-center mt-2">
                    CyberSecurity, Pega, AI-ML and DataScience
                </p>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
                {status.message && (
                    <div className={`p-4 rounded-lg ${status.type === 'error' ? 'bg-red-50 text-red-700' : status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                        {status.message}
                    </div>
                )}

                <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="Enter your full name"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">Registration Number</label>
                        <input
                            type="text"
                            id="registrationNumber"
                            name="registrationNumber"
                            required
                            value={formData.registrationNumber}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="e.g. 123456789"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="enrollmentNumber" className="block text-sm font-medium text-gray-700">Enrollment Number</label>
                        <input
                            type="text"
                            id="enrollmentNumber"
                            name="enrollmentNumber"
                            required
                            value={formData.enrollmentNumber}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="e.g. EN123456"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="semester" className="block text-sm font-medium text-gray-700">Current Semester</label>
                    <select
                        id="semester"
                        name="semester"
                        value={formData.semester}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                    >
                        <option value="3rd">3rd Semester</option>
                        <option value="5th">5th Semester</option>
                        <option value="7th">7th Semester</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="course" className="block text-sm font-medium text-gray-700">Choose your course</label>
                    <select
                        id="course"
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                    >
                        <option value="CyberSecurity">CyberSecurity</option>
                        <option value="Pega">Pega</option>
                        <option value="AI-ML">AI-ML</option>
                        <option value="DataScience">DataScience</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="certificate" className="block text-sm font-medium text-gray-700">Registration Certificate</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors">
                        <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                    <span>Upload a file</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                                {file ? file.name : "PDF, PNG, JPG up to 10MB"}
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
                >
                    {loading ? (
                        <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </span>
                    ) : (
                        "Pay ₹1 and Register"
                    )}
                </button>
            </form>
        </div>
    );
}
