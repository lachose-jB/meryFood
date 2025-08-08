// firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

/**
 * Récupère les variables d'environnement avec fallback explicite
 */
function getEnvVar(key: string, required = true): string | undefined {
  const value = import.meta.env[key];
  if (required && !value) {
    throw new Error(`❌ Variable d'environnement manquante : ${key}`);
  }
  return value;
}

// Récupération stricte
const firebaseConfig = {
  apiKey: getEnvVar("VITE_FIREBASE_API_KEY"),
  authDomain: getEnvVar("VITE_FIREBASE_AUTH_DOMAIN"),
  databaseURL: getEnvVar("VITE_FIREBASE_DATABASE_URL", false),
  projectId: getEnvVar("VITE_FIREBASE_PROJECT_ID"),
  storageBucket: getEnvVar("VITE_FIREBASE_STORAGE_BUCKET", false),
  messagingSenderId: getEnvVar("VITE_FIREBASE_MESSAGING_SENDER_ID", false),
  appId: getEnvVar("VITE_FIREBASE_APP_ID"),
  measurementId: getEnvVar("VITE_FIREBASE_MEASUREMENT_ID", false),
};

// Log safe pour debug
console.log("🔍 Variables Firebase chargées :", {
  apiKeySet: Boolean(firebaseConfig.apiKey),
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
});

// Initialisation Firebase
const app = initializeApp(firebaseConfig);

// Services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

let analytics: Analytics | undefined = undefined;
if (typeof window !== "undefined" && firebaseConfig.measurementId) {
  analytics = getAnalytics(app);
}

export { app, auth, db, analytics, storage };
