"use client";

import { useState } from 'react';
import Link from 'next/link';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Zap, CreditCard, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import styles from './page.module.css';

export default function QuickStartPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        projectType: 'Web Development',
        description: ''
    });
    const [status, setStatus] = useState('idle'); // idle, processing, success, error
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePaymentAndSubmit = async (e) => {
        e.preventDefault();
        setStatus('processing');
        setErrorMessage('');

        try {
            // Simulate Payment Processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            if (!db) {
                throw new Error("Firebase is not initialized.");
            }

            // Add to Firestore with 'paid' status
            await addDoc(collection(db, "requests"), {
                ...formData,
                createdAt: serverTimestamp(),
                status: 'paid_priority',
                isQuickStart: true
            });

            setStatus('success');
            setFormData({
                name: '',
                email: '',
                phone: '',
                projectType: 'Web Development',
                description: ''
            });
        } catch (error) {
            console.error("Error processing quick start: ", error);
            setStatus('error');
            setErrorMessage(error.message || "Payment processing failed. Please try again.");
        }
    };

    return (
        <div className="container section">
            <div className={styles.wrapper}>
                <div className={styles.header}>
                    <div className={styles.badge}>
                        <Zap size={16} /> Premium Service
                    </div>
                    <h1 className="section-title">Quick Start Your Project</h1>
                    <p className={styles.subtitle}>
                        Skip the queue and get your project moving immediately.
                        Includes priority support and expedited development planning.
                    </p>
                </div>

                {status === 'success' ? (
                    <div className={styles.successMessage}>
                        <CheckCircle size={64} className={styles.successIcon} />
                        <h2>Payment Successful!</h2>
                        <p>
                            Your project has been marked as <strong>Priority</strong>.
                            Our team will contact you within 24 hours to kickstart development.
                        </p>
                        <Link href="/" className="btn btn-primary" style={{ marginTop: '20px' }}>
                            Return Home
                        </Link>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        <div className={styles.formCard}>
                            <h2>Project Details</h2>
                            <form onSubmit={handlePaymentAndSubmit} className={styles.form}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="name">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Your Name"
                                    />
                                </div>

                                <div className={styles.row}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="email">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="your@email.com"
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="phone">Phone</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            placeholder="+91..."
                                        />
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="projectType">Project Type</label>
                                    <select
                                        id="projectType"
                                        name="projectType"
                                        value={formData.projectType}
                                        onChange={handleChange}
                                    >
                                        <option value="Web Development">Web Development</option>
                                        <option value="Android App">Android App</option>
                                        <option value="Custom Software">Custom Software</option>
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="description">Project Description</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        placeholder="Describe your project requirements..."
                                        rows={4}
                                    />
                                </div>

                                <div className={styles.terms}>
                                    <input type="checkbox" id="terms" required />
                                    <label htmlFor="terms">
                                        I agree to the <Link href="/terms">Terms and Conditions</Link>
                                    </label>
                                </div>

                                {status === 'error' && (
                                    <div className={styles.errorAlert}>
                                        <AlertCircle size={20} />
                                        <span>{errorMessage}</span>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className={`btn btn-primary ${styles.payBtn}`}
                                    disabled={status === 'processing'}
                                >
                                    {status === 'processing' ? (
                                        <>
                                            <Loader2 size={20} className={styles.spinner} /> Processing...
                                        </>
                                    ) : (
                                        <>
                                            Pay & Quicken Development <CreditCard size={20} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        <div className={styles.infoCard}>
                            <h3>Why Quick Start?</h3>
                            <ul className={styles.benefits}>
                                <li>
                                    <CheckCircle size={18} className={styles.checkIcon} />
                                    <strong>Under 48 Hours:</strong> We start working on your project immediately.
                                </li>
                                <li>
                                    <CheckCircle size={18} className={styles.checkIcon} />
                                    <strong>We Contact You:</strong> Personal outreach to discuss details.
                                </li>
                                <li>
                                    <CheckCircle size={18} className={styles.checkIcon} />
                                    <strong>Skip Queue:</strong> Jump to the front of our development line.
                                </li>
                            </ul>
                            <div className={styles.priceTag}>
                                <span>One-time Fee</span>
                                <strong>₹500</strong>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
