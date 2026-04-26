"use client";

import { useEffect, useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import {
    AlertCircle,
    CheckCircle,
    Download,
    GraduationCap,
    Loader2,
    Lock,
    LogOut,
    User,
} from "lucide-react";

const VALID_ENROLLMENT = "12024052013007";
const VALID_REGISTRATION = "104202405200088";
const COURSES = ["CYBERSECURITY", "ROBOTICS", "PEGASUS IT"];
const STORAGE_KEY = "iemminor_student_session";
const ADMIT_CARD_KEY = "iemminor_admit_card";
const LOGO_URL = "/iem-logo.png";
const SIGNATURE_URL = "/iem-signature.svg";

function todayLabel() {
    return new Date().toLocaleDateString("en-GB").replace(/\//g, "-");
}

function loadRazorpayScript() {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

function qrPayload(card) {
    return [
        `Name of the Candidate: ${card.name}`,
        `Enrollment Number: ${card.enrollmentNo}`,
        `Registration Number: ${card.registrationNo}`,
        `Course: ${card.course}`,
    ].join("\n");
}

async function imageToDataUrl(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

async function svgToPngDataUrl(url, width = 320, height = 92) {
    const svgDataUrl = await imageToDataUrl(url);
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const context = canvas.getContext("2d");
            context.drawImage(image, 0, 0, width, height);
            resolve(canvas.toDataURL("image/png"));
        };
        image.onerror = reject;
        image.src = svgDataUrl;
    });
}

async function downloadAdmitCard(card) {
    const [logoDataUrl, signatureDataUrl, qrDataUrl] = await Promise.all([
        imageToDataUrl(LOGO_URL),
        svgToPngDataUrl(SIGNATURE_URL),
        QRCode.toDataURL(qrPayload(card), {
            width: 360,
            margin: 1,
            color: { dark: "#000000", light: "#ffffff" },
        }),
    ]);

    const downloadedOn = todayLabel();
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const navy = "#252052";
    const blue = "#1f7ae0";
    const pageMargin = 12;

    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, 210, 297, "F");
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.35);
    pdf.rect(pageMargin, pageMargin, 210 - pageMargin * 2, 297 - pageMargin * 2);
    pdf.addImage(logoDataUrl, "PNG", 17, 17, 30, 22);
    pdf.addImage(logoDataUrl, "PNG", 163, 17, 30, 22);

    pdf.setTextColor(navy);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11.5);
    pdf.text("INSTITUTE OF ENGINEERING & MANAGEMENT (SALT LAKE)", 105, 21, { align: "center", maxWidth: 106 });
    pdf.setFontSize(8.5);
    pdf.text("A constituent institute of", 105, 27, { align: "center" });
    pdf.setFontSize(11.5);
    pdf.text("UNIVERSITY OF ENGINEERING AND MANAGEMENT, KOLKATA", 105, 34, { align: "center", maxWidth: 118 });
    pdf.setDrawColor(230, 230, 230);
    pdf.line(17, 43, 193, 43);

    pdf.setFont("helvetica", "normal");
    pdf.setTextColor("#000000");
    pdf.setFontSize(11);
    pdf.text("Name of the Candidate:", 20, 73);
    pdf.text("Registration Number:", 20, 82);
    pdf.text("Enrollment Number:", 20, 91);
    pdf.setTextColor(blue);
    pdf.setFont("helvetica", "italic");
    pdf.text(card.name, 76, 73, { maxWidth: 105 });
    pdf.text(card.registrationNo, 76, 82, { maxWidth: 105 });
    pdf.text(card.enrollmentNo, 76, 91, { maxWidth: 105 });

    pdf.setFont("helvetica", "normal");
    pdf.setTextColor("#004f9f");
    pdf.text("Schedule of Minor Examination", 105, 106, { align: "center" });

    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.25);
    pdf.rect(17, 116, 176, 16);
    pdf.line(17, 124, 193, 124);
    pdf.line(76, 116, 76, 132);
    pdf.line(135, 116, 135, 132);
    pdf.setTextColor("#000000");
    pdf.setFont("helvetica", "bold");
    pdf.text("PAPER NAME", 46.5, 121.5, { align: "center" });
    pdf.text("Exam Date", 105.5, 121.5, { align: "center" });
    pdf.text("Exam. Time", 164, 121.5, { align: "center" });
    pdf.setFont("helvetica", "normal");
    pdf.text(card.course, 46.5, 129, { align: "center", maxWidth: 56 });
    pdf.text("3/5/2026", 105.5, 129, { align: "center" });
    pdf.setFontSize(9);
    pdf.text("02:00 pm -04:00 pm(ONLINE)", 164, 129, { align: "center", maxWidth: 55 });

    pdf.addImage(qrDataUrl, "PNG", 17, 205, 34, 34);
    pdf.setFontSize(6.6);
    pdf.setFont("helvetica", "bold");
    pdf.text("DISCLAIMER : This is a computer generated document which has been generated from student login.", 54, 225, { maxWidth: 90 });
    pdf.addImage(signatureDataUrl, "PNG", 143, 211, 45, 13);
    pdf.setFontSize(7.5);
    pdf.setFont("helvetica", "normal");
    pdf.text("Controller of Examinations", 166, 245, { align: "center" });
    pdf.setFontSize(6.5);
    pdf.text(`Downloaded on: ${downloadedOn}`, 166, 254, { align: "center" });

    pdf.save(`iem-minor-admit-card-${card.enrollmentNo}.pdf`);
}

