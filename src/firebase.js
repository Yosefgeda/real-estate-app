// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-2c626.firebaseapp.com",
  projectId: "real-estate-2c626",
  storageBucket: "real-estate-2c626.appspot.com",
  messagingSenderId: "270363618222",
  appId: "1:270363618222:web:fdd125789296b659f4363f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);