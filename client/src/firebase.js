// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "thehorizon-a7d84.firebaseapp.com",
    projectId: "thehorizon-a7d84",
    storageBucket: "thehorizon-a7d84.appspot.com",
    messagingSenderId: "307261884792",
    appId: "1:307261884792:web:38c173f534b567c00c608d"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);