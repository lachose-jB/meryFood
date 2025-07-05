<template>
  <div class="card overflow-hidden group cursor-pointer" @click="goToProduct">
    <div class="relative overflow-hidden">
      <img :src="product.image" :alt="product.name" class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300">
      <div class="absolute top-3 right-3">
        <span v-else-if="product.category === 'ebook'" class="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
          E-book
        </span>
        <span 
          v-else-if="product.category === 'program'" 
          class="bg-purple-500 text-white text-xs px-2 py-1 rounded-full"
        >
          Programme
        </span>
        <span 
          v-else-if="product.category === 'repas'" 
          class="bg-green-500 text-white text-xs px-2 py-1 rounded-full"
        >
          Repas
        </span>
        <span 
          v-else-if="product.category === 'ingredient'" 
          class="bg-orange-500 text-white text-xs px-2 py-1 rounded-full"
        >
          Ingrédient
        </span>
        <span 
          v-else-if="product.category === 'farine'" 
          class="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full"
        >
          Farine
        </span>
        <span 
          v-else-if="product.category === 'boisson'" 
          class="bg-cyan-500 text-white text-xs px-2 py-1 rounded-full"
        >
          Boisson
        </span>
        <span 
          v-else
          class="bg-gray-500 text-white text-xs px-2 py-1 rounded-full"
        >
          Produit
        </span>
      </div>
    </div>

    <div class="p-6">
      <h3 class="font-title font-semibold text-lg mb-2 text-gray-900">
        {{ product.name }}
      </h3>
      <p class="text-gray-600 text-sm mb-4 line-clamp-2">
        {{ product.description }}
      </p>

      <div class="flex items-center mb-4" v-if="product.rating">
        <div class="flex items-center">
          <span class="text-yellow-400 text-sm">★</span>
          <span class="ml-1 text-sm text-gray-600">
            {{ product.rating }} ({{ product.reviews }})
          </span>
        </div>
      </div>

      <div class="flex items-center justify-between">
        <div class="text-2xl font-bold text-primary">
          {{ product.price.toFixed(2) }}€
        </div>
        <div class="flex space-x-2">
          <button 
            @click.stop="addToCart"
            class="btn-primary py-2 px-4 text-sm"
            :disabled="!product.inStock"
          >
            {{ product.inStock ? 'Ajouter' : 'Rupture' }}
          </button>
          <button 
            @click.stop="orderViaWhatsApp"
            class="bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm transition-colors flex items-center"
            title="Commander via WhatsApp"
          >
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import type { Product } from '../types'

interface Props {
  product: Product
}

const props = defineProps<Props>()
const router = useRouter()
const cartStore = useCartStore()

const goToProduct = () => {
  router.push(`/product/${props.product.id}`)
}

const addToCart = () => {
  if (props.product.inStock) {
    cartStore.addToCart(props.product)
  }
}

const orderViaWhatsApp = () => {
  const message = `🛒 *Commande Produit - Merry's Food*\n\n` +
    `*${props.product.name}*\n` +
    `Prix: ${props.product.price.toFixed(2)}€\n` +
    `Description: ${props.product.description}\n\n` +
    `Je souhaiterais commander ce produit. Pouvez-vous me donner plus d'informations sur la disponibilité et la livraison ?\n\n` +
    `Merci ! 😊`
  
  const encodedMessage = encodeURIComponent(message)
  const whatsappNumber = "33123456789"
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
  
  window.open(whatsappUrl, '_blank')
}
</script>