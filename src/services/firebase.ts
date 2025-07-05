// Services Firebase avec Firestore et Storage
import type { Product, BlogPost } from '../types'
import { db, storage } from '../config/firebase'
import { 
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore'
import { 
  ref as storageRef, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage'

// =====================================================
// COLLECTIONS FIRESTORE
// =====================================================
const COLLECTIONS = {
  PRODUCTS: 'products',
  BLOG_POSTS: 'blog_posts',
  BOOKINGS: 'bookings',
  ORDERS: 'orders',
  CONTACT_MESSAGES: 'contact_messages'
} as const

// =====================================================
// SERVICES PRODUITS (FIRESTORE)
// =====================================================

export const productService = {
  // Récupérer tous les produits
  async getAll(): Promise<Product[]> {
    try {
      console.log('[Firestore] Récupération des produits...')
      const productsRef = collection(db, COLLECTIONS.PRODUCTS)
      const q = query(productsRef, orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[]
      
      console.log('[Firestore] Produits récupérés:', products.length)
      return products
    } catch (error: any) {
      console.error('Erreur lors de la récupération des produits:', error)
      
      if (error?.code === 'permission-denied') {
        console.error('PERMISSION DENIED: Vérifiez les règles de sécurité Firestore')
        throw new Error('Accès refusé aux données des produits. Vérifiez la configuration Firebase.')
      }
      
      return []
    }
  },

  // Récupérer un produit par ID
  async getById(id: string): Promise<Product | null> {
    try {
      console.log('[Firestore] Récupération du produit:', id)
      const productRef = doc(db, COLLECTIONS.PRODUCTS, id)
      const snapshot = await getDoc(productRef)
      
      if (snapshot.exists()) {
        const product = {
          id: snapshot.id,
          ...snapshot.data()
        } as Product
        console.log('[Firestore] Produit trouvé:', product)
        return product
      }
      console.log('[Firestore] Produit non trouvé:', id)
      return null
    } catch (error: any) {
      console.error('Erreur lors de la récupération du produit:', error)
      
      if (error?.code === 'permission-denied') {
        console.error('PERMISSION DENIED: Vérifiez les règles de sécurité Firestore')
        throw new Error('Accès refusé aux données du produit. Vérifiez la configuration Firebase.')
      }
      
      return null
    }
  },

  // Récupérer produits par catégorie
  async getByCategory(category: string): Promise<Product[]> {
    try {
      console.log('[Firestore] Récupération par catégorie:', category)
      const productsRef = collection(db, COLLECTIONS.PRODUCTS)
      const q = query(
        productsRef, 
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(q)
      
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[]
      
      console.log('[Firestore] Produits par catégorie récupérés:', products.length)
      return products
    } catch (error: any) {
      console.error('Erreur lors de la récupération par catégorie:', error)
      
      if (error?.code === 'permission-denied') {
        console.error('PERMISSION DENIED: Vérifiez les règles de sécurité Firestore')
        throw new Error('Accès refusé aux données des produits. Vérifiez la configuration Firebase.')
      }
      
      return []
    }
  },

  // Ajouter un produit
  async add(product: Omit<Product, 'id'>): Promise<string | null> {
    try {
      console.log('[Firestore] Ajout d\'un nouveau produit:', product)
      const productsRef = collection(db, COLLECTIONS.PRODUCTS)
      
      const productData = {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      
      const docRef = await addDoc(productsRef, productData)
      
      console.log('[Firestore] Produit ajouté avec succès:', docRef.id)
      return docRef.id
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout du produit:', error)
      
      if (error?.code === 'permission-denied') {
        console.error('PERMISSION DENIED: Authentification requise pour ajouter des produits')
        throw new Error('Authentification requise pour ajouter des produits.')
      }
      
      throw error
    }
  },

  // Mettre à jour un produit
  async update(id: string, updates: Partial<Product>): Promise<boolean> {
    try {
      console.log('[Firestore] Mise à jour du produit:', id, updates)
      const productRef = doc(db, COLLECTIONS.PRODUCTS, id)
      await updateDoc(productRef, {
        ...updates,
        updatedAt: serverTimestamp()
      })
      
      console.log('[Firestore] Produit mis à jour avec succès:', id)
      return true
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du produit:', error)
      
      if (error?.code === 'permission-denied') {
        console.error('PERMISSION DENIED: Authentification requise pour modifier des produits')
        throw new Error('Authentification requise pour modifier des produits.')
      }
      
      return false
    }
  },

  // Supprimer un produit
  async delete(id: string): Promise<boolean> {
    try {
      console.log('[Firestore] Suppression du produit:', id)
      const productRef = doc(db, COLLECTIONS.PRODUCTS, id)
      await deleteDoc(productRef)
      
      console.log('[Firestore] Produit supprimé avec succès:', id)
      return true
    } catch (error: any) {
      console.error('Erreur lors de la suppression du produit:', error)
      
      if (error?.code === 'permission-denied') {
        console.error('PERMISSION DENIED: Authentification requise pour supprimer des produits')
        throw new Error('Authentification requise pour supprimer des produits.')
      }
      
      return false
    }
  }
}

// =====================================================
// SERVICES BLOG (FIRESTORE)
// =====================================================

export const blogService = {
  // Récupérer tous les articles
  async getAll(): Promise<BlogPost[]> {
    try {
      console.log('[Firestore] Récupération des articles...')
      const postsRef = collection(db, COLLECTIONS.BLOG_POSTS)
      const q = query(postsRef, orderBy('date', 'desc'))
      const snapshot = await getDocs(q)
      
      const posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BlogPost[]
      
      console.log('[Firestore] Articles récupérés:', posts.length)
      return posts
    } catch (error: any) {
      console.error('Erreur lors de la récupération des articles:', error)
      
      if (error?.code === 'permission-denied') {
        console.error('PERMISSION DENIED: Vérifiez les règles de sécurité Firestore pour blog_posts')
        throw new Error('Accès refusé aux articles du blog. Vérifiez la configuration Firebase.')
      }
      
      return []
    }
  },

  // Récupérer un article par ID
  async getById(id: string): Promise<BlogPost | null> {
    try {
      console.log('[Firestore] Récupération de l\'article:', id)
      const postRef = doc(db, COLLECTIONS.BLOG_POSTS, id)
      const snapshot = await getDoc(postRef)
      
      if (snapshot.exists()) {
        const post = {
          id: snapshot.id,
          ...snapshot.data()
        } as BlogPost
        console.log('[Firestore] Article trouvé:', post)
        return post
      }
      console.log('[Firestore] Article non trouvé:', id)
      return null
    } catch (error: any) {
      console.error('Erreur lors de la récupération de l\'article:', error)
      
      if (error?.code === 'permission-denied') {
        console.error('PERMISSION DENIED: Vérifiez les règles de sécurité Firestore')
        throw new Error('Accès refusé à l\'article. Vérifiez la configuration Firebase.')
      }
      
      return null
    }
  },

  // Récupérer articles par tag
  async getByTag(tag: string): Promise<BlogPost[]> {
    try {
      console.log('[Firestore] Récupération par tag:', tag)
      const postsRef = collection(db, COLLECTIONS.BLOG_POSTS)
      const q = query(
        postsRef, 
        where('tags', 'array-contains', tag),
        orderBy('date', 'desc')
      )
      const snapshot = await getDocs(q)
      
      const posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BlogPost[]
      
      console.log('[Firestore] Articles par tag récupérés:', posts.length)
      return posts
    } catch (error: any) {
      console.error('Erreur lors de la récupération par tag:', error)
      
      if (error?.code === 'permission-denied') {
        console.error('PERMISSION DENIED: Vérifiez les règles de sécurité Firestore')
        throw new Error('Accès refusé aux articles. Vérifiez la configuration Firebase.')
      }
      
      return []
    }
  },

  // Ajouter un article
  async add(article: Omit<BlogPost, 'id'>): Promise<string | null> {
    try {
      console.log('[Firestore] Ajout d\'un nouvel article:', article)
      const postsRef = collection(db, COLLECTIONS.BLOG_POSTS)
      
      const articleData = {
        ...article,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      
      const docRef = await addDoc(postsRef, articleData)
      
      console.log('[Firestore] Article ajouté avec succès:', docRef.id)
      return docRef.id
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout de l\'article:', error)
      
      if (error?.code === 'permission-denied') {
        console.error('PERMISSION DENIED: Authentification requise pour ajouter des articles')
        throw new Error('Authentification requise pour ajouter des articles.')
      }
      
      throw error
    }
  },

  // Mettre à jour un article
  async update(id: string, updates: Partial<BlogPost>): Promise<boolean> {
    try {
      console.log('[Firestore] Mise à jour de l\'article:', id, updates)
      const postRef = doc(db, COLLECTIONS.BLOG_POSTS, id)
      await updateDoc(postRef, {
        ...updates,
        updatedAt: serverTimestamp()
      })
      
      console.log('[Firestore] Article mis à jour avec succès:', id)
      return true
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour de l\'article:', error)
      
      if (error?.code === 'permission-denied') {
        console.error('PERMISSION DENIED: Authentification requise pour modifier des articles')
        throw new Error('Authentification requise pour modifier des articles.')
      }
      
      return false
    }
  },

  // Supprimer un article
  async delete(id: string): Promise<boolean> {
    try {
      console.log('[Firestore] Suppression de l\'article:', id)
      const postRef = doc(db, COLLECTIONS.BLOG_POSTS, id)
      await deleteDoc(postRef)
      
      console.log('[Firestore] Article supprimé avec succès:', id)
      return true
    } catch (error: any) {
      console.error('Erreur lors de la suppression de l\'article:', error)
      
      if (error?.code === 'permission-denied') {
        console.error('PERMISSION DENIED: Authentification requise pour supprimer des articles')
        throw new Error('Authentification requise pour supprimer des articles.')
      }
      
      return false
    }
  }
}

// =====================================================
// SERVICES CONSULTATIONS (FIRESTORE)
// =====================================================

export interface Booking {
  id?: string
  name: string
  email: string
  phone: string
  date: string
  time: string
  message?: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export const bookingService = {
  // Récupérer toutes les réservations
  async getAll(): Promise<Booking[]> {
    try {
      console.log('[Firestore] Récupération des réservations...')
      const bookingsRef = collection(db, COLLECTIONS.BOOKINGS)
      const q = query(bookingsRef, orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      
      const bookings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Booking[]
      
      console.log('[Firestore] Réservations récupérées:', bookings.length)
      return bookings
    } catch (error: any) {
      console.error('Erreur lors de la récupération des réservations:', error)
      
      if (error?.code === 'permission-denied') {
        console.error('PERMISSION DENIED: Authentification requise pour voir les réservations')
        throw new Error('Authentification requise pour accéder aux réservations.')
      }
      
      return []
    }
  },

  // Ajouter une réservation
  async add(booking: Omit<Booking, 'id'>): Promise<string | null> {
    try {
      console.log('[Firestore] Ajout d\'une nouvelle réservation:', booking)
      const bookingsRef = collection(db, COLLECTIONS.BOOKINGS)
      
      const bookingData = {
        ...booking,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      
      const docRef = await addDoc(bookingsRef, bookingData)
      
      console.log('[Firestore] Réservation ajoutée avec succès:', docRef.id)
      return docRef.id
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout de la réservation:', error)
      
      if (error?.code === 'permission-denied') {
        console.error('PERMISSION DENIED: Impossible d\'ajouter la réservation')
        throw new Error('Impossible d\'enregistrer la réservation. Vérifiez la configuration Firebase.')
      }
      
      throw error
    }
  },

  // Mettre à jour une réservation
  async update(id: string, updates: Partial<Booking>): Promise<boolean> {
    try {
      console.log('[Firestore] Mise à jour de la réservation:', id, updates)
      const bookingRef = doc(db, COLLECTIONS.BOOKINGS, id)
      await updateDoc(bookingRef, {
        ...updates,
        updatedAt: serverTimestamp()
      })
      
      console.log('[Firestore] Réservation mise à jour avec succès:', id)
      return true
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour de la réservation:', error)
      
      if (error?.code === 'permission-denied') {
        console.error('PERMISSION DENIED: Authentification requise pour modifier les réservations')
        throw new Error('Authentification requise pour modifier les réservations.')
      }
      
      return false
    }
  }
}

// =====================================================
// SERVICES COMMANDES (FIRESTORE)
// =====================================================

export interface Order {
  id?: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  items: Array<{
    productId: string
    productName: string
    quantity: number
    price: number
  }>
  totalAmount: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  whatsappSent?: boolean
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export const orderService = {
  // Récupérer toutes les commandes
  async getAll(): Promise<Order[]> {
    try {
      console.log('[Firestore] Récupération des commandes...')
      const ordersRef = collection(db, COLLECTIONS.ORDERS)
      const q = query(ordersRef, orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[]
      
      console.log('[Firestore] Commandes récupérées:', orders.length)
      return orders
    } catch (error: any) {
      console.error('Erreur lors de la récupération des commandes:', error)
      
      if (error?.code === 'permission-denied') {
        console.error('PERMISSION DENIED: Authentification requise pour voir les commandes')
        throw new Error('Authentification requise pour accéder aux commandes.')
      }
      
      return []
    }
  },

  // Ajouter une commande
  async add(order: Omit<Order, 'id'>): Promise<string | null> {
    try {
      console.log('[Firestore] Ajout d\'une nouvelle commande:', order)
      const ordersRef = collection(db, COLLECTIONS.ORDERS)
      
      const orderData = {
        ...order,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      
      const docRef = await addDoc(ordersRef, orderData)
      
      console.log('[Firestore] Commande ajoutée avec succès:', docRef.id)
      return docRef.id
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout de la commande:', error)
      
      if (error?.code === 'permission-denied') {
        console.error('PERMISSION DENIED: Impossible d\'ajouter la commande')
        throw new Error('Impossible d\'enregistrer la commande. Vérifiez la configuration Firebase.')
      }
      
      throw error
    }
  },

  // Mettre à jour une commande
  async update(id: string, updates: Partial<Order>): Promise<boolean> {
    try {
      console.log('[Firestore] Mise à jour de la commande:', id, updates)
      const orderRef = doc(db, COLLECTIONS.ORDERS, id)
      await updateDoc(orderRef, {
        ...updates,
        updatedAt: serverTimestamp()
      })
      
      console.log('[Firestore] Commande mise à jour avec succès:', id)
      return true
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour de la commande:', error)
      
      if (error?.code === 'permission-denied') {
        console.error('PERMISSION DENIED: Authentification requise pour modifier les commandes')
        throw new Error('Authentification requise pour modifier les commandes.')
      }
      
      return false
    }
  }
}

// =====================================================
// SERVICES MESSAGES DE CONTACT (FIRESTORE)
// =====================================================

export interface ContactMessage {
  id?: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  subject: string
  message: string
  status: 'new' | 'read' | 'replied' | 'closed'
  createdAt?: Timestamp
}

export const contactService = {
  // Récupérer tous les messages
  async getAll(): Promise<ContactMessage[]> {
    try {
      console.log('[Firestore] Récupération des messages...')
      const messagesRef = collection(db, COLLECTIONS.CONTACT_MESSAGES)
      const q = query(messagesRef, orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ContactMessage[]
      
      console.log('[Firestore] Messages récupérés:', messages.length)
      return messages
    } catch (error: any) {
      console.error('Erreur lors de la récupération des messages:', error)
      
      if (error?.code === 'permission-denied') {
        console.error('PERMISSION DENIED: Authentification requise pour voir les messages')
        throw new Error('Authentification requise pour accéder aux messages.')
      }
      
      return []
    }
  },

  // Ajouter un message
  async add(message: Omit<ContactMessage, 'id'>): Promise<string | null> {
    try {
      console.log('[Firestore] Ajout d\'un nouveau message:', message)
      const messagesRef = collection(db, COLLECTIONS.CONTACT_MESSAGES)
      
      const messageData = {
        ...message,
        createdAt: serverTimestamp()
      }
      
      const docRef = await addDoc(messagesRef, messageData)
      
      console.log('[Firestore] Message ajouté avec succès:', docRef.id)
      return docRef.id
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout du message:', error)
      
      if (error?.code === 'permission-denied') {
        console.error('PERMISSION DENIED: Impossible d\'ajouter le message')
        throw new Error('Impossible d\'envoyer le message. Vérifiez la configuration Firebase.')
      }
      
      throw error
    }
  }
}

// =====================================================
// VALIDATION DES FICHIERS SIMPLIFIÉE
// =====================================================

interface FileValidationOptions {
  maxSize?: number // en bytes
  allowedTypes?: string[]
}

const DEFAULT_VALIDATION_OPTIONS: FileValidationOptions = {
  maxSize: 2 * 1024 * 1024, // 2 MB
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
}

export const validateImageFile = async (file: File, options: FileValidationOptions = {}): Promise<void> => {
  const opts = { ...DEFAULT_VALIDATION_OPTIONS, ...options }
  
  // Vérification de la présence du fichier
  if (!file) {
    throw new Error('Aucun fichier sélectionné')
  }
  
  // Vérification de la taille
  if (opts.maxSize && file.size > opts.maxSize) {
    const maxSizeMB = (opts.maxSize / (1024 * 1024)).toFixed(1)
    throw new Error(`Image trop volumineuse (max ${maxSizeMB} Mo)`)
  }
  
  // Vérification du type MIME
  if (opts.allowedTypes && !opts.allowedTypes.includes(file.type)) {
    const allowedExtensions = opts.allowedTypes.map(type => type.split('/')[1]).join(', ')
    throw new Error(`Format d'image non supporté. Formats acceptés: ${allowedExtensions}`)
  }
}

// =====================================================
// SERVICE D'UPLOAD D'IMAGES AVEC STORAGE
// =====================================================

export const uploadImage = async (
  file: File, 
  folder: string = 'images',
  validationOptions?: FileValidationOptions
): Promise<string> => {
  try {
    console.log('[Firebase Storage] Début de l\'upload:', file.name, 'dans le dossier:', folder)
    
    // Validation du fichier (taille et format uniquement)
    await validateImageFile(file, validationOptions)
    console.log('[Firebase Storage] Validation du fichier réussie')
    
    // Génération d'un nom de fichier unique et sécurisé
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `${folder}_${timestamp}_${randomString}.${fileExtension}`
    
    console.log('[Firebase Storage] Nom de fichier généré:', fileName)
    
    // Création de la référence Storage
    const imageRef = storageRef(storage, `${folder}/${fileName}`)
    console.log('[Firebase Storage] Référence créée:', imageRef.fullPath)
    
    // Métadonnées pour l'upload
    const metadata = {
      contentType: file.type,
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
        size: file.size.toString()
      }
    }
    
    // Upload avec timeout
    const uploadPromise = uploadBytes(imageRef, file, metadata)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout: Upload trop long (30s)')), 30000)
    })
    
    const uploadResult = await Promise.race([uploadPromise, timeoutPromise]) as any
    console.log('[Firebase Storage] Upload terminé:', uploadResult.metadata.fullPath)
    
    // Récupération de l'URL de téléchargement
    const downloadURL = await getDownloadURL(imageRef)
    console.log('[Firebase Storage] URL de téléchargement obtenue:', downloadURL)
    
    return downloadURL
    
  } catch (error: any) {
    console.error('Erreur lors de l\'upload de l\'image:', error)
    
    // Gestion spécifique des erreurs Firebase Storage
    if (error?.code === 'storage/unauthorized') {
      throw new Error('Authentification requise pour uploader des images')
    }
    
    if (error?.code === 'storage/invalid-format') {
      throw new Error('Format d\'image non supporté')
    }
    
    if (error?.code === 'storage/quota-exceeded') {
      throw new Error('Quota de stockage dépassé')
    }
    
    if (error?.code === 'storage/invalid-checksum') {
      throw new Error('Fichier corrompu lors de l\'upload')
    }
    
    if (error?.code === 'storage/canceled') {
      throw new Error('Upload annulé')
    }
    
    if (error?.code === 'storage/unknown') {
      throw new Error('Erreur inconnue lors de l\'upload')
    }
    
    // Si c'est une erreur de validation, on la propage telle quelle
    if (error.message.includes('trop volumineuse') || 
        error.message.includes('non supporté')) {
      throw error
    }
    
    // Erreur générique
    throw new Error('Erreur lors de l\'upload: ' + (error.message || 'Erreur inconnue'))
  }
}

// =====================================================
// FONCTIONS UTILITAIRES POUR L'UPLOAD
// =====================================================

// Upload spécialisé pour les produits
export const uploadProductImage = async (file: File): Promise<string> => {
  return uploadImage(file, 'products', {
    maxSize: 2 * 1024 * 1024, // 2 MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  })
}

// Upload spécialisé pour les articles de blog
export const uploadBlogImage = async (file: File): Promise<string> => {
  return uploadImage(file, 'blog', {
    maxSize: 3 * 1024 * 1024, // 3 MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  })
}