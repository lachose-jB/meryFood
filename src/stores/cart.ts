import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product, Promotion } from '../types'

export interface CartItem extends Product {
  quantity: number
  originalPrice?: number
  appliedPromotion?: Promotion | null
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  // Total articles
  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  // Total prix
  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  // Total économies
  const totalSavings = computed(() =>
    items.value.reduce((sum, item) => {
      if (item.originalPrice && item.originalPrice > item.price) {
        return sum + (item.originalPrice - item.price) * item.quantity
      }
      return sum
    }, 0)
  )

  // Ajouter un produit au panier
  const addToCart = (product: Product, quantity: number = 1) => {
    if (quantity <= 0) return

    const existingItem = items.value.find(item => item.id === product.id)
    if (existingItem) {
      existingItem.quantity += quantity
      if (product.price < existingItem.price) {
        existingItem.originalPrice = existingItem.price
        existingItem.price = product.price
      }
    } else {
      items.value.push({
        ...product,
        quantity,
        originalPrice: product.price
      })
    }
  }

  // Supprimer un produit
  const removeFromCart = (productId: string) => {
    items.value = items.value.filter(item => item.id !== productId)
  }

  // Mettre à jour la quantité
  const updateQuantity = (productId: string, quantity: number) => {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      if (quantity <= 0) removeFromCart(productId)
      else item.quantity = quantity
    }
  }

  // Vider le panier
  const clearCart = () => {
    items.value = []
  }

  // === Filtres pour types de produits ===

  // Ebooks gratuits
  const freePdfItems = computed(() =>
    items.value.filter(item => item.isEbook && item.price === 0)
  )

  // Produits “nourriture”
  const foodItems = computed(() =>
    items.value.filter(item =>
      !item.isEbook &&
      ['repas', 'ingredient', 'farine', 'boisson', 'amuse-gueule'].includes(item.category)
    )
  )

  return {
    items,
    totalItems,
    totalPrice,
    totalSavings,
    freePdfItems,
    foodItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  }
})
