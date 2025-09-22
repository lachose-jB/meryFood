<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="font-title font-bold text-3xl mb-8">Panier</h1>

      <!-- Panier vide -->
      <div v-if="cartStore.items.length === 0" class="text-center py-16">
        <ShoppingBagIcon class="h-24 w-24 text-gray-300 mx-auto mb-8" />
        <h2 class="font-title font-semibold text-xl text-gray-900 mb-4">Votre panier est vide</h2>
        <p class="text-gray-600 mb-8">Découvrez nos produits et ajoutez-les à votre panier</p>
        <router-link to="/shop" class="btn-primary">Continuer mes achats</router-link>
      </div>

      <!-- Panier avec produits -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-2 space-y-4">
          <div 
            v-for="item in cartStore.items" 
            :key="item.id"
            class="bg-white p-6 rounded-xl shadow-sm flex items-center space-x-4"
          >
            <img :src="item.image" :alt="item.name" class="w-24 h-24 object-cover rounded-lg" />
            
            <div class="flex-1 flex flex-col justify-between">
              <div>
                <h3 class="font-title font-semibold text-lg">{{ item.name }}</h3>
                <p class="text-gray-600 text-sm">{{ item.description }}</p>
                <div class="mt-2">
                  <div v-if="item.originalPrice && item.originalPrice > item.price" class="flex items-center space-x-2">
                    <span class="text-sm line-through text-gray-400">{{ item.originalPrice.toFixed(2) }}€</span>
                    <span class="text-primary font-semibold">{{ item.price.toFixed(2) }}€</span>
                    <span class="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                      -{{ Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) }}%
                    </span>
                  </div>
                  <div v-else class="text-primary font-semibold">{{ item.price.toFixed(2) }}€</div>
                  <div v-if="item.appliedPromotion" class="text-xs text-green-600 mt-1">
                    🎉 {{ item.appliedPromotion.title }}
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-between mt-4">
                <!-- Quantity -->
                <div class="flex items-center space-x-2">
                  <button @click="updateQuantity(item.id, item.quantity - 1)"
                          class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">-</button>
                  <span class="w-8 text-center">{{ item.quantity }}</span>
                  <button @click="updateQuantity(item.id, item.quantity + 1)"
                          class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">+</button>
                </div>

                <!-- Remove -->
                <button @click="removeItem(item.id)" class="text-red-500 hover:text-red-700 p-1">
                  <TrashIcon class="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="bg-white p-6 rounded-xl shadow-sm flex flex-col space-y-4 h-fit">
          <h3 class="font-title font-semibold text-lg">Résumé de commande</h3>

          <div class="space-y-3">
            <div class="flex justify-between">
              <span>Sous-total ({{ cartStore.totalItems }} articles)</span>
              <span>{{ cartStore.totalPrice.toFixed(2) }}€</span>
            </div>
            <div v-if="cartStore.totalSavings > 0" class="flex justify-between text-green-600">
              <span>Économies (promotions)</span>
              <span>-{{ cartStore.totalSavings.toFixed(2) }}€</span>
            </div>
            <div class="flex justify-between">
              <span>Livraison</span>
              <span class="italic text-gray-500">Détails via WhatsApp</span>
            </div>
            <div class="border-t pt-3">
              <div class="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span class="text-primary">{{ cartStore.totalPrice.toFixed(2) }}€</span>
              </div>
              <div v-if="cartStore.totalSavings > 0" class="text-sm text-green-600 text-right">
                Vous économisez {{ cartStore.totalSavings.toFixed(2) }}€ !
              </div>
            </div>
          </div>

          <!-- Boutons conditionnels -->
          <div class="mt-4 space-y-2">
            <button v-if="onlyFreeEbooks || mixedItems" @click="openDownloadModal"
                    class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200">
              {{ freePdfButtonText }}
            </button>
            <button v-if="onlyPaidItems || mixedItems" @click="orderViaWhatsApp"
                    class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200">
              Commander via WhatsApp
            </button>
          </div>

          <!-- Modal PDF -->
          <EbookDownloadModal v-if="showDownloadModal" :products="freePdfItems" @close="closeDownloadModal" />

          <!-- Info Box WhatsApp -->
          <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <div class="flex items-start">
              <svg class="h-5 w-5 text-green-600 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-..."/>
              </svg>
              <div class="text-sm">
                <p class="font-medium text-green-800 mb-1">Commande via WhatsApp</p>
                <p class="text-green-700">
                  Votre commande sera envoyée directement à notre équipe qui vous contactera pour confirmer les détails et organiser la livraison.
                </p>
              </div>
            </div>
          </div>

          <router-link to="/shop" class="block text-center text-gray-600 hover:text-primary transition-colors">
            Continuer mes achats
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ShoppingBagIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { useCartStore } from '../stores/cart'
import EbookDownloadModal from '../components/EbookDownloadModal.vue'

const cartStore = useCartStore()

// Modal
const showDownloadModal = ref(false)
const openDownloadModal = () => showDownloadModal.value = true
const closeDownloadModal = () => showDownloadModal.value = false

// Produits filtrés
const freePdfItems = computed(() => cartStore.freePdfItems)
const paidItems = computed(() => cartStore.foodItems)

// Logique des boutons
const onlyFreeEbooks = computed(() => freePdfItems.value.length > 0 && paidItems.value.length === 0)
const onlyPaidItems = computed(() => paidItems.value.length > 0 && freePdfItems.value.length === 0)
const mixedItems = computed(() => freePdfItems.value.length > 0 && paidItems.value.length > 0)

const freePdfButtonText = computed(() => {
  const count = freePdfItems.value.length
  return `Télécharger ${count} PDF${count > 1 ? 's' : ''} gratuit${count > 1 ? 's' : ''}`
})

const updateQuantity = (productId: string, quantity: number) => {
  cartStore.updateQuantity(productId, quantity)
}

const removeItem = (productId: string) => {
  cartStore.removeFromCart(productId)
}

const orderViaWhatsApp = () => {
  const itemsToOrder = paidItems.value
  if (!itemsToOrder.length) return

  let message = "🛒 *NOUVELLE COMMANDE - Merry's Food*\n\n"
  itemsToOrder.forEach((item, index) => {
    message += `${index + 1}. *${item.name}*\n   Quantité: ${item.quantity}\n   Prix unitaire: ${item.price.toFixed(2)}€\n   Sous-total: ${(item.price * item.quantity).toFixed(2)}€\n\n`
  })
  message += `*TOTAL: ${itemsToOrder.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2)}€*\n\n`

  const encodedMessage = encodeURIComponent(message)
  const whatsappNumber = "+33782593084"
  window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank')
}
</script>
