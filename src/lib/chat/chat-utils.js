/**
 * DEV∞ Chatbot — Utilities v2
 * Session management, Firebase persistence, markdown-lite rendering, feedback
 */

import { db, isConfigValid } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs, limit, orderBy, doc, setDoc } from "firebase/firestore";

/**
 * Generate a session ID (UUID v4-like)
 */
export function createSessionId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Get or create a chat session ID from localStorage (persistent across visits)
 */
export function getSessionId() {
  if (typeof window === "undefined") return null;
  const key = "dev_chat_session_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = createSessionId();
    localStorage.setItem(key, id);
  }
  return id;
}

/**
 * Get the timestamp of last chat activity from localStorage
 */
export function getLastChatTime() {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem("dev_chat_last_time") || "0", 10);
}

/**
 * Update the last chat activity timestamp
 */
export function setLastChatTime() {
  if (typeof window === "undefined") return;
  localStorage.setItem("dev_chat_last_time", String(Date.now()));
}

/**
 * Persist a chat session to Firestore
 */
export async function saveChatSession(sessionId, messages) {
  if (!isConfigValid || !db) return;
  try {
    const coll = collection(db, "chat_sessions");
    await addDoc(coll, {
      sessionId,
      messages: messages.map((m) => ({
        role: m.role,
        text: m.text,
        timestamp: m.timestamp || Date.now(),
      })),
      createdAt: serverTimestamp(),
      lastActive: serverTimestamp(),
      status: "open",
    });
  } catch (err) {
    console.warn("Chat session save failed:", err.message);
  }
}

/**
 * Fetch the most recent chat session for the given sessionId
 */
export async function loadPreviousSession(sessionId) {
  if (!isConfigValid || !db) return null;
  try {
    const coll = collection(db, "chat_sessions");
    const q = query(coll, where("sessionId", "==", sessionId), orderBy("createdAt", "desc"), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return snap.docs[0].data();
  } catch (err) {
    console.warn("Chat session load failed:", err.message);
    return null;
  }
}

/**
 * Save a contact message collected through the chatbot
 */
export async function saveContactMessage({ name, email, message }) {
  if (!isConfigValid || !db) return false;
  try {
    const coll = collection(db, "contact_messages");
    await addDoc(coll, {
      name,
      email,
      subject: "Message via DEV∞ Chatbot",
      message,
      status: "unread",
      source: "chatbot",
      createdAt: serverTimestamp(),
    });
    return true;
  } catch (err) {
    console.warn("Chat contact save failed:", err.message);
    return false;
  }
}

/**
 * Save user feedback (thumbs up/down) on a bot response
 */
export async function saveFeedback({ sessionId, messageText, feedback, intent }) {
  if (!isConfigValid || !db) return;
  try {
    const coll = collection(db, "chat_feedback");
    await addDoc(coll, {
      sessionId,
      messageText,
      feedback, // "up" or "down"
      intent: intent || null,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn("Chat feedback save failed:", err.message);
  }
}

/**
 * Simple markdown-lite renderer for chat messages
 */
export function renderMarkdown(text) {
  if (!text) return "";
  const lines = text.split("\n");
  const elements = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) {
      if (elements.length > 0) elements.push({ type: "br", key: `br-${i}` });
      continue;
    }
    if (line.trim().startsWith("•")) {
      const content = line.trim().slice(1).trim();
      elements.push({ type: "bullet", text: content, key: `b-${i}` });
      continue;
    }
    elements.push({ type: "text", text: line, key: `t-${i}` });
  }
  return elements;
}

/**
 * Parse inline bold (**text**) into React-friendly segments
 */
export function parseInlineBold(text) {
  const parts = [];
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ bold: false, text: text.slice(lastIndex, match.index) });
    }
    parts.push({ bold: true, text: match[1] });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push({ bold: false, text: text.slice(lastIndex) });
  }
  return parts;
}
