"use client";

import { useState, useEffect, useRef } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, addDoc, serverTimestamp, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { Lock, Calendar, User, Mail, Phone, Zap, DollarSign, LogOut, LayoutDashboard, CreditCard, MessageSquare, CheckCircle, X, AlertCircle, Eye } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('projects');
  const [requests, setRequests] = useState([]);
  const [payments, setPayments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [newPayment, setNewPayment] = useState({ username: '', password: '', amount: '' });
  const [creatingPayment, setCreatingPayment] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Use ref to store unsubscribe functions
  const unsubscribeRef = useRef({});

  useEffect(() => {
    if (isAuthenticated) {
      // Fetch all data when authenticated
      const unsubRequests = fetchRequests();
      const unsubPayments = fetchPayments();
      const unsubMessages = fetchMessages();
      
      unsubscribeRef.current = {
        requests: unsubRequests,
        payments: unsubPayments,
        messages: unsubMessages
      };
    }

    return () => {
      // Cleanup all listeners on unmount
      Object.values(unsubscribeRef.current).forEach(unsub => {
        if (typeof unsub === 'function') unsub();
      });
    };
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';
    
    if (password === adminPassword) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  const handleLogout = () => {
    // Cleanup listeners
    Object.values(unsubscribeRef.current).forEach(unsub => {
      if (typeof unsub === 'function') unsub();
    });
    unsubscribeRef.current = {};
    setIsAuthenticated(false);
    setRequests([]);
    setPayments([]);
    setMessages([]);
  };

  // Fetch project requests
  const fetchRequests = () => {
    setLoading(true);
    try {
      if (!db) {
        console.error("Firebase not initialized");
        setLoading(false);
        return;
      }

      const q = query(collection(db, "requests"), orderBy("createdAt", "desc"));
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const reqs = [];
        querySnapshot.forEach((doc) => {
          reqs.push({ id: doc.id, ...doc.data() });
        });
        setRequests(reqs);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching requests:", error);
        setLoading(false);
      });

      return unsubscribe;
    } catch (err) {
      console.error("Error setting up requests listener:", err);
      setLoading(false);
    }
  };

  // Fetch payments
  const fetchPayments = () => {
    try {
      if (!db) {
        console.error("Firebase not initialized");
        return;
      }

      const q = query(collection(db, "payment_requests"), orderBy("createdAt", "desc"));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const pays = [];
        querySnapshot.forEach((doc) => {
          pays.push({ id: doc.id, ...doc.data() });
        });
        setPayments(pays);
      }, (error) => {
        console.error("Error fetching payments:", error);
      });

      return unsubscribe;
    } catch (err) {
      console.error("Error setting up payment listener:", err);
    }
  };

  // Fetch contact messages
  const fetchMessages = () => {
    try {
      if (!db) {
        console.error("Firebase not initialized");
        return;
      }

      const q = query(collection(db, "contact_messages"), orderBy("createdAt", "desc"));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const msgs = [];
        querySnapshot.forEach((doc) => {
          msgs.push({ id: doc.id, ...doc.data() });
        });
        setMessages(msgs);
      }, (error) => {
        console.error("Error fetching messages:", error);
      });

      return unsubscribe;
    } catch (err) {
      console.error("Error setting up messages listener:", err);
    }
  };

  // Create new payment link
  const handleCreatePayment = async (e) => {
    e.preventDefault();
    setCreatingPayment(true);
    try {
      if (!db) throw new Error("Firebase not initialized");
      
      await addDoc(collection(db, "payment_requests"), {
        username: newPayment.username,
        password: newPayment.password,
        amount: Number(newPayment.amount),
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setNewPayment({ username: '', password: '', amount: '' });
    } catch (err) {
      console.error("Error creating payment:", err);
      alert("Failed to create payment link: " + err.message);
    } finally {
      setCreatingPayment(false);
    }
  };

  // Delete payment
  const handleDeletePayment = async (id) => {
    if (!confirm("Are you sure you want to delete this payment request?")) return;
    try {
      if (!db) throw new Error("Firebase not initialized");
      await deleteDoc(doc(db, "payment_requests", id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete: " + err.message);
    }
  };

  // Mark message as read
  const handleMarkMessageRead = async (id) => {
    try {
      if (!db) throw new Error("Firebase not initialized");
      await updateDoc(doc(db, "contact_messages", id), {
        status: 'read'
      });
    } catch (err) {
      console.error("Error marking message as read:", err);
    }
  };

  // Delete message
  const handleDeleteMessage = async (id) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      if (!db) throw new Error("Firebase not initialized");
      await deleteDoc(doc(db, "contact_messages", id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete: " + err.message);
    }
  };

  // Delete request
  const handleDeleteRequest = async (id) => {
    if (!confirm("Are you sure you want to delete this request?")) return;
    try {
      if (!db) throw new Error("Firebase not initialized");
      await deleteDoc(doc(db, "requests", id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete: " + err.message);
    }
  };

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleString();
    }
    return 'Just now';
  };

  const unreadCount = messages.filter(m => m.status === 'unread').length;
  const paidPaymentsCount = payments.filter(p => p.status === 'paid').length;
  const totalPaidAmount = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen py-20 bg-gray-50 flex items-center justify-center">
        <Card hover={false} className="w-full max-w-md p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-6">
            <Lock className="text-primary" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-500 mb-6">Enter admin password to access the dashboard.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              required
            />
            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-xl">
                <AlertCircle size={16} /> {error}
              </div>
            )}
            <Button type="submit" variant="primary" className="w-full">
              Unlock Dashboard
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm">Manage projects, messages, and payments</p>
          </div>
          <div className="flex gap-3">
            <div className="flex bg-white border border-gray-200 rounded-xl p-1">
              <button
                onClick={() => setActiveTab('projects')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'projects' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <LayoutDashboard size={16} />
                Projects
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{requests.length}</span>
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors relative flex items-center gap-2 ${activeTab === 'messages' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <MessageSquare size={16} />
                Messages
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'payments' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <CreditCard size={16} />
                Payments
              </button>
            </div>
            <button 
              onClick={handleLogout} 
              className="px-4 py-2 text-gray-600 hover:text-primary transition-colors border border-gray-200 rounded-xl hover:border-primary"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card hover={false} className="p-4">
            <div className="text-sm text-gray-500">Total Requests</div>
            <div className="text-2xl font-bold text-gray-900">{requests.length}</div>
          </Card>
          <Card hover={false} className="p-4">
            <div className="text-sm text-gray-500">Unread Messages</div>
            <div className="text-2xl font-bold text-primary">{unreadCount}</div>
          </Card>
          <Card hover={false} className="p-4">
            <div className="text-sm text-gray-500">Paid Payments</div>
            <div className="text-2xl font-bold text-green-600">{paidPaymentsCount}</div>
          </Card>
          <Card hover={false} className="p-4">
            <div className="text-sm text-gray-500">Total Revenue</div>
            <div className="text-2xl font-bold text-gray-900">₹{totalPaidAmount.toLocaleString()}</div>
          </Card>
        </div>

        {loading && (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Projects Tab */}
        {!loading && activeTab === 'projects' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Project Requests</h2>
              <span className="text-sm text-gray-500">{requests.length} total</span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200">
                  <LayoutDashboard size={48} className="mx-auto mb-4 text-gray-300" />
                  No project requests found.
                </div>
              ) : (
                requests.map((req) => (
                  <Card key={req.id} delay={0} className={req.isQuickStart ? 'ring-2 ring-amber-400' : ''}>
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-3 py-1 bg-purple-100 text-primary text-xs font-semibold rounded-full">
                        {req.projectType || 'Unknown'}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(req.createdAt)}
                      </span>
                    </div>

                    <div className="mb-4 pb-4 border-b border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <User size={14} /> <strong>{req.name || 'No name'}</strong>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Mail size={14} /> 
                        <a href={`mailto:${req.email}`} className="text-primary hover:underline">{req.email || 'No email'}</a>
                      </div>
                      {req.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone size={14} /> 
                          <a href={`tel:${req.phone}`} className="text-primary hover:underline">{req.phone}</a>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {req.timeline && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar size={14} className="text-primary" />
                          <span className="font-medium">{req.timeline} Weeks</span>
                        </div>
                      )}
                      {req.budget && (
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign size={14} className="text-green-600" />
                          <span className="font-medium">{req.budget}</span>
                        </div>
                      )}
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-gray-500 uppercase">Description</span>
                        {req.isQuickStart && req.paymentId && (
                          <span className="text-xs text-amber-600 flex items-center gap-1">
                            <Zap size={10} /> PAID PRIORITY
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm italic line-clamp-3">
                        &quot;{req.description || 'No description provided'}&quot;
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteRequest(req.id)}
                      className="w-full py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors text-sm font-medium"
                    >
                      Delete Request
                    </button>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {!loading && activeTab === 'messages' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Contact Messages</h2>
              <span className="text-sm text-gray-500">{messages.length} total, {unreadCount} unread</span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {messages.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200">
                  <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
                  No messages found.
                </div>
              ) : (
                messages.map((msg) => (
                  <Card 
                    key={msg.id} 
                    delay={0} 
                    className={msg.status === 'unread' ? 'ring-2 ring-primary bg-primary/5' : ''}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${msg.status === 'unread' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
                        {msg.status === 'unread' ? 'New' : 'Read'}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(msg.createdAt)}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{msg.subject || 'No Subject'}</h3>

                    <div className="mb-4 pb-4 border-b border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <User size={14} /> <strong>{msg.name || 'Anonymous'}</strong>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={14} /> 
                        <a href={`mailto:${msg.email}`} className="text-primary hover:underline">{msg.email || 'No email'}</a>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
                        {msg.message || 'No message content'}
                      </p>
                    </div>

                    {selectedMessage === msg.id && (
                      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedMessage(null)}>
                        <Card hover={false} className="max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-gray-900">{msg.subject}</h3>
                            <button onClick={() => setSelectedMessage(null)} className="text-gray-400 hover:text-gray-600">
                              <X size={20} />
                            </button>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <User size={14} /> <strong>{msg.name}</strong>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail size={14} /> <a href={`mailto:${msg.email}`} className="text-primary hover:underline">{msg.email}</a>
                            </div>
                            <div className="text-xs text-gray-400">
                              {formatDate(msg.createdAt)}
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4">
                              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                            </div>
                          </div>
                        </Card>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedMessage(msg.id)}
                        className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <Eye size={16} /> View
                      </button>
                      {msg.status === 'unread' && (
                        <button
                          onClick={() => handleMarkMessageRead(msg.id)}
                          className="py-2 px-4 rounded-xl border border-primary text-primary hover:bg-primary/10 transition-colors text-sm font-medium"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="py-2 px-4 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors text-sm font-medium"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {!loading && activeTab === 'payments' && (
          <div>
            {/* Create Payment Form */}
            <Card hover={false} className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard size={20} className="text-primary" /> Create New Payment Link
              </h2>
              <form onSubmit={handleCreatePayment} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Username</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    placeholder="e.g. client_abc"
                    value={newPayment.username}
                    onChange={(e) => setNewPayment({ ...newPayment, username: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Password</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    placeholder="Secure Password"
                    value={newPayment.password}
                    onChange={(e) => setNewPayment({ ...newPayment, password: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Amount (INR)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                    <input
                      type="number"
                      required
                      min="1"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-8 pr-4 text-gray-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                      placeholder="5000"
                      value={newPayment.amount}
                      onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                    />
                  </div>
                </div>
                <Button type="submit" variant="primary" disabled={creatingPayment}>
                  {creatingPayment ? 'Creating...' : 'Generate Link'}
                </Button>
              </form>
            </Card>

            {/* Payments List */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Payment Requests</h2>
              <span className="text-sm text-gray-500">{payments.length} total, {paidPaymentsCount} paid</span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {payments.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                  <CreditCard size={48} className="mx-auto mb-4 text-gray-300" />
                  No payment links created yet.
                </div>
              ) : (
                payments.map((pay) => (
                  <Card key={pay.id} delay={0} className={pay.status === 'paid' ? 'ring-2 ring-green-500' : ''}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg mb-1">{pay.username}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span className="bg-gray-100 px-2 py-1 rounded font-mono text-xs">Pass: {pay.password}</span>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${pay.status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                        {pay.status || 'pending'}
                      </div>
                    </div>

                    <div className="text-3xl font-bold text-gray-900 mb-2">₹{Number(pay.amount).toLocaleString()}</div>
                    <div className="text-xs text-gray-400 mb-4">
                      Created: {formatDate(pay.createdAt)}
                    </div>

                    {pay.status === 'paid' && pay.razorpayPaymentId && (
                      <div className="bg-green-50 rounded-lg p-3 mb-4 text-xs">
                        <div className="text-gray-500">Payment ID</div>
                        <div className="font-mono text-green-700 break-all">{pay.razorpayPaymentId}</div>
                      </div>
                    )}

                    <button
                      onClick={() => handleDeletePayment(pay.id)}
                      className="w-full py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors text-sm font-medium"
                    >
                      Delete
                    </button>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
