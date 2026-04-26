"use client";

import { useEffect, useMemo, useState } from "react";
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

function escapePdfText(value) {
    return String(value || "").replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function createAdmitCardPdf(card) {
    const lines = [
        "BT /F2 15 Tf 62 760 Td (INSTITUTE OF ENGINEERING & MANAGEMENT \\(SALT LAKE\\)) Tj ET",
        "BT /F2 11 Tf 182 742 Td (A constituent institute of) Tj ET",
        "BT /F2 15 Tf 128 724 Td (UNIVERSITY OF ENGINEERING AND MANAGEMENT, KOLKATA) Tj ET",
        "0.72 w 60 710 m 535 710 l S",
        `BT /F1 12 Tf 70 652 Td (Name of the Candidate:) Tj ET BT /F3 12 Tf 230 652 Td (${escapePdfText(card.name)}) Tj ET`,
        `BT /F1 12 Tf 70 632 Td (Registration Number:) Tj ET BT /F3 12 Tf 230 632 Td (${escapePdfText(card.registrationNo)}) Tj ET`,
        `BT /F1 12 Tf 70 612 Td (Enrollment Number:) Tj ET BT /F3 12 Tf 230 612 Td (${escapePdfText(card.enrollmentNo)}) Tj ET`,
        "BT /F3 12 Tf 222 582 Td (Schedule of Minor Examination) Tj ET",
        "0.72 w 60 560 m 535 560 l 535 528 l 60 528 l h S",
        "60 544 m 535 544 l S 205 560 m 205 528 l S 370 560 m 370 528 l S",
        "BT /F2 11 Tf 105 548 Td (PAPER NAME) Tj ET",
        "BT /F2 11 Tf 268 548 Td (Exam Date) Tj ET",
        "BT /F2 11 Tf 423 548 Td (Exam. Time) Tj ET",
        `BT /F1 10 Tf 104 534 Td (${escapePdfText(card.course)}) Tj ET`,
        "BT /F1 10 Tf 279 534 Td (3/5/2026) Tj ET",
        "BT /F1 10 Tf 389 534 Td (02:00 pm -04:00 pm\\(ONLINE\\)) Tj ET",
        "0.72 w 70 172 m 156 172 l 156 86 l 70 86 l h S",
        "BT /F1 7 Tf 84 128 Td (QR CODE) Tj ET",
        "BT /F2 6 Tf 172 150 Td (DISCLAIMER : This is a computer generated document which has been generated from student login.) Tj ET",
        "BT /F3 13 Tf 432 144 Td (Debika Bhattacharyya) Tj ET",
        "BT /F1 8 Tf 446 98 Td (Controller of Examinations) Tj ET",
        `BT /F1 7 Tf 456 80 Td (Downloaded on: ${escapePdfText(card.downloadedOn)}) Tj ET`,
    ];

    const stream = lines.join("\n");
    const objects = [
        "<< /Type /Catalog /Pages 2 0 R >>",
        "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R /F3 6 0 R >> >> /Contents 7 0 R >>",
        "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
        "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
        "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique >>",
        `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    ];

    let pdf = "%PDF-1.4\n";
    const offsets = [0];
    objects.forEach((object, index) => {
        offsets.push(pdf.length);
        pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
    });
    const xrefOffset = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    offsets.slice(1).forEach((offset) => {
        pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
    });
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
    return new Blob([pdf], { type: "application/pdf" });
}

function downloadAdmitCard(card) {
    const blob = createAdmitCardPdf({ ...card, downloadedOn: todayLabel() });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `iem-minor-admit-card-${card.enrollmentNo}.pdf`;
    anchor.click();
    URL.revokeObjectURL(url);
}

function AdmitCardPreview({ card }) {
    return (
        <div className="w-full max-w-3xl bg-white p-6 text-black shadow-[0_24px_70px_rgba(15,23,42,0.14)]">
            <div className="mb-8 flex items-start justify-center gap-5 border-b pb-4 text-center">
                <img src="/iem-logo.png" alt="IEM" className="h-14 w-20 object-contain" />
                <div>
                    <h2 className="text-sm font-extrabold tracking-wide text-slate-800 md:text-lg">
                        INSTITUTE OF ENGINEERING & MANAGEMENT (SALT LAKE)
                    </h2>
                    <p className="text-xs font-semibold text-slate-700">A constituent institute of</p>
                    <h3 className="text-sm font-extrabold text-slate-800 md:text-lg">
                        UNIVERSITY OF ENGINEERING AND MANAGEMENT, KOLKATA
                    </h3>
                </div>
                <img src="/iem-logo.png" alt="UEM" className="h-14 w-20 object-contain" />
            </div>

            <div className="mx-auto max-w-2xl space-y-1 text-sm md:text-base">
                <p><span className="inline-block w-48">Name of the Candidate:</span><span className="italic text-blue-500">{card.name}</span></p>
                <p><span className="inline-block w-48">Registration Number:</span><span className="italic text-blue-500">{card.registrationNo}</span></p>
                <p><span className="inline-block w-48">Enrollment Number:</span><span className="italic text-blue-500">{card.enrollmentNo}</span></p>
            </div>

            <p className="my-5 text-center text-sm font-medium text-blue-800">Schedule of Minor Examination</p>
            <table className="w-full border-collapse text-center text-sm">
                <thead>
                    <tr>
                        <th className="border border-black px-2 py-1">PAPER NAME</th>
                        <th className="border border-black px-2 py-1">Exam Date</th>
                        <th className="border border-black px-2 py-1">Exam. Time</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border border-black px-2 py-1">{card.course}</td>
                        <td className="border border-black px-2 py-1">3/5/2026</td>
                        <td className="border border-black px-2 py-1">02:00 pm -04:00 pm(ONLINE)</td>
                    </tr>
                </tbody>
            </table>

            <div className="mt-24 flex items-end justify-between gap-6">
                <div className="flex h-28 w-28 items-center justify-center border border-black text-center text-xs font-bold">
                    QR<br />CODE
                </div>
                <p className="flex-1 text-[10px] font-bold">
                    DISCLAIMER : This is a computer generated document which has been generated from student login.
                </p>
                <div className="text-center text-xs">
                    <p className="mb-8 font-[cursive] text-base text-blue-800">Debika Bhattacharyya</p>
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
