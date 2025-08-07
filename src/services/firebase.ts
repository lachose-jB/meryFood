// Services Firebase avec Firestore et Storage
import type { Product, BlogPost } from '../types'
import type { Promotion } from '../types'
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
  Timestamp,
  serverTimestamp
} from 'firebase/firestore'
import { 
  ref as storageRef, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage'

const COLLECTIONS = {
  PRODUCTS: 'products',
  BLOG_POSTS: 'blog_posts',
  BOOKINGS: 'bookings',
  ORDERS: 'orders',
  CONTACT_MESSAGES: 'contact_messages'
} as const

export const productService = {
  async getAll(): Promise<Product[]> {
    try {
      const productsRef = collection(db, COLLECTIONS.PRODUCTS)
      const q = query(productsRef, orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[]
      
      return products
    } catch (error: any) {
      if (error?.code === 'permission-denied') {
        throw new Error('Accès refusé aux données des produits. Vérifiez la configuration Firebase.')
      }
      
      return []
    }
  },

  async getById(id: string): Promise<Product | null> {
    try {
      const productRef = doc(db, COLLECTIONS.PRODUCTS, id)
      const snapshot = await getDoc(productRef)
      
      if (snapshot.exists()) {
        const product = {
          id: snapshot.id,
          ...snapshot.data()
        } as Product
        return product
      }
      return null
    } catch (error: any) {
      if (error?.code === 'permission-denied') {
        throw new Error('Accès refusé aux données du produit. Vérifiez la configuration Firebase.')
      }
      
      return null
    }
  },

  async getByCategory(category: string): Promise<Product[]> {
    try {
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
      
      return products
    } catch (error: any) {
      if (error?.code === 'permission-denied') {
        throw new Error('Accès refusé aux données des produits. Vérifiez la configuration Firebase.')
      }
      
      return []
    }
  },

  async add(product: Omit<Product, 'id'>): Promise<string | null> {
    try {
      const productsRef = collection(db, COLLECTIONS.PRODUCTS)
      
      const productData = {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      
      const docRef = await addDoc(productsRef, productData)
      
      return docRef.id
    } catch (error: any) {
      if (error?.code === 'permission-denied') {
        throw new Error('Authentification requise pour ajouter des produits.')
      }
      
      throw error
    }
  },

  async update(id: string, updates: Partial<Product>): Promise<boolean> {
    try {
      const productRef = doc(db, COLLECTIONS.PRODUCTS, id)
      await updateDoc(productRef, {
        ...updates,
        updatedAt: serverTimestamp()
      })
      
      return true
    } catch (error: any) {
      if (error?.code === 'permission-denied') {
        throw new Error('Authentification requise pour modifier des produits.')
      }
      
      return false
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      const productRef = doc(db, COLLECTIONS.PRODUCTS, id)
      await deleteDoc(productRef)
      
      return true
    } catch (error: any) {
      if (error?.code === 'permission-denied') {
        throw new Error('Authentification requise pour supprimer des produits.')
      }
      
      return false
    }
  }
}

export const blogService = {
  async getAll(): Promise<BlogPost[]> {
    try {
      const postsRef = collection(db, COLLECTIONS.BLOG_POSTS)
      const q = query(postsRef, orderBy('date', 'desc'))
      const snapshot = await getDocs(q)
      
      const posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BlogPost[]
      
      return posts
    } catch (error: any) {
      if (error?.code === 'permission-denied') {
        throw new Error('Accès refusé aux articles du blog. Vérifiez la configuration Firebase.')
      }
      
      return []
    }
  },

  async getById(id: string): Promise<BlogPost | null> {
    try {
      const postRef = doc(db, COLLECTIONS.BLOG_POSTS, id)
      const snapshot = await getDoc(postRef)
      
      if (snapshot.exists()) {
        const post = {
          id: snapshot.id,
          ...snapshot.data()
        } as BlogPost
        return post
      }
      return null
    } catch (error: any) {
      if (error?.code === 'permission-denied') {
        throw new Error('Accès refusé à l\'article. Vérifiez la configuration Firebase.')
      }
      
      return null
    }
  },

  async getByTag(tag: string): Promise<BlogPost[]> {
    try {
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
      
      return posts
    } catch (error: any) {
      if (error?.code === 'permission-denied') {
        throw new Error('Accès refusé aux articles. Vérifiez la configuration Firebase.')
      }
      
      return []
    }
  },

  async add(article: Omit<BlogPost, 'id'>): Promise<string | null> {
    try {
      const postsRef = collection(db, COLLECTIONS.BLOG_POSTS)
      
      const articleData = {
        ...article,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      
      const docRef = await addDoc(postsRef, articleData)
      
      return docRef.id
    } catch (error: any) {
      if (error?.code === 'permission-denied') {
        throw new Error('Authentification requise pour ajouter des articles.')
      }
      
      throw error
    }
  },

  async update(id: string, updates: Partial<BlogPost>): Promise<boolean> {
    try {
      const postRef = doc(db, COLLECTIONS.BLOG_POSTS, id)
      await updateDoc(postRef, {
        ...updates,
        updatedAt: serverTimestamp()
      })
      
      return true
    } catch (error: any) {
      if (error?.code === 'permission-denied') {
        throw new Error('Authentification requise pour modifier des articles.')
      }
      
      return false
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      const postRef = doc(db, COLLECTIONS.BLOG_POSTS, id)
      await deleteDoc(postRef)
      
      return true
    } catch (error: any) {
      if (error?.code === 'permission-denied') {
        throw new Error('Authentification requise pour supprimer des articles.')
      }
      
      return false
    }
  }
}

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
  async getAll(): Promise<Booking[]> {
    try {
      const bookingsRef = collection(db, COLLECTIONS.BOOKINGS)
      const q = query(bookingsRef, orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      
      const bookings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Booking[]
      
      return bookings
    } catch (error: any) {
      if (error?.code === 'permission-denied') {
        throw new Error('Authentification requise pour accéder aux réservations.')
      }
      
      return []
    }
  },

  async add(booking: Omit<Booking, 'id'>): Promise<string | null> {
    try {
      const bookingsRef = collection(db, COLLECTIONS.BOOKINGS)
      
      const bookingData = {
        ...booking,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      
      const docRef = await addDoc(bookingsRef, bookingData)
      
      return docRef.id
    } catch (error: any) {
      if (error?.code === 'permission-denied') {
        throw new Error('Impossible d\'enregistrer la réservation. Vérifiez la configuration Firebase.')
      }
      
      throw error
    }
  },

  async update(id: string, updates: Partial<Booking>): Promise<boolean> {
    try {
      const bookingRef = doc(db, COLLECTIONS.BOOKINGS, id)
      await updateDoc(bookingRef, {
        ...updates,
        updatedAt: serverTimestamp()
      })
      
      return true
    } catch (error: any) {
      if (error?.code === 'permission-denied') {
        throw new Error('Authentification requise pour modifier les réservations.')
      }
      
      return false
    }
  }
}

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
  async getAll(): Promise<Order[]> {
    try {
      const ordersRef = collection(db, COLLECTIONS.ORDERS)
      const q = query(ordersRef, orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[]
      
      return orders
    } catch (error: any) {
      if (error?.code === 'permission-denied') {
        throw new Error('Authentification requise pour accéder aux commandes.')
      }
      
      return []
    }
  },

  async add(order: Omit<Order, 'id'>): Promise<string | null> {
    try {
      const ordersRef = collection(db, COLLECTIONS.ORDERS)
      
      const orderData = {
        ...order,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      
      const docRef = await addDoc(ordersRef, orderData)
      
      return docRef.id
    } catch (error: any) {
      if (error?.code === 'permission-denied') {
        throw new Error('Impossible d\'enregistrer la commande. Vérifiez la configuration Firebase.')
      }
      
      throw error
    }
  },

  async update(id: string, updates: Partial<Order>): Promise<boolean> {
    try {
      const orderRef = doc(db, COLLECTIONS.ORDERS, id)
      await updateDoc(orderRef, {
        ...updates,
        updatedAt: serverTimestamp()
      })
      
      return true
    } catch (error: any) {
      if (error?.code === 'permission-denied') {
        throw new Error('Authentification requise pour modifier les commandes.')
      }
      
      return false
    }
  }
}

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
  async getAll(): Promise<ContactMessage[]> {
    try {
      const messagesRef = collection(db, COLLECTIONS.CONTACT_MESSAGES)
      const q = query(messagesRef, orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ContactMessage[]
      
      return messages
    } catch (error: any) {
      if (error?.code === 'permission-denied') {
        throw new Error('Authentification requise pour accéder aux messages.')
      }
      
      return []
    }
  },

  async add(message: Omit<ContactMessage, 'id'>): Promise<string | null> {
    try {
      const messagesRef = collection(db, COLLECTIONS.CONTACT_MESSAGES)
      
      const messageData = {
        ...message,
        createdAt: serverTimestamp()
      }
      
      const docRef = await addDoc(messagesRef, messageData)
      
      return docRef.id
    } catch (error: any) {
      if (error?.code === 'permission-denied') {
        throw new Error('Impossible d\'envoyer le message. Vérifiez la configuration Firebase.')
      }
      
      throw error
    }
  }
}

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

export const uploadImage = async (
  file: File, 
  folder: string = 'images',
  validationOptions?: FileValidationOptions
): Promise<string> => {
  try {
    await validateImageFile(file, validationOptions)
    
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `${folder}_${timestamp}_${randomString}.${fileExtension}`
    
    const imageRef = storageRef(storage, `${folder}/${fileName}`)
    
    const metadata = {
      contentType: file.type,
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
        size: file.size.toString()
      }
    }
    
    const uploadPromise = uploadBytes(imageRef, file, metadata)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout: Upload trop long (30s)')), 30000)
    })
    
    await Promise.race([uploadPromise, timeoutPromise])
    
    const downloadURL = await getDownloadURL(imageRef)
    
    return downloadURL
    
  } catch (error: any) {
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
    
    if (error.message.includes('trop volumineuse') || 
        error.message.includes('non supporté')) {
      throw error
    }
    
    throw new Error('Erreur lors de l\'upload: ' + (error.message || 'Erreur inconnue'))
  }
}

export const uploadProductImage = async (file: File): Promise<string> => {
  return uploadImage(file, 'products', {
    maxSize: 2 * 1024 * 1024, // 2 MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  })
}

export const uploadBlogImage = async (file: File): Promise<string> => {
  return uploadImage(file, 'blog', {
    maxSize: 3 * 1024 * 1024, // 3 MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  })
}

export const promotionService = {
  async getAll(): Promise<Promotion[]> {
    const ref = collection(db, 'promotions')
    const q = query(ref, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Promotion))
  },

  async getActive(): Promise<Promotion[]> {
    const now = new Date()
    const ref = collection(db, 'promotions')
    const q = query(
      ref,
      where('validUntil', '>=', now),
      orderBy('validUntil', 'asc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Promotion))
  },

  async getById(id: string): Promise<Promotion | null> {
    const docRef = doc(db, 'promotions', id)
    const snapshot = await getDoc(docRef)
    if (!snapshot.exists()) return null
    return { id: snapshot.id, ...snapshot.data() } as Promotion
  },

  async add(promotion: Omit<Promotion, 'id'>): Promise<string> {
    const ref = collection(db, 'promotions')
    const docRef = await addDoc(ref, {
      ...promotion,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return docRef.id
  },

  async update(id: string, updates: Partial<Promotion>): Promise<boolean> {
    const docRef = doc(db, 'promotions', id)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })
    return true
  },

  async delete(id: string): Promise<boolean> {
    const docRef = doc(db, 'promotions', id)
    await deleteDoc(docRef)
    return true
  }
}

export const uploadPromotionImage = async (file: File): Promise<string> => {
  return uploadImage(file, 'promotions', {
    maxSize: 2 * 1024 * 1024, // 2 MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  })
}
