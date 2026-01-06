import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCUxFDjQK1fDuFV0xTKrmopqOpIpzfjXw",
  authDomain: "smartschoolcontrolv1.firebaseapp.com",
  projectId: "smartschoolcontrolv1",
  storageBucket: "smartschoolcontrolv1.firebasestorage.app",
  messagingSenderId: "74188091002",
  appId: "1:74188091002:web:0db504bb7053c2dcd495c3",
  measurementId: "G-PJRQFTS344"
};

// Initialize Firebase
let app;
let auth;
let db;
let analytics;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  
  // Initialize Analytics if supported in the environment
  if (typeof window !== 'undefined') {
     analytics = getAnalytics(app);
  }
  
  console.log("Firebase initialized successfully");
} catch (error) {
  console.warn("Firebase initialization failed:", error);
}

// Export the instances so they can be used in other files
export { auth, db, analytics };
