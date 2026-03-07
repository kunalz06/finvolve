"use client";

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Zap, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { db, isConfigValid } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
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
      if (!isConfigValid || !db) {
        throw new Error("Database is not configured. Please contact support.");
      }

      await addDoc(collection(db, "contact_messages"), {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        createdAt: serverTimestamp(),
        status: 'unread',
        source: 'contact_page'
      });

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error("Submission error:", error);
      setStatus('error');
      setErrorMessage(error.message || "Failed to send message. Please try again.");
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-lg mx-auto text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <CheckCircle className="text-green-600 w-12 h-12" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Message Sent!</h1>
            <p className="text-lg text-gray-600 mb-8">
              Thank you for reaching out. We&apos;ll get back to you within 24 hours.
            </p>
            <Button onClick={() => setStatus('idle')} variant="primary">
              Send Another Message
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 mb-6">
              <span className="text-primary font-medium text-sm">CONTACT US</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Let&apos;s Start a Conversation
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have a project in mind? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-8">
            
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2 space-y-6"
            >
              <Card hover={false} className="bg-gray-50 border-0">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Contact Information</h3>
                
                <div className="space-y-6">
                  {/* Email */}
                  <a href="mailto:contact@finvolve.dev" className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                      <Mail className="text-primary group-hover:text-white transition-colors" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                      <p className="text-gray-600 text-sm">contact@finvolve.dev</p>
                    </div>
                  </a>

                  {/* Phone */}
                  <a href="tel:+919907958859" className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                      <Phone className="text-primary group-hover:text-white transition-colors" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                      <p className="text-gray-600 text-sm">+91 99079 58859</p>
                    </div>
                  </a>

                  {/* Location */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <MapPin className="text-gray-500" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Location</h4>
                      <p className="text-gray-600 text-sm">India</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quick CTA */}
              <Card hover={false} className="bg-gradient-to-br from-primary to-purple-600 border-0 text-white">
                <Zap className="mb-4" size={32} />
                <h3 className="text-lg font-bold mb-2">Ready to Start?</h3>
                <p className="text-white/80 text-sm mb-4">
                  Jump straight to our project wizard and get started today.
                </p>
                <Button href="/finvolve/request" variant="secondary" size="small" className="w-full">
                  Start a Project
                </Button>
              </Card>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-3"
            >
              <Card hover={false}>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Send us a message</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="How can we help?"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Tell us about your project..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                    />
                  </div>

                  {status === 'error' && (
                    <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                      <AlertCircle size={20} />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="large" 
                    className="w-full" 
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> Sending...
                      </>
                    ) : (
                      <>
                        Send Message <Send size={18} />
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