function AdmitCardPreview({ card }) {
    const [qrDataUrl, setQrDataUrl] = useState("");

    useEffect(() => {
        let cancelled = false;
        QRCode.toDataURL(qrPayload(card), {
            width: 220,
            margin: 1,
            color: { dark: "#000000", light: "#ffffff" },
        }).then((url) => {
            if (!cancelled) setQrDataUrl(url);
        });

        return () => {
            cancelled = true;
        };
    }, [card]);

    return (
        <div className="w-full max-w-[794px] border border-black bg-white p-6 text-black shadow-[0_24px_70px_rgba(15,23,42,0.14)]">
            <div className="mb-9 grid grid-cols-[88px_1fr_88px] items-start gap-3 border-b border-slate-200 pb-4 text-center">
                <img src={LOGO_URL} alt="IEM" className="h-16 w-full object-contain" />
                <div className="min-w-0 px-2">
                    <h2 className="text-[13px] font-extrabold leading-tight tracking-wide text-[#252052] md:text-lg">
                        INSTITUTE OF ENGINEERING & MANAGEMENT (SALT LAKE)
                    </h2>
                    <p className="my-1 text-[11px] font-semibold leading-none text-[#252052]">A constituent institute of</p>
                    <h3 className="text-[13px] font-extrabold leading-tight text-[#252052] md:text-lg">
                        UNIVERSITY OF ENGINEERING AND MANAGEMENT, KOLKATA
                    </h3>
                </div>
                <img src={LOGO_URL} alt="UEM" className="h-16 w-full object-contain" />
            </div>

            <div className="mx-auto max-w-2xl space-y-1 text-sm md:text-base">
                <p><span className="inline-block w-48">Name of the Candidate:</span><span className="italic text-blue-500">{card.name}</span></p>
                <p><span className="inline-block w-48">Registration Number:</span><span className="italic text-blue-500">{card.registrationNo}</span></p>
                <p><span className="inline-block w-48">Enrollment Number:</span><span className="italic text-blue-500">{card.enrollmentNo}</span></p>
            </div>

            <p className="my-5 text-center text-sm font-medium text-blue-800">Schedule of Minor Examination</p>
            <table className="w-full table-fixed border-collapse text-center text-sm">
                <colgroup>
                    <col className="w-1/3" />
                    <col className="w-1/3" />
                    <col className="w-1/3" />
                </colgroup>
                <thead>
                    <tr>
                        <th className="border border-black px-2 py-1">PAPER NAME</th>
                        <th className="border border-black px-2 py-1">Exam Date</th>
                        <th className="border border-black px-2 py-1">Exam. Time</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border border-black px-2 py-1 break-words">{card.course}</td>
                        <td className="border border-black px-2 py-1">3/5/2026</td>
                        <td className="border border-black px-2 py-1 text-xs md:text-sm">02:00 pm -04:00 pm(ONLINE)</td>
                    </tr>
                </tbody>
            </table>

            <div className="mt-24 grid grid-cols-[112px_1fr_180px] items-end gap-5">
                {qrDataUrl ? (
                    <img src={qrDataUrl} alt="Admit card QR code" className="h-28 w-28" />
                ) : (
                    <div className="h-28 w-28 border border-black" />
                )}
                <p className="text-[10px] font-bold leading-tight">
                    DISCLAIMER : This is a computer generated document which has been generated from student login.
                </p>
                <div className="text-center text-xs">
                    <img src={SIGNATURE_URL} alt="Controller signature" className="mx-auto mb-5 h-11 w-40 object-contain" />
                    <p>Controller of Examinations</p>
                    <p className="mt-3 text-[10px]">Downloaded on: {todayLabel()}</p>
                </div>
            </div>
        </div>
    );
}

