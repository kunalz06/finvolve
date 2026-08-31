"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, Loader2, Mail, MapPin, Phone, Send, Zap } from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, isConfigValid } from "@/lib/firebase";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      if (!isConfigValid || !db) throw new Error("Database is not configured. Please contact support.");

      await addDoc(collection(db, "contact_messages"), {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        createdAt: serverTimestamp(),
        status: "unread",
        source: "contact_page",
      });

      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Submission error:", error);
      setStatus("error");
      setErrorMessage(error.message || "Failed to send message. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-screen px-6 py-12">
        <div className="container">
          <div className="glass-surface-strong mx-auto max-w-lg rounded-2xl px-8 py-16 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100/90">
              <CheckCircle className="h-12 w-12 text-emerald-600" />
            </motion.div>
            <h1 className="mb-4 text-3xl font-bold text-slate-950">Message Sent!</h1>
            <p className="mb-8 text-lg text-slate-600">Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
            <Button onClick={() => setStatus("idle")} variant="primary">Send Another Message</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="container">
        <div className="mx-auto max-w-5xl">
          <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-16 text-center">
            <div className="glass-chip-strong mb-6 inline-flex items-center gap-2 rounded-xl px-4 py-2">
              <span className="text-sm font-medium text-primary">CONTACT US</span>
            </div>
            <h1 className="mb-6 text-4xl font-bold text-slate-950 md:text-5xl">Let&apos;s Start a Conversation</h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">Have a project in mind? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.</p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-5">
            <motion.div initial={false} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="space-y-6 lg:col-span-2">
              <Card hover={false} className="glass-surface-strong">
                <h3 className="mb-6 text-lg font-bold text-slate-950">Contact Information</h3>
                <div className="space-y-6">
                  <a href="mailto:mitraricky06@gmail.com" className="group flex items-start gap-4">
                    <div className="glass-icon-plate flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl transition-colors">
                      <Mail className="text-primary" size={20} />
                    </div>
                    <div>
                      <h4 className="mb-1 font-semibold text-slate-950">Email</h4>
                      <p className="text-sm text-slate-600">mitraricky06@gmail.com</p>
                    </div>
                  </a>
                  <a href="tel:+919907958859" className="group flex items-start gap-4">
                    <div className="glass-icon-plate flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl transition-colors">
                      <Phone className="text-primary" size={20} />
                    </div>
                    <div>
                      <h4 className="mb-1 font-semibold text-slate-950">Phone</h4>
                      <p className="text-sm text-slate-600">+91 99079 58859</p>
                    </div>
                  </a>
                  <div className="flex items-start gap-4">
                    <div className="glass-icon-plate flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl">
                      <MapPin className="text-slate-500" size={20} />
                    </div>
                    <div>
                      <h4 className="mb-1 font-semibold text-slate-950">Location</h4>
                      <p className="text-sm text-slate-600">India</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card hover={false} className="glass-surface-strong">
                <Zap className="mb-4 text-primary" size={32} />
                <h3 className="mb-2 text-lg font-bold text-slate-950">Ready to Start?</h3>
                <p className="mb-4 text-sm text-slate-600">Jump straight to our project wizard and get started today.</p>
                <Button href="/dev/request" variant="primary" size="small" className="w-full">Start a Project</Button>
              </Card>
            </motion.div>

            <motion.div initial={false} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="lg:col-span-3">
              <Card hover={false} className="glass-surface-strong">
                <h3 className="mb-6 text-xl font-bold text-slate-950">Send us a message</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">Your Name</label>
                      <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" className="w-full rounded-xl px-4 py-3 text-slate-900" />
                    </div>
                    <div>
                      <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">Email Address</label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" className="w-full rounded-xl px-4 py-3 text-slate-900" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="mb-2 block text-sm font-medium text-slate-700">Subject</label>
                    <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required placeholder="How can we help?" className="w-full rounded-xl px-4 py-3 text-slate-900" />
                  </div>

                  <div>
                    <label htmlFor="message" className="mb-2 block text-sm font-medium text-slate-700">Message</label>
                    <textarea id="message" name="message" rows={5} value={formData.message} onChange={handleChange} required placeholder="Tell us about your project..." className="w-full resize-none rounded-xl px-4 py-3 text-slate-900" />
                  </div>

                  {status === "error" && (
                    <div className="flex items-center gap-3 rounded-[22px] border border-red-200 bg-red-50/85 p-4 text-red-700">
                      <AlertCircle size={20} />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <Button type="submit" variant="primary" size="large" className="w-full" disabled={status === "loading"}>
                    {status === "loading" ? (
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
