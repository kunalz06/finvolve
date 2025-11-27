import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// REPLACE these values with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDy4z8yxLcJVebSPvfOml5S1d6BHO2pJas",
  authDomain: "finvolve-4a0e5.firebaseapp.com",
  projectId: "finvolve-4a0e5",
  storageBucket: "finvolve-4a0e5.firebasestorage.app",
  messagingSenderId: "230381011290",
  appId: "1:230381011290:web:056f65642a45d8aa20f363"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
