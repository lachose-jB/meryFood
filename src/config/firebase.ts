// Configuration Firebase avec Firestore et Storage
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Configuration Firebase de votre projet
const firebaseConfig = {
  apiKey: "AIzaSyAkUVZCn_J5cK94fOHrtsaJGHj927i-4YI",
  authDomain: "merrysfood.firebaseapp.com",
  databaseURL: "https://merrysfood-default-rtdb.firebaseio.com",
  projectId: "merrysfood",
  storageBucket: "merrysfood.firebasestorage.app",
  messagingSenderId: "757980349429",
  appId: "1:757980349429:web:df2e25a13acfa21f0d56bc",
  measurementId: "G-687EP3HMBV"
};

// Initialisation de l'app Firebase
const app = initializeApp(firebaseConfig);

// Initialisation des services Firebase
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialisation de l'analytics uniquement côté client (navigateur)
let analytics: Analytics | undefined = undefined;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, auth, db, analytics, storage };