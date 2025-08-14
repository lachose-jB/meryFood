import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product } from '../types'
import type { Promotion } from '../types'

export interface CartItem extends Product {
  quantity: number
  originalPrice?: number
  appliedPromotion?: Promotion | null
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const totalItems = computed(() => 
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const totalPrice = computed(() => 
    items.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  )

  const totalSavings = computed(() => 
    items.value.reduce((sum, item) => {
      if (item.originalPrice && item.originalPrice > item.price) {
        return sum + ((item.originalPrice - item.price) * item.quantity)
      }
      return sum
    }, 0)
  )

  const addToCart = (product: Product, quantity: number = 1) => {
    const existingItem = items.value.find(item => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.value.push({ ...product, quantity })
    }
  }

  const removeFromCart = (productId: string) => {
    const index = items.value.findIndex(item => item.id === productId)
    if (index > -1) {
      items.value.splice(index, 1)
    }
  }

  const updateQuantity = (productId: string, quantity: number) => {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId)
      } else {
        item.quantity = quantity
      }
    }
  }

  const clearCart = () => {
    items.value = []
  }

  return {
    items,
    totalItems,
    totalPrice,
    totalSavings,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  }
})