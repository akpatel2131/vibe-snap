// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAGo_UKEM0u5Fy0ET9n3xHPlkjBYhUvtvg",
  authDomain: "vibe-snap-7ae03.firebaseapp.com",
  projectId: "vibe-snap-7ae03",
  storageBucket: "vibe-snap-7ae03.firebasestorage.app",
  messagingSenderId: "36605024174",
  appId: "1:36605024174:web:6600dd575c596532431a3f",
  measurementId: "G-0WDMN5J7DC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth , db }
