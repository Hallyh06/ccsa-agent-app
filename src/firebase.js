import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBzbeGwLJISzRWW9GoEhJSunv27OCjEMe0",
  authDomain: "ccsa-farmerregistration.firebaseapp.com",
  projectId: "ccsa-farmerregistration",
  storageBucket: "ccsa-farmerregistration.firebasestorage.app",
  messagingSenderId: "707354029387",
  appId: "1:707354029387:web:669b0d694e28fee4b34cce",
  measurementId: "G-L462MNHFTX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore Database
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { auth, firestore, storage };
