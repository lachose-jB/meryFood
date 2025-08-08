// Configuration Firebase avec Firestore et Storage
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// On force le typage des variables d'env pour s'assurer qu'elles sont bien là
const {
  VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_DATABASE_URL,
  VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_STORAGE_BUCKET,
  VITE_FIREBASE_MESSAGING_SENDER_ID,
  VITE_FIREBASE_APP_ID,
  VITE_FIREBASE_MEASUREMENT_ID,
} = import.meta.env;

// Validation rapide
if (!VITE_FIREBASE_API_KEY || !VITE_FIREBASE_AUTH_DOMAIN || !VITE_FIREBASE_PROJECT_ID) {
  console.error('⚠️ Certaines variables Firebase semblent manquer dans .env !');
  throw new Error('Firebase configuration is incomplete. Check your environment variables.');
}

const firebaseConfig = {
  apiKey: VITE_FIREBASE_API_KEY,
  authDomain: VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: VITE_FIREBASE_DATABASE_URL,
  projectId: VITE_FIREBASE_PROJECT_ID,
  storageBucket: VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: VITE_FIREBASE_APP_ID,
  measurementId: VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialisation de l'app Firebase (une seule fois)
const app = initializeApp(firebaseConfig);

// Initialisation des services Firebase
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialisation de l'analytics uniquement côté client
let analytics: Analytics | undefined = undefined;
if (typeof window !== "undefined" && VITE_FIREBASE_MEASUREMENT_ID) {
  analytics = getAnalytics(app);
}

export { app, auth, db, analytics, storage };