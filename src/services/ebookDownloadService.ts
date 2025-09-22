// src/services/ebookDownloadService.ts
import emailjs from "@emailjs/browser";

// 👉 Ajoute ces imports pour Firestore
import { db} from '../config/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

const {
  VITE_EMAILJS_SERVICE,
  VITE_EMAILJS_TEMPLATE,
  VITE_EMAILJS_PUBLIC,
} = import.meta.env;

const SERVICE_ID = VITE_EMAILJS_SERVICE;
const TEMPLATE_ID = VITE_EMAILJS_TEMPLATE;
const PUBLIC_KEY = VITE_EMAILJS_PUBLIC;

export const ebookDownloadService = {
  async sendEbooksByEmail({
    email,
    products,
  }: {
    email: string;
    products: { name: string; pdfUrl: string }[];
  }) {
    // On génère une liste HTML avec les liens
    const ebooks_html = products
      .map(
        (p) => `
          <a href="${p.pdfUrl}" 
            style="display:inline-block;margin:8px 0;padding:10px 16px;
                    background:#16a34a;color:#fff;text-decoration:none;
                    border-radius:6px;font-weight:bold;"
            target="_blank">
            📥 Télécharger "${p.name}"
          </a><br/>
        `
      )
      .join("");

    const templateParams = {
      to_email: email,
      ebooks_html,  
    };

    try {
      const result = await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        templateParams,
        PUBLIC_KEY
      );
      console.log("✅ Email envoyé:", result.text);
      return { success: true };
    } catch (error) {
      console.error("❌ Erreur EmailJS:", error);
      throw error;
    }
  },

  // 👉 Ajoute ce service pour enregistrer l'email dans Firestore
  async registerEmail(email: string) {
    try {
      await addDoc(collection(db, 'ebook_emails'), {
        email,
        createdAt: serverTimestamp(),
      });
      console.log('✅ Email enregistré dans Firestore');
    } catch (e) {
      console.error('❌ Erreur enregistrement email Firestore:', e);
    }
  }
};
