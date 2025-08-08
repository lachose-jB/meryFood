// Configuration Firebase avec Firestore et Storage
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


// Typage et extraction des variables d'env
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

// Log safe pour vérifier la récupération des variables d'env (sans afficher les secrets)
console.log("🔍 Variables Firebase chargées depuis .env :", {
  apiKeySet: Boolean(VITE_FIREBASE_API_KEY),
  authDomain: VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: VITE_FIREBASE_DATABASE_URL,
  projectId: VITE_FIREBASE_PROJECT_ID,
  storageBucket: VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: VITE_FIREBASE_APP_ID,
  measurementId: VITE_FIREBASE_MEASUREMENT_ID,
});

// Fonction de validation stricte des variables essentielles
function validateEnv() {
  const requiredVars = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_DATABASE_URL",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
  "VITE_FIREBASE_MEASUREMENT_ID",
];
  const missingVars = requiredVars.filter((v) => !(import.meta.env[v]));
  if (missingVars.length) {
    console.error(`❌ Variables d'environnement Firebase manquantes : ${missingVars.join(", ")}`);
    throw new Error("Configuration Firebase invalide : variables manquantes");
  }
}
validateEnv();

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

console.log("🔎 Variables Firebase en prod :", {
  apiKeySet: Boolean(import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
});

// Initialisation de l'app Firebase (unique)
const app = initializeApp(firebaseConfig);

// Initialisation des services Firebase
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialisation conditionnelle d'Analytics côté client uniquement
let analytics: Analytics | undefined = undefined;
if (typeof window !== "undefined" && VITE_FIREBASE_MEASUREMENT_ID) {
  analytics = getAnalytics(app);
}

export { app, auth, db, analytics, storage };