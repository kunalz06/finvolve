"use client";

import { useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword, onIdTokenChanged, sendEmailVerification,
    sendPasswordResetEmail, signInWithEmailAndPassword, signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { courseApiUrl } from "@/lib/api";
import styles from "./course.module.css";

export function useCourseAccount() {
    const [session, setSession] = useState(() => ({ loading: Boolean(auth), user: null, verified: false }));

    useEffect(() => {
        if (!auth) return;
        return onIdTokenChanged(auth, (user) => {
            setSession({ loading: false, user, verified: Boolean(user?.emailVerified) });
        });
    }, []);

    return session;
}

export async function courseRequest(user, action, payload) {
    const token = await user.getIdToken();
    const response = await fetch(courseApiUrl(), {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action, ...payload }),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok || !data) throw new Error(data?.error || "The course portal is temporarily unavailable.");
    return data;
}

export async function uploadCourseFile(user, action, file, fields) {
    const mime = file.type === "application/x-zip-compressed" ? "application/zip" : file.type || ({ pdf: "application/pdf", zip: "application/zip", txt: "text/plain", mp4: "video/mp4", webm: "video/webm" })[file.name.split(".").at(-1).toLowerCase()];
    if (!mime) throw new Error("This file type is unsupported.");
    const signed = await courseRequest(user, action, { ...fields, mime, size: file.size });
    const result = await fetch(signed.url, { method: "PUT", headers: signed.headers, body: file });
    if (!result.ok) throw new Error("The file upload failed. Try again.");
    return { path: signed.path, name: file.name.slice(0, 160) };
}

export function Notice({ error, message }) {
    if (!error && !message) return null;
    return <p className={styles.banner} role={error ? "alert" : "status"}>{error || message}</p>;
}

export function SignOut() {
    return <button type="button" className={styles.secondary} onClick={() => signOut(auth)}>Sign out</button>;
}

function authError(error) {
    const messages = {
        "auth/invalid-credential": "The email or password is incorrect.",
        "auth/weak-password": "Choose a stronger password.",
        "auth/email-already-in-use": "An account already uses this email. Sign in or reset your password.",
        "auth/too-many-requests": "Too many attempts. Please try again later.",
        "auth/network-request-failed": "Check your connection and try again.",
        "auth/operation-not-allowed": "Email sign-in is temporarily unavailable.",
    };
    return messages[error.code] || "The account service could not complete your request. Try again.";
}

export function AccountForm({ beginWithEnrollment = false, admin = false }) {
    const [mode, setMode] = useState(beginWithEnrollment && !admin ? "signup" : "login");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [busy, setBusy] = useState(false);

    const title = mode === "signup" ? "Create your student account" : mode === "reset" ? "Reset your password" : admin ? "Administrator sign in" : "Student Login";
    const action = mode === "signup" ? "Create account" : mode === "reset" ? "Send reset link" : "Sign in";

    function changeMode(next) {
        setMode(next);
        setError("");
        setMessage("");
    }

    async function submit(event) {
        event.preventDefault();
        if (!auth) return;
        const password = new FormData(event.currentTarget).get("password");
        setBusy(true);
        setError("");
        setMessage("");
        try {
            if (mode === "signup") {
                const { user } = await createUserWithEmailAndPassword(auth, email.trim(), password);
                await sendEmailVerification(user);
            } else if (mode === "reset") {
                await sendPasswordResetEmail(auth, email.trim()).catch((err) => {
                    if (err.code !== "auth/user-not-found") throw err;
                });
                setMessage("If an account exists for this email, you’ll receive a password reset link.");
            } else {
                await signInWithEmailAndPassword(auth, email.trim(), password);
            }
        } catch (err) {
            setError(authError(err));
        } finally {
            setBusy(false);
        }
    }

    return <section className={`${styles.panel} ${styles.narrow}`}>
        <h1>{title}</h1>
        <Notice error={error || (!auth ? "Account services are unavailable in this environment." : "")} message={message} />
        <form className={styles.fields} onSubmit={submit}>
            <label>Email address<input name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
            {mode !== "reset" && <label>Password<input key={mode} name="password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} required minLength={mode === "signup" ? 8 : undefined} /></label>}
            <div><button className={styles.primary} disabled={busy || !auth}>{busy ? "Please wait…" : action}</button></div>
        </form>
        <div className={styles.actions}>
            {mode !== "login" && <button className={styles.secondary} type="button" onClick={() => changeMode("login")}>Sign in</button>}
            {!admin && mode !== "signup" && <button className={styles.secondary} type="button" onClick={() => changeMode("signup")}>Create an account</button>}
            {mode === "login" && <button className={styles.secondary} type="button" onClick={() => changeMode("reset")}>Forgot your password?</button>}
        </div>
    </section>;
}

export function VerifyEmail({ user }) {
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [busy, setBusy] = useState(false);

    async function confirm(resend) {
        setBusy(true);
        setError("");
        setMessage("");
        try {
            if (resend) {
                await sendEmailVerification(user);
                setMessage("Verification email sent.");
            } else {
                await user.reload();
                await user.getIdToken(true);
                if (!user.emailVerified) setMessage("Use the link in your email first, then check again.");
            }
        } catch (err) {
            setError(authError(err));
        } finally {
            setBusy(false);
        }
    }

    return <section className={`${styles.panel} ${styles.narrow}`}>
        <h1>Verify your email</h1>
        <p>Use the verification link sent to <strong>{user.email}</strong> to continue.</p>
        <Notice error={error} message={message} />
        <div className={styles.actions}>
            <button className={styles.primary} disabled={busy} onClick={() => confirm(false)}>I’ve verified my email</button>
            <button className={styles.secondary} disabled={busy} onClick={() => confirm(true)}>Resend email</button>
            <SignOut />
        </div>
    </section>;
}

export function useCourseActions(user) {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    async function run(work) {
        setBusy(true);
        setError("");
        setMessage("");
        try {
            await work((action, payload) => courseRequest(user, action, payload));
        } catch (err) {
            setError(err.message);
        } finally {
            setBusy(false);
        }
    }

    return { busy, error, message, setMessage, run };
}

export function openFile(url) {
    const link = document.createElement("a");
    link.href = url;
    link.rel = "noopener noreferrer";
    link.target = "_blank";
    link.click();
}
