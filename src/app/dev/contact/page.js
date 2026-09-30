"use client";

import { useState } from "react";
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
      if (!isConfigValid || !db) {
        throw new Error("Database is not configured. Please contact support.");
      }

      if (!db) {
        throw new Error("Database connection failed.");
      }

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
      <div className="min-h-screen px-4 py-8 sm:px-6 sm:py-12">
        <div className="container">
          <div className="gradient-section glass-surface-strong mx-auto max-w-lg rounded-[28px] px-6 py-12 text-center sm:px-8 sm:py-14">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-emerald-200 bg-emerald-100/90 dark:border-emerald-900/60 dark:bg-emerald-950/40 sm:mb-8 sm:h-24 sm:w-24">
              <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-emerald-600" />
            </div>
            <h1 className="mb-4 text-2xl sm:text-3xl font-semibold text-[var(--heading)]">Message Sent!</h1>
            <p className="mb-6 sm:mb-8 text-base sm:text-lg text-[var(--muted)]">Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
            <Button onClick={() => setStatus("idle")} variant="primary" className="touch-target">Send Another Message</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 sm:py-12">
      <div className="container">
        <div className="mx-auto max-w-5xl">
          {/* Contact Info Side */}
          <div className="mb-12 sm:mb-16 text-center">
            <div className="glass-chip-strong mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-lg px-3 py-1.5 sm:px-4 sm:py-2">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">CONTACT US</span>
            </div>
            <h1 className="mb-4 text-3xl font-black tracking-[-0.04em] text-[var(--heading)] sm:text-4xl md:text-5xl">Let&apos;s Start a Conversation</h1>
            <p className="mx-auto max-w-2xl text-base sm:text-lg text-[var(--muted)]">Have a project in mind? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.</p>
          </div>

          <div className="grid gap-6 sm:gap-8 lg:grid-cols-5">
            <div className="space-y-4 sm:space-y-6 lg:col-span-2">
              <Card hover={false} className="bg-[var(--surface-strong)]">
                <h3 className="mb-4 sm:mb-6 text-base sm:text-lg font-semibold text-[var(--heading)]">Contact Information</h3>
                <div className="space-y-4 sm:space-y-6">
                  <a href="mailto:mitraricky06@gmail.com" className="group flex items-start gap-3 sm:gap-4">
                    <div className="glass-icon-plate flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-xl transition-colors">
                      <Mail className="text-primary size-5 sm:size-[20px]" />
                    </div>
                    <div>
                      <h4 className="mb-1 font-semibold text-[var(--heading)]">Email</h4>
                      <p className="text-sm text-[var(--muted)]">mitraricky06@gmail.com</p>
                    </div>
                  </a>
                  <a href="tel:+919907958859" className="group flex items-start gap-3 sm:gap-4">
                    <div className="glass-icon-plate flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-xl transition-colors">
                      <Phone className="text-primary size-5 sm:size-[20px]" />
                    </div>
                    <div>
                      <h4 className="mb-1 font-semibold text-[var(--heading)]">Phone</h4>
                      <p className="text-sm text-[var(--muted)]">+91 99079 58859</p>
                    </div>
                  </a>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="glass-icon-plate flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-xl">
                      <MapPin className="text-[var(--muted)] size-5 sm:size-[20px]" />
                    </div>
                    <div>
                      <h4 className="mb-1 font-semibold text-[var(--heading)]">Location</h4>
                      <p className="text-sm text-[var(--muted)]">India</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card hover={false} className="bg-[var(--surface-strong)]">
                <Zap className="mb-3 sm:mb-4 text-primary size-6 sm:size-8" />
                <h3 className="mb-2 text-base sm:text-lg font-semibold text-[var(--heading)]">Ready to Start?</h3>
                <p className="mb-3 sm:mb-4 text-sm text-[var(--muted)]">Jump straight to our project wizard and get started today.</p>
                <Button href="/dev/request" variant="primary" size="small" className="w-full touch-target">Start a Project</Button>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <Card hover={false} className="bg-[var(--surface-strong)]">
                <h3 className="mb-4 sm:mb-6 text-lg sm:text-xl font-semibold text-[var(--heading)]">Send us a message</h3>
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-2 block text-sm font-medium text-[var(--foreground)]">Your Name</label>
                      <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" className="w-full rounded-xl bg-[var(--surface-strong)] px-3 py-2.5 text-[var(--heading)] sm:px-4 sm:py-3" />
                    </div>
                    <div>
                      <label htmlFor="email" className="mb-2 block text-sm font-medium text-[var(--foreground)]">Email Address</label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" className="w-full rounded-xl bg-[var(--surface-strong)] px-3 py-2.5 text-[var(--heading)] sm:px-4 sm:py-3" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="mb-2 block text-sm font-medium text-[var(--foreground)]">Subject</label>
                    <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required placeholder="How can we help?" className="w-full rounded-xl bg-[var(--surface-strong)] px-3 py-2.5 text-[var(--heading)] sm:px-4 sm:py-3" />
                  </div>

                  <div>
                    <label htmlFor="message" className="mb-2 block text-sm font-medium text-[var(--foreground)]">Message</label>
                    <textarea id="message" name="message" rows={4} value={formData.message} onChange={handleChange} required placeholder="Tell us about your project..." className="w-full resize-none rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-[var(--heading)]" />
                  </div>

                  {status === "error" && (
                    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/85 p-3 text-red-700 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-300 sm:p-4">
                      <AlertCircle size={16} className="sm:size-5" />
                      <span className="text-sm sm:text-base">{errorMessage}</span>
                    </div>
                  )}

                  <Button type="submit" variant="primary" size="large" className="w-full touch-target" disabled={status === "loading"}>
                    {status === "loading" ? (
                      <>
                        <Loader2 size={16} className="sm:size-5 animate-spin" /> Sending...
                      </>
                    ) : (
                      <>
                        Send Message <Send size={16} className="sm:size-5" />
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
