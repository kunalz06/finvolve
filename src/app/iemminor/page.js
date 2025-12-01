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
        <div className="max-w-2xl mx-auto mt-8">
            <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200">
                <div className="p-8 md:p-10">
                    <h2 className="text-3xl font-bold text-center text-slate-800 mb-8 uppercase tracking-wider">
                        Form
                    </h2>

                    <form onSubmit={handlePaymentAndSubmit} className="space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Name of User</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                                placeholder="Enter your full name"
                            />
                        </div>

                        {/* Enrollment & Registration */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Enrollment Number</label>
                                <input
                                    type="text"
                                    name="enrollmentNo"
                                    value={formData.enrollmentNo}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 outline-none"
                                    placeholder="Enrollment No."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Registration Number</label>
                                <input
                                    type="text"
                                    name="registrationNo"
                                    value={formData.registrationNo}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 outline-none"
                                    placeholder="Registration No."
                                />
                            </div>
                        </div>

                        {/* Semester */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Semester</label>
                            <select
                                name="semester"
                                value={formData.semester}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 outline-none bg-white"
                            >
                                <option value="3rd">3rd Semester</option>
                                <option value="5th">5th Semester</option>
                                <option value="7th">7th Semester</option>
                            </select>
                        </div>

                        {/* File Upload */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Upload Registration Certificate</label>
                            <div className="relative border-2 border-dashed border-slate-300 rounded-lg p-6 hover:bg-slate-50 transition-colors text-center cursor-pointer">
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    required
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="flex flex-col items-center pointer-events-none">
                                    <Upload className="text-slate-400 mb-2" size={24} />
                                    <span className="text-sm text-slate-600">
                                        {file ? file.name : "Click to upload or drag and drop"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {status === 'error' && (
                            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
                                <AlertCircle size={16} />
                                {errorMessage}
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={status === 'processing' || status === 'uploading'}
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-full shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wide"
                            >
                                {status === 'processing' || status === 'uploading' ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} /> Processing...
                                    </>
                                ) : (
                                    "Pay and Register"
                                )}
                            </button>
                            <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                Secure Payment via Razorpay
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