export default function IemMinorPortal() {
    const [student, setStudent] = useState(null);
    const [loginForm, setLoginForm] = useState({ enrollmentNo: "", registrationNo: "" });
    const [loginStatus, setLoginStatus] = useState("idle");
    const [loginError, setLoginError] = useState("");
    const [activeTab, setActiveTab] = useState("register");
    const [formData, setFormData] = useState({ name: "", enrollmentNo: "", course: COURSES[0] });
    const [paymentStatus, setPaymentStatus] = useState("idle");
    const [paymentMessage, setPaymentMessage] = useState("");
    const [admitCard, setAdmitCard] = useState(null);

    useEffect(() => {
        const savedStudent = window.localStorage.getItem(STORAGE_KEY);
        const savedAdmitCard = window.localStorage.getItem(ADMIT_CARD_KEY);
        if (savedStudent) {
            const parsed = JSON.parse(savedStudent);
            setStudent(parsed);
            setFormData((prev) => ({ ...prev, enrollmentNo: parsed.enrollmentNo }));
        }
        if (savedAdmitCard) setAdmitCard(JSON.parse(savedAdmitCard));
    }, []);

    const initials = useMemo(() => {
        const name = admitCard?.name || student?.enrollmentNo || "ST";
        return name.slice(0, 2).toUpperCase();
    }, [admitCard, student]);

    const handleLogin = (event) => {
        event.preventDefault();
        setLoginError("");
        setLoginStatus("checking");

        setTimeout(() => {
            if (
                loginForm.enrollmentNo === VALID_ENROLLMENT &&
                loginForm.registrationNo === VALID_REGISTRATION
            ) {
                const nextStudent = {
                    enrollmentNo: loginForm.enrollmentNo,
                    registrationNo: loginForm.registrationNo,
                };
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextStudent));
                setStudent(nextStudent);
                setFormData((prev) => ({ ...prev, enrollmentNo: nextStudent.enrollmentNo }));
                setLoginStatus("idle");
                return;
            }

            setLoginStatus("idle");
            setLoginError("Enrollment number or registration number is incorrect.");
        }, 2000);
    };

    const handleLogout = () => {
        window.localStorage.removeItem(STORAGE_KEY);
        setStudent(null);
        setLoginForm({ enrollmentNo: "", registrationNo: "" });
    };

    const handlePayment = async (event) => {
        event.preventDefault();
        setPaymentStatus("processing");
        setPaymentMessage("");

        try {
            const loaded = await loadRazorpayScript();
            if (!loaded) throw new Error("Razorpay checkout could not be loaded.");

            const orderResponse = await fetch("/.netlify/functions/iemminor-create-order", {
                method: "POST",
            });
            const order = await orderResponse.json();
            if (!orderResponse.ok) throw new Error(order.error || "Unable to create payment order.");

            const options = {
                key: order.checkoutKey || process.env.NEXT_PUBLIC_IEM_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "IEM Minor Degree",
                description: "Minor Course Registration",
                order_id: order.id,
                prefill: { name: formData.name },
                theme: { color: "#0ea5e9" },
                handler: async (response) => {
                    try {
                        const verifyResponse = await fetch("/.netlify/functions/iemminor-verify-payment", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(response),
                        });
                        const verifyJson = await verifyResponse.json();
                        if (!verifyResponse.ok) {
                            throw new Error(verifyJson.error || "Payment verification failed.");
                        }

                        const nextCard = {
                            name: formData.name,
                            enrollmentNo: formData.enrollmentNo,
                            registrationNo: student.registrationNo,
                            course: formData.course,
                            paymentId: response.razorpay_payment_id,
                        };
                        window.localStorage.setItem(ADMIT_CARD_KEY, JSON.stringify(nextCard));
                        setAdmitCard(nextCard);
                        setPaymentStatus("success");
                        setPaymentMessage("Payment successful; admit card generated.");
                        setActiveTab("admit");
                    } catch (error) {
                        setPaymentStatus("error");
                        setPaymentMessage(error.message || "Payment verification failed.");
                    }
                },
                modal: {
                    ondismiss: () => setPaymentStatus("idle"),
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.on("payment.failed", (failure) => {
                setPaymentStatus("error");
                setPaymentMessage(failure?.error?.description || "Payment failed.");
            });
            razorpay.open();
        } catch (error) {
            setPaymentStatus("error");
            setPaymentMessage(error.message || "Payment could not be started.");
        }
    };

    if (loginStatus === "checking") {
        return (
            <div className="flex min-h-[55vh] items-center justify-center">
                <div className="glass-surface-strong flex flex-col items-center rounded-[28px] px-10 py-12 text-center">
                    <Loader2 className="mb-5 animate-spin text-sky-500" size={36} />
                    <h2 className="text-xl font-bold text-slate-900">Checking with college database</h2>
                </div>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="mx-auto w-full max-w-md">
                <div className="glass-surface-strong rounded-[30px] p-8">
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                            <Lock size={28} />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-950">Student Login</h1>
                        <p className="mt-2 text-sm text-slate-600">Use enrollment number and registration number to continue.</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            value={loginForm.enrollmentNo}
                            onChange={(event) => setLoginForm((prev) => ({ ...prev, enrollmentNo: event.target.value.trim() }))}
                            placeholder="Enrollment number"
                            className="w-full rounded-full border border-sky-200 px-5 py-3 text-center text-slate-900"
                            required
                        />
                        <input
                            value={loginForm.registrationNo}
                            onChange={(event) => setLoginForm((prev) => ({ ...prev, registrationNo: event.target.value.trim() }))}
                            placeholder="Registration number"
                            type="password"
                            className="w-full rounded-full border border-sky-200 px-5 py-3 text-center text-slate-900"
                            required
                        />
                        {loginError && (
                            <div className="flex items-center gap-2 rounded-2xl bg-red-50 p-3 text-sm text-red-700">
                                <AlertCircle size={16} /> {loginError}
                            </div>
                        )}
                        <button className="w-full rounded-full bg-sky-500 px-5 py-3 font-semibold text-white transition hover:bg-sky-600">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">Minor Course Portal</p>
                    <h1 className="text-3xl font-bold text-slate-950">Student Dashboard</h1>
                </div>
                <div className="glass-chip-strong flex items-center gap-3 rounded-full px-3 py-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 font-bold text-white">
                        {initials}
                    </div>
                    <div className="pr-2 text-sm">
                        <p className="font-semibold text-slate-900">{student.enrollmentNo}</p>
                        <p className="text-xs text-slate-500">Registration: {student.registrationNo}</p>
                    </div>
                    <button onClick={handleLogout} className="rounded-full p-2 text-slate-500 hover:bg-white hover:text-red-500" title="Logout">
                        <LogOut size={18} />
                    </button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                <aside className="glass-surface-strong rounded-[28px] p-4">
                    <button
                        onClick={() => setActiveTab("register")}
                        className={`mb-3 flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left font-semibold transition ${activeTab === "register" ? "bg-sky-500 text-white" : "bg-white/60 text-slate-700 hover:bg-white"}`}
                    >
                        <GraduationCap size={20} />
                        Register for minor course(even semester)
                    </button>
                    <button
                        onClick={() => setActiveTab("admit")}
                        className={`flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left font-semibold transition ${activeTab === "admit" ? "bg-sky-500 text-white" : "bg-white/60 text-slate-700 hover:bg-white"}`}
                    >
                        <Download size={20} />
                        Download admit card
                    </button>
                </aside>

                <section className="glass-surface-strong rounded-[28px] p-5 md:p-8">
                    {activeTab === "register" ? (
                        <form onSubmit={handlePayment} className="mx-auto max-w-xl space-y-5">
                            <h2 className="text-2xl font-bold text-slate-950">Register for minor course</h2>
                            <input
                                value={formData.name}
                                onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                                placeholder="Name"
                                className="w-full rounded-full px-5 py-3"
                                required
                            />
                            <input
                                value={formData.enrollmentNo}
                                onChange={(event) => setFormData((prev) => ({ ...prev, enrollmentNo: event.target.value }))}
                                placeholder="Enrollment number"
                                className="w-full rounded-full px-5 py-3"
                                required
                            />
                            <select
                                value={formData.course}
                                onChange={(event) => setFormData((prev) => ({ ...prev, course: event.target.value }))}
                                className="w-full rounded-full px-5 py-3"
                            >
                                {COURSES.map((course) => <option key={course} value={course}>{course}</option>)}
                            </select>
                            {paymentMessage && (
                                <div className={`flex items-center gap-2 rounded-2xl p-3 text-sm ${paymentStatus === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                                    {paymentStatus === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                                    {paymentMessage}
                                </div>
                            )}
                            <button
                                disabled={paymentStatus === "processing"}
                                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-red-500 bg-white px-8 py-3 text-lg font-semibold text-slate-950 transition hover:bg-red-50 disabled:opacity-60"
                            >
                                {paymentStatus === "processing" ? <><Loader2 className="animate-spin" size={18} /> Processing...</> : "Proceed to Pay ₹1"}
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-5">
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-950">Admit Card</h2>
                                    <p className="text-sm text-slate-600">Preview and download your generated admit card.</p>
                                </div>
                                {admitCard && (
                                    <button
                                        onClick={() => downloadAdmitCard(admitCard)}
                                        className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-5 py-3 font-semibold text-white hover:bg-sky-600"
                                    >
                                        <Download size={18} /> Download PDF
                                    </button>
                                )}
                            </div>
                            {admitCard ? (
                                <AdmitCardPreview card={admitCard} />
                            ) : (
                                <div className="rounded-[24px] border border-dashed border-sky-300 bg-white/65 p-10 text-center">
                                    <User className="mx-auto mb-3 text-sky-500" size={34} />
                                    <p className="font-semibold text-slate-900">No admit card generated yet.</p>
                                    <p className="text-sm text-slate-600">Register and complete payment to generate your admit card.</p>
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
