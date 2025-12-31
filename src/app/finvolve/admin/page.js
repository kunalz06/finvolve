"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, addDoc, serverTimestamp, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { Lock, Calendar, User, Mail, Phone, FileText, Zap, DollarSign } from 'lucide-react';
import styles from './page.module.css';
import GradientButton from '@/components/ui/GradientButton';

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeTab, setActiveTab] = useState('projects'); // 'projects' or 'payments'
    const [requests, setRequests] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Payment Form State
    const [newPayment, setNewPayment] = useState({ username: '', password: '', amount: '' });
    const [creatingPayment, setCreatingPayment] = useState(false);

    useEffect(() => {
        let unsubscribePayments;

        if (isAuthenticated) {
            if (activeTab === 'projects') fetchRequests();
            if (activeTab === 'payments') {
                unsubscribePayments = fetchPayments();
            }
        }

        return () => {
            if (unsubscribePayments && typeof unsubscribePayments === 'function') {
                unsubscribePayments();
            }
        };
    }, [isAuthenticated, activeTab]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === 'admin123') {
            setIsAuthenticated(true);
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

    const fetchPayments = () => {
        setLoading(true);
        try {
            if (!db) throw new Error("Firebase not initialized");
            const q = query(collection(db, "payment_requests"), orderBy("createdAt", "desc"));

            // Real-time listener
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const pays = [];
                querySnapshot.forEach((doc) => {
                    pays.push({ id: doc.id, ...doc.data() });
                });
                setPayments(pays);
                setLoading(false);
            }, (error) => {
                console.error("Error fetching payments:", error);
                setLoading(false);
            });

            return unsubscribe;
        } catch (err) {
            console.error("Error setting up payment listener:", err);
            setLoading(false);
        }
    };

    const handleCreatePayment = async (e) => {
        e.preventDefault();
        setCreatingPayment(true);
        try {
            await addDoc(collection(db, "payment_requests"), {
                username: newPayment.username,
                password: newPayment.password,
                amount: newPayment.amount,
                status: 'pending',
                createdAt: serverTimestamp()
            });
            setNewPayment({ username: '', password: '', amount: '' });
            fetchPayments(); // Refresh list
        } catch (err) {
            console.error("Error creating payment:", err);
            alert("Failed to create payment link");
        } finally {
            setCreatingPayment(false);
        }
    };

    const handleDeletePayment = async (id) => {
        if (!confirm("Are you sure you want to delete this user/payment request?")) return;
        try {
            await deleteDoc(doc(db, "payment_requests", id));
            setPayments(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error("Delete error:", err);
            alert("Failed to delete");
        }
    };

    if (!isAuthenticated) {
        return (
            <div className={styles.loginContainer}>
                <div className={styles.loginBox}>
                    <Lock size={48} className={styles.lockIcon} />
                    <h1 className="text-2xl font-bold mb-2">Admin Access</h1>
                    <p className="text-gray-400 mb-6">Enter secure credentials to proceed.</p>
                    <form onSubmit={handleLogin} className={styles.loginForm}>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                        />
                        {error && <p className={styles.error}>{error}</p>}
                        <GradientButton type="submit">Unlock Dashboard</GradientButton>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-20">
            <div className="deep-space-bg" />
            <div className="container mx-auto px-6 relative z-10">
                <div className={styles.header}>
                    <h1 className="text-3xl font-bold font-heading">Admin Dashboard</h1>
                    <div className="flex gap-4">
                        <div className="flex bg-white/10 rounded-lg p-1">
                            <button
                                onClick={() => setActiveTab('projects')}
                                className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'projects' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                Projects
                            </button>
                            <button
                                onClick={() => setActiveTab('payments')}
                                className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'payments' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                Payments
                            </button>
                        </div>
                        <button onClick={() => setIsAuthenticated(false)} className={styles.logoutBtn}>
                            Logout
                        </button>
                    </div>
                </div>

                {loading && (
                    <div className="flex justify-center p-12">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {!loading && activeTab === 'projects' && (
                    <div className={styles.grid}>
                        {requests.length === 0 ? (
                            <div className={styles.emptyState}>No project requests found.</div>
                        ) : (
                            requests.map((req) => (
                                <div key={req.id} className={`${styles.card} ${req.isQuickStart ? styles.quickStartCard : ''}`}>
                                    <div className={styles.cardHeader}>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            {/* Moved to Body */}
                                        </div>
                                        <span className={styles.date}>
                                            <Calendar size={14} />
                                            {req.createdAt?.seconds
                                                ? new Date(req.createdAt.seconds * 1000).toLocaleDateString()
                                                : 'Just now'}
                                        </span>
                                    </div>

                                    <div className={styles.cardBody}>
                                        {/* User Details */}
                                        <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
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
                                        </div>

                                        {/* Project Specs */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                                            {req.timeline && (
                                                <div className={styles.infoRow} style={{ marginBottom: 0 }}>
                                                    <Calendar size={16} className="text-primary" />
                                                    <span style={{ fontSize: '0.9rem' }}><strong>{req.timeline} Weeks</strong></span>
                                                </div>
                                            )}
                                            {req.budget && (
                                                <div className={styles.infoRow} style={{ marginBottom: 0 }}>
                                                    <DollarSign size={16} className="text-green-400" />
                                                    <span style={{ fontSize: '0.9rem' }}><strong>{req.budget}</strong></span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Project Concept (The Idea) */}
                                        <div className={styles.description} style={{ marginTop: 0, flexDirection: 'column', gap: '8px' }}>
                                            <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#6b7280', fontWeight: 'bold' }}>The Idea</h4>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                <span className={styles.typeBadge} style={{ margin: 0 }}>{req.projectType}</span>
                                                {req.isQuickStart && req.paymentId && (
                                                    <span style={{ fontSize: '0.75rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <Zap size={10} /> PAID
                                                    </span>
                                                )}
                                            </div>
                                            <p style={{ fontStyle: 'italic', color: '#d1d5db', lineHeight: '1.5' }}>
                                                "{req.description}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {!loading && activeTab === 'payments' && (
                    <div>
                        {/* Create Payment Form */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-12 max-w-4xl mx-auto">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Lock size={20} className="text-primary" /> Create New Payment Link</h2>
                            <form onSubmit={handleCreatePayment} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Username</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                                        placeholder="e.g. client_abc"
                                        value={newPayment.username}
                                        onChange={(e) => setNewPayment({ ...newPayment, username: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Password</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                                        placeholder="Secure Password"
                                        value={newPayment.password}
                                        onChange={(e) => setNewPayment({ ...newPayment, password: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Amount (INR)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                                        <input
                                            type="number"
                                            required
                                            className="w-full bg-black/40 border border-white/10 rounded-lg p-3 pl-8 text-white focus:border-primary focus:outline-none"
                                            placeholder="5000"
                                            value={newPayment.amount}
                                            onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <GradientButton type="submit" disabled={creatingPayment}>
                                    {creatingPayment ? 'Creating...' : 'Generate Link'}
                                </GradientButton>
                            </form>
                        </div>

                        {/* Payments List */}
                        <h3 className="text-xl font-bold mb-6">Active Payment Requests</h3>
                        <div className={styles.grid}>
                            {payments.length === 0 ? (
                                <div className="col-span-full text-center py-12 text-gray-400 bg-white/5 rounded-xl border border-dashed border-white/10">
                                    No active payment links created yet.
                                </div>
                            ) : (
                                payments.map((pay) => (
                                    <div key={pay.id} className={styles.card} style={{ borderColor: pay.status === 'paid' ? '#10b981' : 'var(--card-border)' }}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="font-bold text-lg mb-1">{pay.username}</h4>
                                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                                    <span className="bg-white/10 px-2 py-1 rounded">Pass: {pay.password}</span>
                                                </div>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${pay.status === 'paid' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                                {pay.status}
                                            </div>
                                        </div>

                                        <div className="text-3xl font-bold mb-2">₹{pay.amount}</div>
                                        <div className="text-xs text-gray-500 mb-6">Created: {pay.createdAt?.seconds ? new Date(pay.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}</div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleDeletePayment(pay.id)}
                                                className="flex-1 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors text-sm"
                                            >
                                                Delete User
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
