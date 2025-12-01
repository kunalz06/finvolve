"use client";

import { useState } from 'react';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Loader2, Upload, CheckCircle, AlertCircle } from 'lucide-react';

export default function IemRegistrationPage() {
    const [formData, setFormData] = useState({
        name: '',
        enrollmentNo: '',
        registrationNo: '',
        semester: '3rd',
    });
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, uploading, processing, success, error
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handlePaymentAndSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setErrorMessage("Please upload your registration certificate.");
            setStatus('error');
            return;
        }

        setStatus('processing');
        setErrorMessage('');

        const loadRazorpayScript = () => {
            return new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                script.onload = () => resolve(true);
                script.onerror = () => resolve(false);
                document.body.appendChild(script);
            });
        };

        try {
            const res = await loadRazorpayScript();
            if (!res) throw new Error('Razorpay SDK failed to load.');

            // 1. Create Order
            const orderRes = await fetch('/iemminor/api/create-order', { method: 'POST' });
            const orderData = await orderRes.json();
            if (orderData.error) throw new Error(orderData.error);

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "IEM Minor Degree",
                description: "IEM MINOR DEGREE PAYMENT with FINVOLVE",
                order_id: orderData.id,
                handler: async function (response) {
                    // Payment Success - Now Upload File and Save Data
                    try {
                        setStatus('uploading');

                        // Upload File
                        const storageRef = ref(storage, `certificates/${Date.now()}_${file.name}`);
                        const uploadResult = await uploadBytes(storageRef, file);
                        const downloadURL = await getDownloadURL(uploadResult.ref);

                        // Save to Firestore
                        await addDoc(collection(db, "iem_registrations"), {
                            ...formData,
                            certificateUrl: downloadURL,
                            paymentId: response.razorpay_payment_id,
                            orderId: response.razorpay_order_id,
                            signature: response.razorpay_signature,
                            createdAt: serverTimestamp(),
                            amount: 5000,
                            currency: "INR"
                        });

                        setStatus('success');
                        setFormData({ name: '', enrollmentNo: '', registrationNo: '', semester: '3rd' });
                        setFile(null);
                    } catch (err) {
                        console.error("Error saving data:", err);
                        setStatus('error');
                        setErrorMessage("Payment successful but failed to save registration. Contact support.");
                    }
                },
                prefill: {
                    name: formData.name,
                    contact: "", // Optional: Add phone field if needed
                },
                theme: {
                    color: "#0ea5e9", // Sky Blue
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

            paymentObject.on('payment.failed', function (response) {
                setStatus('error');
                setErrorMessage(response.error.description);
            });

        } catch (error) {
            console.error("Error:", error);
            setStatus('error');
            setErrorMessage(error.message || "Something went wrong.");
        }
    };

    if (status === 'success') {
        return (
            <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-2xl shadow-xl text-center border border-slate-100">
                <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Registration Successful!</h2>
                <p className="text-slate-600">
                    Your payment of ₹5000 has been received and your registration is complete.
                </p>
                <button
                    onClick={() => setStatus('idle')}
                    className="mt-6 px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                >
                    Register Another Student
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl text-center text-slate-800 mb-8 font-normal">
                Minor Degree Registration
            </h2>

            <div className="bg-white rounded-[2rem] border-2 border-sky-400 p-8 md:p-12 shadow-sm">
                <form onSubmit={handlePaymentAndSubmit} className="space-y-6">
                    {/* Name */}
                    <div>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-6 py-3 rounded-full border border-black text-center text-lg placeholder:text-slate-600 focus:ring-2 focus:ring-sky-400 outline-none transition-all"
                            placeholder="Name of student"
                        />
                    </div>

                    {/* Enrollment */}
                    <div>
                        <input
                            type="text"
                            name="enrollmentNo"
                            value={formData.enrollmentNo}
                            onChange={handleChange}
                            required
                            className="w-full px-6 py-3 rounded-full border border-black text-center text-lg placeholder:text-slate-600 focus:ring-2 focus:ring-sky-400 outline-none transition-all"
                            placeholder="Enrollment number"
                        />
                    </div>

                    {/* Registration */}
                    <div>
                        <input
                            type="text"
                            name="registrationNo"
                            value={formData.registrationNo}
                            onChange={handleChange}
                            required
                            className="w-full px-6 py-3 rounded-full border border-black text-center text-lg placeholder:text-slate-600 focus:ring-2 focus:ring-sky-400 outline-none transition-all"
                            placeholder="Registration Number"
                        />
                    </div>

                    {/* Semester */}
                    <div className="relative">
                        <select
                            name="semester"
                            value={formData.semester}
                            onChange={handleChange}
                            className="w-full px-6 py-3 rounded-full border border-black text-center text-lg appearance-none bg-white focus:ring-2 focus:ring-sky-400 outline-none cursor-pointer"
                        >
                            <option value="3rd">Current Semester: 3rd</option>
                            <option value="5th">Current Semester: 5th</option>
                            <option value="7th">Current Semester: 7th</option>
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 9l6 6 6-6" />
                            </svg>
                        </div>
                    </div>

                    {/* File Upload */}
                    <div className="relative">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept=".pdf,.jpg,.jpeg,.png"
                            required
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="w-full px-6 py-3 rounded-full border border-black flex items-center justify-between text-lg text-slate-600">
                            <span className="truncate">
                                {file ? file.name : "Upload your registration certificate"}
                            </span>
                            <Upload size={24} className="text-black shrink-0 ml-2" />
                        </div>
                    </div>

                    {/* Error Message */}
                    {status === 'error' && (
                        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm justify-center">
                            <AlertCircle size={16} />
                            {errorMessage}
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-4 flex justify-center">
                        <button
                            type="submit"
                            disabled={status === 'processing' || status === 'uploading'}
                            className="px-8 py-2 bg-white border-2 border-red-500 text-black text-xl rounded-lg hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {status === 'processing' || status === 'uploading' ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} /> Processing...
                                </>
                            ) : (
                                "Proceed to Pay"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
