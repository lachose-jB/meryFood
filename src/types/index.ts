import type { Timestamp } from 'firebase/firestore'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: 'ebook' | 'program' | 'repas' | 'ingredient' | 'farine' | 'boisson' | 'amuse-gueule'
  inStock: boolean
  rating?: number
  reviews?: number
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  image: string
  author: string
  date: string
  readTime: string
  tags: string[]
}

export interface Promotion {
  id?: string
  title: string
  description: string
  discount: number         // ici c’est un nombre, pas une variable
  image?: string
  promoCode?: string
  validFrom?: string
  validUntil: string
  isActive: boolean
  createdAt?: Timestamp
  updatedAt?: Timestamp
}
