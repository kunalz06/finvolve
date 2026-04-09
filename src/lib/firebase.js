import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Check if all required config values are present (not undefined, not empty, and not placeholder values)
const isConfigValid = Object.values(firebaseConfig).every(val => {
  if (val === undefined || val === '' || val === null) return false;
  // Check for placeholder values like "your_firebase_api_key_here"
  if (typeof val === 'string' && val.toLowerCase().includes('your_')) return false;
  return true;
});

// Debug logging in development
if (typeof window !== 'undefined' && !isConfigValid) {
  const missing = Object.entries(firebaseConfig)
    .filter(([key, val]) => !val || (typeof val === 'string' && val.toLowerCase().includes('your_')))
    .map(([key]) => key);
  console.warn(`Firebase config incomplete. Missing/invalid: ${missing.join(', ')}`);
}

let app = null;
let db = null;
let storage = null;
let auth = null;

if (isConfigValid) {
  try {
    // Initialize Firebase
    app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    db = getFirestore(app);
    storage = getStorage(app);
    auth = getAuth(app);
    if (typeof window !== 'undefined') {
      console.log("Firebase initialized successfully");
    }
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
} else {
  console.warn("Firebase configuration is incomplete. Please update your .env.local file with valid Firebase credentials.");
}

export { db, storage, auth, isConfigValid };
