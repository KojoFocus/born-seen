// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBJCE58ktitaoqq2a8rVW0X7yVueC_7Ck0",
  authDomain: "born-seen.firebaseapp.com",
  projectId: "born-seen",
  storageBucket: "born-seen.firebasestorage.app",
  messagingSenderId: "41987728284",
  appId: "1:41987728284:web:551893c28fef8af5991e59",
  measurementId: "G-MCTSGYFYR3",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
