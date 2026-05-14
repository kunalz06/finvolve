"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    updateDoc,
} from "firebase/firestore";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import {
    AlertCircle,
    CheckCircle,
    CreditCard,
    Eye,
    LayoutDashboard,
    Lock,
    LogOut,
    Mail,
    MessageSquare,
    Phone,
    Send,
    Sparkles,
    Trash2,
    Users,
    X,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { auth, db, isConfigValid } from "@/lib/firebase";
import { apiUrl } from "@/lib/api";

const isAdmin = (claims) => claims?.role === "admin" || claims?.admin === true;

const formatDate = (timestamp) => {
    if (!timestamp) return "Not available";
    if (timestamp.seconds) return new Date(timestamp.seconds * 1000).toLocaleString();
    if (timestamp instanceof Date) return timestamp.toLocaleString();
    return "Not available";
};

const formatCurrency = (value) => `INR ${Number(value || 0).toLocaleString()}`;

const formatValidationDetails = (details) => {
    if (!details) return "";

    const messages = Object.entries(details.fieldErrors)
        .flatMap(([field, errors]) =>
            (errors || []).map((message) => `${field}: ${message}`),
        )
        .filter(Boolean);

    const formMessages = details.formErrors || [];
    return [...messages, ...formMessages].join(" | ");
};

const projectFields = (item) => [
    { label: "Project type", value: item.projectType || "Not provided" },
    { label: "Name", value: item.name || "Not provided" },
    { label: "Email", value: item.email || "Not provided" },
    { label: "Phone", value: item.phone || "Not provided" },
    { label: "Timeline", value: item.timeline ? `${item.timeline} weeks` : "Not provided" },
    { label: "Budget", value: item.budget || "Not provided" },
    { label: "Status", value: item.status || "new" },
    { label: "Quick Start", value: item.quickStart ? "Yes" : "No" },
    { label: "Payment marker", value: item.paymentStatus || item.razorpayPaymentId || "Not provided" },
    { label: "Submitted", value: formatDate(item.createdAt) },
];

function EmptyState({ title, copy }) {
    return (
        <Card hover={false} className="md:col-span-2 lg:col-span-3 text-center">
            <div className="glass-icon-plate mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full">
                <Sparkles className="text-primary" size={22} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">{copy}</p>
        </Card>
    );
}

export default function AdminPage() {
    const [authState, setAuthState] = useState("checking");
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [activeTab, setActiveTab] = useState("projects");
    const [requests, setRequests] = useState([]);
    const [messages, setMessages] = useState([]);
    const [payments, setPayments] = useState([]);
    const [newsletterSubscribers, setNewsletterSubscribers] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [deletingRequestId, setDeletingRequestId] = useState("");
    const [newPayment, setNewPayment] = useState({
        clientName: "",
        clientEmail: "",
        amount: "",
        notes: "",
        expiresInHours: "72",
    });
    const [creatingPayment, setCreatingPayment] = useState(false);
    const [generatedLink, setGeneratedLink] = useState(null);
    const [newsletterDraft, setNewsletterDraft] = useState({
        subject: "",
        body: "",
    });
    const [sendingNewsletter, setSendingNewsletter] = useState(false);
    const [newsletterResult, setNewsletterResult] = useState(null);
    const listenersRef = useRef({});

    const stopListeners = () => {
        Object.values(listenersRef.current).forEach((fn) => {
            if (typeof fn === "function") fn();
        });
        listenersRef.current = {};
    };

    useEffect(() => {
        if (!auth) {
            setAuthState("unauthorized");
            setError("Firebase Auth is not configured.");
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                stopListeners();
                setAuthState("signed_out");
                return;
            }

            try {
                const tokenResult = await user.getIdTokenResult(true);
                if (!isAdmin(tokenResult.claims)) {
                    await signOut(auth);
                    setAuthState("unauthorized");
                    setError("This account does not have admin role claims.");
                    return;
                }

                setAuthState("authenticated");
            } catch (claimError) {
                console.error("Admin auth check failed:", claimError);
                setAuthState("unauthorized");
                setError("Unable to verify admin role.");
            }
        });

        return () => {
            unsubscribe();
            stopListeners();
        };
    }, []);

    useEffect(() => {
        if (authState !== "authenticated" || !db) return;

        listenersRef.current.requests = onSnapshot(
            query(collection(db, "requests"), orderBy("createdAt", "desc")),
            (snap) => setRequests(snap.docs.map((row) => ({ id: row.id, ...row.data() }))),
        );
        listenersRef.current.messages = onSnapshot(
            query(collection(db, "contact_messages"), orderBy("createdAt", "desc")),
            (snap) => setMessages(snap.docs.map((row) => ({ id: row.id, ...row.data() }))),
        );
        listenersRef.current.payments = onSnapshot(
            query(collection(db, "payment_requests"), orderBy("createdAt", "desc")),
            (snap) => setPayments(snap.docs.map((row) => ({ id: row.id, ...row.data() }))),
        );
        listenersRef.current.newsletter = onSnapshot(
            query(collection(db, "newsletter_subscribers"), orderBy("createdAt", "desc")),
            (snap) => setNewsletterSubscribers(snap.docs.map((row) => ({ id: row.id, ...row.data() }))),
        );

        return stopListeners;
    }, [authState]);

    useEffect(() => {
        if (!selectedRequest) return undefined;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setSelectedRequest(null);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedRequest]);

    const handleLogin = async (event) => {
        event.preventDefault();
        setError("");
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setPassword("");
        } catch (loginError) {
            console.error("Login failed:", loginError);
            setError("Invalid admin credentials.");
        }
    };

    const handleLogout = async () => {
        try {
            stopListeners();
            await signOut(auth);
        } catch (logoutError) {
            setError("Unable to sign out.");
            console.error("Logout failed:", logoutError);
        }
    };

    const handleCreatePayment = async (event) => {
        event.preventDefault();
        setCreatingPayment(true);
        setGeneratedLink(null);
        setError("");

        try {
            if (!auth?.currentUser) {
                throw new Error("Your admin session has expired. Please sign in again.");
            }

            const payload = {
                clientName: newPayment.clientName.trim(),
                clientEmail: newPayment.clientEmail.trim(),
                amount: Number(newPayment.amount),
                notes: newPayment.notes.trim(),
                expiresInHours: Number(newPayment.expiresInHours),
            };

            if (!payload.clientName) {
                throw new Error("Client name is required.");
            }

            if (!Number.isFinite(payload.amount) || payload.amount <= 0) {
                throw new Error("Enter a valid payment amount.");
            }

            if (!Number.isFinite(payload.expiresInHours) || payload.expiresInHours < 1) {
                throw new Error("Enter a valid expiry in hours.");
            }

            const idToken = await auth.currentUser.getIdToken(true);
            const response = await fetch(apiUrl("/dev/api/admin/payment-link"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify(payload),
            });
            const json = await response.json();
            if (!response.ok) {
                const detailMessage = formatValidationDetails(json.details);
                throw new Error(detailMessage || json.error || "Could not create payment link.");
            }
            setGeneratedLink(json);
            setNewPayment({
                clientName: "",
                clientEmail: "",
                amount: "",
                notes: "",
                expiresInHours: "72",
            });
        } catch (createError) {
            setError(createError.message || "Could not create payment link.");
        } finally {
            setCreatingPayment(false);
        }
    };

    const handleDeleteRequest = async (requestId) => {
        setDeletingRequestId(requestId);
        try {
            await deleteDoc(doc(db, "requests", requestId));
            if (selectedRequest?.id === requestId) {
                setSelectedRequest(null);
            }
        } catch (deleteError) {
            console.error("Delete failed:", deleteError);
            setError("Unable to delete this request.");
        } finally {
            setDeletingRequestId("");
        }
    };

    const handleSendNewsletter = async (event) => {
        event.preventDefault();
        setSendingNewsletter(true);
        setNewsletterResult(null);
        setError("");

        try {
            if (!auth?.currentUser) {
                throw new Error("Your admin session has expired. Please sign in again.");
            }

            const idToken = await auth.currentUser.getIdToken(true);
            const response = await fetch(apiUrl("/dev/api/admin/newsletter/send"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify({
                    subject: newsletterDraft.subject,
                    body: newsletterDraft.body,
                }),
            });
            const json = await response.json();
            if (!response.ok) throw new Error(json.error || "Could not send newsletter.");

            setNewsletterResult({
                type: json.failureCount > 0 ? "warning" : "success",
                message: `Sent to ${json.sentCount} subscriber${json.sentCount === 1 ? "" : "s"}${json.failureCount ? ` with ${json.failureCount} failure${json.failureCount === 1 ? "" : "s"}` : ""}.`,
            });
            setNewsletterDraft({ subject: "", body: "" });
        } catch (sendError) {
            setNewsletterResult({
                type: "error",
                message: sendError.message || "Could not send newsletter.",
            });
        } finally {
            setSendingNewsletter(false);
        }
    };

    const unreadCount = messages.filter((item) => item.status === "unread").length;
    const paidPaymentsCount = payments.filter((item) => item.status === "paid").length;
    const activeSubscriberCount = newsletterSubscribers.filter((item) => item.status === "active").length;
    const revenue = payments
        .filter((item) => item.status === "paid")
        .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const stats = useMemo(() => ([
        { label: "Requests", value: requests.length, tone: "text-slate-900" },
        { label: "Unread", value: unreadCount, tone: "text-primary" },
        { label: "Paid", value: paidPaymentsCount, tone: "text-emerald-600" },
        { label: "Revenue", value: formatCurrency(revenue), tone: "text-slate-900" },
        { label: "Subscribers", value: activeSubscriberCount, tone: "text-primary" },
    ]), [requests.length, unreadCount, paidPaymentsCount, revenue, activeSubscriberCount]);

    if (authState !== "authenticated") {
        return (
            <div className="min-h-screen px-6 py-16">
                <div className="container">
                    <Card hover={false} className="glass-surface-strong mx-auto max-w-md overflow-hidden p-0">
                        <div className="border-b border-white/45 px-8 py-8 text-center">
                            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-xl border-2 border-[var(--border)] bg-[var(--primary)] shadow-[var(--shadow-soft)]">
                                <Lock className="text-white" size={28} />
                            </div>
                            <p className="glass-chip-strong mb-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-primary">
                                <Sparkles size={14} />
                                Admin Access
                            </p>
                            <h1 className="text-3xl font-bold text-slate-950">Sign in to Mission Control</h1>
                            <p className="mt-3 text-sm text-slate-600">Use a Firebase account that already has the admin custom claim.</p>
                        </div>
                        <form onSubmit={handleLogin} className="space-y-4 px-8 py-8">
                            <input className="w-full rounded-[20px] px-4 py-3 text-slate-900" type="email" placeholder="Admin email" value={email} onChange={(event) => setEmail(event.target.value)} required />
                            <input className="w-full rounded-[20px] px-4 py-3 text-slate-900" type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} required />
                            {error && <div className="flex items-center gap-2 rounded-[20px] border border-red-200 bg-red-50/85 px-4 py-3 text-sm text-red-700"><AlertCircle size={16} />{error}</div>}
                            <Button type="submit" variant="primary" className="w-full">Sign In</Button>
                        </form>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-6 py-12">
            <div className="container">
                {!isConfigValid && <div className="mb-6 rounded-[22px] border border-amber-200 bg-amber-50/85 px-4 py-3 text-sm text-amber-700">Firebase public config appears incomplete.</div>}
                {error && <div className="mb-6 rounded-[22px] border border-red-200 bg-red-50/85 px-4 py-3 text-sm text-red-700">{error}</div>}

                <section className="glass-surface-strong page-section rounded-2xl px-6 py-8 md:px-8 md:py-10">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl">
                            <p className="glass-chip-strong mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                                <Sparkles size={14} />
                                Admin Dashboard
                            </p>
                            <h1 className="text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">Mission control for requests, messages, and payments.</h1>
                            <p className="mt-4 max-w-xl text-base text-slate-600">Review incoming project requests, open complete request details in-place, and keep payment links moving without leaving the dashboard.</p>
                        </div>
                        <Button onClick={handleLogout} variant="secondary" className="w-full sm:w-auto">
                            Sign Out
                            <LogOut size={18} />
                        </Button>
                    </div>
                </section>

                <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
                    {stats.map((stat) => (
                        <Card key={stat.label} hover={false} className="admin-grid-card flex min-h-[148px] flex-col justify-between p-5">
                            <div className="text-sm font-medium text-slate-500">{stat.label}</div>
                            <div className={`text-3xl font-bold ${stat.tone}`}>{stat.value}</div>
                        </Card>
                    ))}
                </div>

                <div className="glass-chip-strong mt-8 inline-flex flex-wrap gap-2 rounded-xl p-2">
                    {[
                        { id: "projects", label: "Projects", icon: LayoutDashboard },
                        { id: "messages", label: "Messages", icon: MessageSquare },
                        { id: "payments", label: "Payments", icon: CreditCard },
                        { id: "newsletter", label: "Newsletter", icon: Users },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        const active = activeTab === tab.id;
                        return (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-all ${active ? "border-2 border-[var(--border)] bg-[var(--primary)] text-white shadow-[var(--shadow-soft)]" : "text-slate-600 hover:bg-[var(--surface-muted)] hover:text-slate-900"}`}>
                                <Icon size={16} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {activeTab === "projects" && (
                    <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {requests.length === 0 && (
                            <EmptyState title="No project requests yet" copy="New inquiries will show up here as soon as clients submit the DEV♾️ request flow." />
                        )}
                        {requests.map((item) => (
                            <Card key={item.id} className="admin-grid-card flex flex-col justify-between p-6">
                                <div>
                                    <div className="mb-4 flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{item.projectType || "Project request"}</p>
                                            <h3 className="mt-2 text-xl font-bold text-slate-950">{item.name || "Unnamed lead"}</h3>
                                        </div>
                                        {item.quickStart && <span className="glass-chip-strong rounded-full px-3 py-1 text-xs font-semibold text-primary">Quick Start</span>}
                                    </div>
                                    <div className="space-y-2 text-sm text-slate-600">
                                        <div className="flex items-center gap-2"><Mail size={14} className="text-slate-400" />{item.email || "No email"}</div>
                                        <div className="flex items-center gap-2"><Phone size={14} className="text-slate-400" />{item.phone || "No phone"}</div>
                                    </div>
                                    <p className="mt-5 line-clamp-4 text-sm leading-6 text-slate-600">{item.description || "No description provided."}</p>
                                </div>
                                <div className="mt-6">
                                    <div className="mb-4 flex flex-wrap gap-2 text-xs text-slate-500">
                                        {item.timeline && <span className="glass-chip rounded-full px-3 py-1">{item.timeline} weeks</span>}
                                        {item.budget && <span className="glass-chip rounded-full px-3 py-1">{item.budget}</span>}
                                        <span className="glass-chip rounded-full px-3 py-1">{formatDate(item.createdAt)}</span>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button type="button" variant="secondary" className="flex-1" onClick={() => setSelectedRequest(item)}>View<Eye size={18} /></Button>
                                        <button type="button" className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50/75 px-5 py-3 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100" onClick={() => handleDeleteRequest(item.id)} disabled={deletingRequestId === item.id}><Trash2 size={16} />{deletingRequestId === item.id ? "Deleting..." : "Delete"}</button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {activeTab === "messages" && (
                    <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {messages.length === 0 && (
                            <EmptyState title="No contact messages" copy="Your contact inbox is empty right now. New messages will appear here automatically." />
                        )}
                        {messages.map((item) => (
                            <Card key={item.id} className={item.status === "unread" ? "border-primary/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_24px_60px_rgba(103,88,255,0.16)]" : ""}>
                                <div className="mb-3 flex items-start justify-between gap-3">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-950">{item.subject || "No subject"}</h3>
                                        <p className="mt-1 text-sm text-slate-600">{item.name || "Anonymous"} � {item.email || "No email"}</p>
                                    </div>
                                    {item.status === "unread" && <span className="glass-chip-strong rounded-full px-3 py-1 text-xs font-semibold text-primary">Unread</span>}
                                </div>
                                <p className="line-clamp-5 text-sm leading-6 text-slate-600">{item.message || "No content."}</p>
                                <div className="mt-5 text-xs text-slate-500">{formatDate(item.createdAt)}</div>
                                <div className="mt-5 flex gap-3">
                                    {item.status === "unread" && <Button type="button" variant="secondary" className="flex-1" onClick={() => updateDoc(doc(db, "contact_messages", item.id), { status: "read" })}>Mark Read<CheckCircle size={18} /></Button>}
                                    <button type="button" className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50/75 px-5 py-3 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100" onClick={() => deleteDoc(doc(db, "contact_messages", item.id))}><Trash2 size={16} />Delete</button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {activeTab === "payments" && (
                    <div className="mt-8 space-y-8">
                        <Card hover={false} className="glass-surface-strong p-6 md:p-8">
                            <div className="mb-6 max-w-2xl">
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Secure Links</p>
                                <h2 className="mt-3 text-2xl font-bold text-slate-950">Create a tokenized payment request</h2>
                                <p className="mt-2 text-sm text-slate-600">Generate a secure, expiring payment link without storing reusable credentials.</p>
                            </div>
                            <form onSubmit={handleCreatePayment} className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
                                <input className="rounded-[20px] px-4 py-3 text-slate-900" placeholder="Client name" value={newPayment.clientName} onChange={(event) => setNewPayment({ ...newPayment, clientName: event.target.value })} required />
                                <input className="rounded-[20px] px-4 py-3 text-slate-900" placeholder="Client email" value={newPayment.clientEmail} onChange={(event) => setNewPayment({ ...newPayment, clientEmail: event.target.value })} />
                                <input className="rounded-[20px] px-4 py-3 text-slate-900" type="number" min="1" placeholder="Amount (INR)" value={newPayment.amount} onChange={(event) => setNewPayment({ ...newPayment, amount: event.target.value })} required />
                                <input className="rounded-[20px] px-4 py-3 text-slate-900" type="number" min="1" max="720" placeholder="Expiry hours" value={newPayment.expiresInHours} onChange={(event) => setNewPayment({ ...newPayment, expiresInHours: event.target.value })} required />
                                <Button type="submit" variant="primary" disabled={creatingPayment}>{creatingPayment ? "Creating..." : "Generate Link"}</Button>
                            </form>
                            {error && (
                                <div className="mt-4 rounded-[20px] border border-red-200 bg-red-50/85 px-4 py-3 text-sm text-red-700">
                                    {error}
                                </div>
                            )}
                            <textarea className="mt-4 min-h-[110px] w-full rounded-[24px] px-4 py-3 text-slate-900" rows={3} placeholder="Notes for the client (optional)" value={newPayment.notes} onChange={(event) => setNewPayment({ ...newPayment, notes: event.target.value })} />
                            {generatedLink && (
                                <div className="mt-5 rounded-[24px] border border-emerald-200 bg-emerald-50/85 p-4 text-sm text-emerald-800">
                                    <div className="font-semibold">Payment link ready</div>
                                    <div className="mt-2 break-all">{generatedLink.paymentUrl}</div>
                                    <button type="button" className="mt-3 rounded-full border border-emerald-300 bg-white/70 px-4 py-2 text-xs font-semibold text-emerald-800 transition-colors hover:bg-white" onClick={() => navigator.clipboard.writeText(generatedLink.paymentUrl)}>Copy link</button>
                                </div>
                            )}
                        </Card>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {payments.length === 0 && (
                                <EmptyState title="No payment requests yet" copy="Create a tokenized payment link and your payment requests will begin showing up here." />
                            )}
                            {payments.map((item) => (
                                <Card key={item.id} className={item.status === "paid" ? "border-emerald-300/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_24px_60px_rgba(16,185,129,0.16)]" : ""}>
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-950">{item.clientName || item.username || "Client"}</h3>
                                            <p className="mt-1 text-sm text-slate-600">{item.clientEmail || item.email || "No email"}</p>
                                        </div>
                                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status === "paid" ? "border border-emerald-200 bg-emerald-50/80 text-emerald-700" : "glass-chip-strong text-slate-600"}`}>{item.status || "pending"}</span>
                                    </div>
                                    <div className="mt-5 text-4xl font-bold text-slate-950">{formatCurrency(item.amount)}</div>
                                    {item.tokenExpiresAt && <div className="mt-2 text-xs text-slate-500">Expires: {formatDate(item.tokenExpiresAt)}</div>}
                                    {item.razorpayPaymentId && <div className="mt-3 break-all rounded-[18px] border border-emerald-200 bg-emerald-50/80 px-3 py-2 text-xs text-emerald-700">Payment ID: {item.razorpayPaymentId}</div>}
                                    <button type="button" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50/75 px-5 py-3 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100" onClick={() => deleteDoc(doc(db, "payment_requests", item.id))}><Trash2 size={16} />Delete</button>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === "newsletter" && (
                    <div className="mt-8 space-y-8">
                        <Card hover={false} className="glass-surface-strong p-6 md:p-8">
                            <div className="mb-6 max-w-2xl">
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Newsletter</p>
                                <h2 className="mt-3 text-2xl font-bold text-slate-950">Send an update from your personal mail</h2>
                                <p className="mt-2 text-sm text-slate-600">This sends one email per active subscriber and includes an unsubscribe link automatically.</p>
                            </div>
                            <form onSubmit={handleSendNewsletter} className="space-y-4">
                                <input className="w-full rounded-[20px] px-4 py-3 text-slate-900" placeholder="Newsletter subject" value={newsletterDraft.subject} onChange={(event) => setNewsletterDraft({ ...newsletterDraft, subject: event.target.value })} required />
                                <textarea className="min-h-[180px] w-full rounded-[24px] px-4 py-3 text-slate-900" placeholder="Write the newsletter body..." value={newsletterDraft.body} onChange={(event) => setNewsletterDraft({ ...newsletterDraft, body: event.target.value })} required />
                                <Button type="submit" variant="primary" disabled={sendingNewsletter}>
                                    {sendingNewsletter ? "Sending..." : "Send Newsletter"}
                                    <Send size={18} />
                                </Button>
                            </form>
                            {newsletterResult && (
                                <div className={`mt-5 rounded-[24px] p-4 text-sm ${
                                    newsletterResult.type === "error"
                                        ? "border border-red-200 bg-red-50/85 text-red-700"
                                        : newsletterResult.type === "warning"
                                            ? "border border-amber-200 bg-amber-50/85 text-amber-700"
                                            : "border border-emerald-200 bg-emerald-50/85 text-emerald-700"
                                }`}>
                                    {newsletterResult.message}
                                </div>
                            )}
                        </Card>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {newsletterSubscribers.length === 0 && (
                                <EmptyState title="No newsletter subscribers yet" copy="Subscribers from the site footer will show up here automatically." />
                            )}
                            {newsletterSubscribers.map((item) => (
                                <Card key={item.id} className={item.status === "active" ? "border-emerald-300/60" : "opacity-75"}>
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-950">{item.name || item.email || "Subscriber"}</h3>
                                            <p className="mt-1 break-all text-sm text-slate-600">{item.email || "No email"}</p>
                                        </div>
                                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status === "active" ? "border border-emerald-200 bg-emerald-50/80 text-emerald-700" : "glass-chip-strong text-slate-600"}`}>{item.status || "active"}</span>
                                    </div>
                                    <div className="mt-5 space-y-2 text-xs text-slate-500">
                                        <div>Subscribed: {formatDate(item.subscribedAt || item.createdAt)}</div>
                                        {item.lastNewsletterSentAt && <div>Last sent: {formatDate(item.lastNewsletterSentAt)}</div>}
                                        {item.lastEmailError && <div className="rounded-[18px] border border-red-200 bg-red-50/80 px-3 py-2 text-red-700">Last error: {item.lastEmailError}</div>}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {selectedRequest && (
                <div className="glass-overlay fixed inset-0 z-50 flex items-center justify-center px-4 py-8" onClick={() => setSelectedRequest(null)}>
                    <div className="glass-surface-strong max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl" onClick={(event) => event.stopPropagation()}>
                        <div className="flex items-start justify-between gap-4 border-b border-white/45 px-6 py-5 md:px-8">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Full Request</p>
                                <h2 className="mt-2 text-2xl font-bold text-slate-950">{selectedRequest.name || "Unnamed lead"}</h2>
                                <p className="mt-1 text-sm text-slate-600">{selectedRequest.projectType || "Project request"}</p>
                            </div>
                            <button type="button" className="glass-chip-strong inline-flex h-11 w-11 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-white/85 hover:text-slate-900" onClick={() => setSelectedRequest(null)} aria-label="Close request modal"><X size={18} /></button>
                        </div>
                        <div className="max-h-[calc(90vh-144px)] overflow-y-auto px-6 py-6 md:px-8">
                            <div className="grid gap-4 md:grid-cols-2">
                                {projectFields(selectedRequest).map((field) => (
                                    <div key={field.label} className="glass-chip rounded-[24px] px-4 py-4">
                                        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{field.label}</div>
                                        <div className="mt-2 text-sm font-medium leading-6 text-slate-900">{field.value}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="glass-chip mt-6 rounded-[28px] p-5">
                                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Full description</div>
                                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">{selectedRequest.description || "No description provided."}</p>
                            </div>
                            {selectedRequest.service && <div className="glass-chip mt-4 rounded-[22px] px-4 py-3 text-sm text-slate-600">Requested service: <span className="font-semibold text-slate-900">{selectedRequest.service}</span></div>}
                        </div>
                        <div className="flex flex-col gap-3 border-t border-white/45 px-6 py-5 sm:flex-row sm:justify-end md:px-8">
                            <Button type="button" variant="secondary" onClick={() => setSelectedRequest(null)}>Close</Button>
                            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50/80 px-5 py-3 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100" onClick={() => handleDeleteRequest(selectedRequest.id)} disabled={deletingRequestId === selectedRequest.id}><Trash2 size={16} />{deletingRequestId === selectedRequest.id ? "Deleting..." : "Delete Request"}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

