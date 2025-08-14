<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="font-title font-bold text-3xl mb-8">Panier</h1>

      <div v-if="cartStore.items.length === 0" class="text-center py-16">
        <div class="mb-8">
          <ShoppingBagIcon class="h-24 w-24 text-gray-300 mx-auto" />
        </div>
        <h2 class="font-title font-semibold text-xl text-gray-900 mb-4">
          Votre panier est vide
        </h2>
        <p class="text-gray-600 mb-8">
          Découvrez nos produits et ajoutez-les à votre panier
        </p>
        <router-link to="/shop" class="btn-primary">
          Continuer mes achats
        </router-link>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-2 space-y-4">
          <div 
            v-for="item in cartStore.items" 
            :key="item.id"
            class="bg-white p-6 rounded-xl shadow-sm"
          >
            <div class="flex items-center space-x-4">
              <img 
                :src="item.image" 
                :alt="item.name"
                class="w-20 h-20 object-cover rounded-lg"
              >
              <div class="flex-1">
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
                  <div v-else class="text-primary font-semibold">
                    {{ item.price.toFixed(2) }}€
                  </div>
                  <div v-if="item.appliedPromotion" class="text-xs text-green-600 mt-1">
                    🎉 {{ item.appliedPromotion.title }}
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <div class="flex items-center space-x-2">
                  <button 
                    @click="updateQuantity(item.id, item.quantity - 1)"
                    class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span class="w-8 text-center">{{ item.quantity }}</span>
                  <button 
                    @click="updateQuantity(item.id, item.quantity + 1)"
                    class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
                <button 
                  @click="removeItem(item.id)"
                  class="text-red-500 hover:text-red-700 p-1"
                >
                  <TrashIcon class="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="bg-white p-6 rounded-xl shadow-sm h-fit">
          <h3 class="font-title font-semibold text-lg mb-4">Résumé de commande</h3>
          
          <div class="space-y-3 mb-6">
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

          <!-- WhatsApp Order Button -->
          <button 
            @click="orderViaWhatsApp"
            class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 mb-4 flex items-center justify-center space-x-2"
          >
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
            <span>Commander via WhatsApp</span>
          </button>

          <!-- Info Box -->
          <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div class="flex items-start">
              <svg class="h-5 w-5 text-green-600 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              <div class="text-sm">
                <p class="font-medium text-green-800 mb-1">Commande via WhatsApp</p>
                <p class="text-green-700">
                  Votre commande sera envoyée directement à notre équipe qui vous contactera pour confirmer les détails et organiser la livraison.
                </p>
              </div>
            </div>
          </div>

          <router-link 
            to="/shop" 
            class="block text-center text-gray-600 hover:text-primary transition-colors"
          >
            Continuer mes achats
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ShoppingBagIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { useCartStore } from '../stores/cart'

const cartStore = useCartStore()

const updateQuantity = (productId: string, quantity: number) => {
  cartStore.updateQuantity(productId, quantity)
}

const removeItem = (productId: string) => {
  cartStore.removeFromCart(productId)
}

const orderViaWhatsApp = () => {
  // Créer le message de commande
  let message = "🛒 *NOUVELLE COMMANDE - Merry's Food*\n\n"
  
  cartStore.items.forEach((item, index) => {
    message += `${index + 1}. *${item.name}*\n`
    message += `   Quantité: ${item.quantity}\n`
    if (item.originalPrice && item.originalPrice > item.price) {
      message += `   Prix original: ${item.originalPrice.toFixed(2)}€\n`
      message += `   Prix réduit: ${item.price.toFixed(2)}€\n`
      message += `   Économie: ${(item.originalPrice - item.price).toFixed(2)}€ par unité\n`
    } else {
      message += `   Prix unitaire: ${item.price.toFixed(2)}€\n`
    }
    message += `   Sous-total: ${(item.price * item.quantity).toFixed(2)}€\n\n`
  })
  
  message += `💰 *RÉSUMÉ:*\n`
  message += `Sous-total: ${cartStore.totalPrice.toFixed(2)}€\n`
  if (cartStore.totalSavings > 0) {
    message += `🎉 Économies totales: ${cartStore.totalSavings.toFixed(2)}€\n`
  }
  message += `*TOTAL: ${cartStore.totalPrice.toFixed(2)}€*\n\n`
  message += `🚚 Les détails de la livraison seront confirmés par WhatsApp.\n\n`
  message += `📝 Merci de confirmer cette commande et de m'indiquer:\n`
  message += `• Votre adresse de livraison\n`
  message += `• Votre mode de paiement préféré\n`
  message += `• Toute information complémentaire\n\n`
  message += `Merci ! 😊`
  
  // Encoder le message pour l'URL
  const encodedMessage = encodeURIComponent(message)
  
  // Numéro WhatsApp (remplacer par le vrai numéro)
  const whatsappNumber = "+33782593084"
  
  // Ouvrir WhatsApp
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
  window.open(whatsappUrl, '_blank')
  
  // Optionnel: vider le panier après envoi
  setTimeout(() => {
    if (confirm('Commande envoyée ! Voulez-vous vider votre panier ?')) {
      cartStore.clearCart()
    }
  }, 1000)
}
</script>