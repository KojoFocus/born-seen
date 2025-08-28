// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBJCE58ktitaoqq2a8rVW0X7yVueC_7Ck0",
  authDomain: "born-seen.firebaseapp.com",
  projectId: "born-seen",
  storageBucket: "born-seen.firebasestorage.app",
  messagingSenderId: "41987728284",
  appId: "1:41987728284:web:551893c28fef8af5991e59",
  measurementId: "G-MCTSGYFYR3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
