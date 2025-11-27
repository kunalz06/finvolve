"use client";

import { useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import styles from './page.module.css';

export default function RequestPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        projectType: 'Web Development',
        description: ''
    });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        try {
            // Check if db is initialized (it might fail if config is placeholder)
            if (!db) {
                throw new Error("Firebase is not initialized. Please check configuration.");
            }

            await addDoc(collection(db, "requests"), {
                ...formData,
                createdAt: serverTimestamp(),
                status: 'new'
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
            console.error("Error submitting request: ", error);
            setStatus('error');
            setErrorMessage(error.message || "Something went wrong. Please try again.");
        }
    };

    return (
        <div className="container section">
            <div className={styles.wrapper}>
                <h1 className="section-title">Start a Project</h1>
                <p className={styles.subtitle}>
                    Tell us about your idea and we'll help you bring it to life.
                </p>

                {status === 'success' ? (
                    <div className={styles.successMessage}>
                        <CheckCircle size={64} className={styles.successIcon} />
                        <h2>Request Submitted!</h2>
                        <p>Thank you for reaching out. We will get back to you shortly.</p>
                        <button
                            className="btn btn-primary"
                            onClick={() => setStatus('idle')}
                            style={{ marginTop: '20px' }}
                        >
                            Submit Another Request
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className={styles.form}>
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
                                <label htmlFor="phone">Phone (Optional)</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
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
                                <option value="Other">Other</option>
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
                                placeholder="Tell us about your project requirements..."
                                rows={5}
                            />
                        </div>

                        {status === 'error' && (
                            <div className={styles.errorAlert}>
                                <AlertCircle size={20} />
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            className={`btn btn-primary ${styles.submitBtn}`}
                            disabled={status === 'loading'}
                        >
                            {status === 'loading' ? (
                                <>
                                    <Loader2 size={20} className={styles.spinner} /> Sending...
                                </>
                            ) : (
                                <>
                                    Submit Request <Send size={20} />
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
