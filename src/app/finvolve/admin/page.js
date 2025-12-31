"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Lock, Calendar, User, Mail, Phone, FileText, Zap, DollarSign } from 'lucide-react';
import styles from './page.module.css';

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === 'admin123') {
            setIsAuthenticated(true);
            fetchRequests();
        } else {
            setError('Invalid password');
        }
    };

    const fetchRequests = async () => {
        setLoading(true);
        try {
            if (!db) throw new Error("Firebase not initialized");

            const q = query(collection(db, "requests"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const reqs = [];
            querySnapshot.forEach((doc) => {
                reqs.push({ id: doc.id, ...doc.data() });
            });
            setRequests(reqs);
        } catch (err) {
            console.error("Error fetching requests:", err);
            // Fallback for demo if firebase fails or is empty
            setRequests([]);
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className={styles.loginContainer}>
                <div className={styles.loginBox}>
                    <Lock size={48} className={styles.lockIcon} />
                    <h1>Admin Access</h1>
                    <form onSubmit={handleLogin} className={styles.loginForm}>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                        />
                        {error && <p className={styles.error}>{error}</p>}
                        <button type="submit" className="btn btn-primary">Login</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="container section">
            <div className={styles.header}>
                <h1 className="section-title">Project Requests</h1>
                <button onClick={() => setIsAuthenticated(false)} className={styles.logoutBtn}>
                    Logout
                </button>
            </div>

            {loading ? (
                <p>Loading requests...</p>
            ) : requests.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>No requests found.</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {requests.map((req) => (
                        <div
                            key={req.id}
                            className={`${styles.card} ${req.isQuickStart ? styles.quickStartCard : ''}`}
                        >
                            <div className={styles.cardHeader}>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    {req.isQuickStart && (
                                        <span className={`${styles.typeBadge} ${styles.quickStartBadge}`}>
                                            <Zap size={12} fill="currentColor" /> Quick Start
                                        </span>
                                    )}
                                    <span className={styles.typeBadge}>{req.projectType}</span>
                                </div>
                                <span className={styles.date}>
                                    <Calendar size={14} />
                                    {req.createdAt?.seconds
                                        ? new Date(req.createdAt.seconds * 1000).toLocaleDateString()
                                        : 'Just now'}
                                </span>
                            </div>

                            <div className={styles.cardBody}>
                                <div className={styles.infoRow}>
                                    <User size={16} /> <strong>{req.name}</strong>
                                </div>
                                <div className={styles.infoRow}>
                                    <Mail size={16} /> <a href={`mailto:${req.email}`}>{req.email}</a>
                                </div>
                                {req.phone && (
                                    <div className={styles.infoRow}>
                                        <Phone size={16} /> <a href={`tel:${req.phone}`}>{req.phone}</a>
                                    </div>
                                )}
                                
                                {req.timeline && (
                                    <div className={styles.infoRow}>
                                        <Calendar size={16} /> <span>Est. Timeline: <strong>{req.timeline} Weeks</strong></span>
                                    </div>
                                )}
                                {req.budget && (
                                    <div className={styles.infoRow}>
                                        <DollarSign size={16} /> <span>Budget: <strong>{req.budget}</strong></span>
                                    </div>
                                )}
                                {req.isQuickStart && req.paymentId && (
                                     <div className={styles.infoRow} style={{ color: '#f59e0b' }}>
                                        <Zap size={16} /> <span>Paid: {req.paymentId}</span>
                                    </div>
                                )}
                                <div className={styles.description}>
                                    <FileText size={16} className={styles.descIcon} />
                                    <p>{req.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
