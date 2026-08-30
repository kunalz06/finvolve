/**
 * DEV∞ Chatbot — Utilities
 * Session management, Firebase persistence, markdown-lite rendering
 */

import { db, isConfigValid } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";

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
 * Get or create a chat session ID from sessionStorage
 */
export function getSessionId() {
  if (typeof window === "undefined") return null;
  const key = "dev_chat_session_id";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = createSessionId();
    sessionStorage.setItem(key, id);
  }
  return id;
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
 * Simple markdown-lite renderer for chat messages
 * Supports: **bold**, • bullet points, newlines
 */
export function renderMarkdown(text) {
  if (!text) return "";

  const lines = text.split("\n");
  const elements = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip empty lines (add spacing)
    if (!line.trim()) {
      if (elements.length > 0) {
        elements.push({ type: "br", key: `br-${i}` });
      }
      continue;
    }

    // Bullet points
    if (line.trim().startsWith("•")) {
      const content = line.trim().slice(1).trim();
      elements.push({ type: "bullet", text: content, key: `b-${i}` });
      continue;
    }

    // Regular text line with bold support
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
