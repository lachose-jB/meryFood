<template>
  <!-- Chargement -->
  <div v-if="loading" class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p class="text-gray-500">Chargement du produit...</p>
    </div>
  </div>

  <!-- Produit introuvable -->
  <div v-else-if="!product" class="min-h-screen flex items-center justify-center">
    <p class="text-gray-500">Produit non trouvé.</p>
  </div>

  <!-- Produit -->
  <div v-else class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Breadcrumb -->
      <nav class="mb-8">
        <ol class="flex items-center space-x-2 text-sm">
          <li><router-link to="/" class="text-gray-500 hover:text-primary">Accueil</router-link></li>
          <li class="text-gray-300">/</li>
          <li><router-link to="/shop" class="text-gray-500 hover:text-primary">Boutique</router-link></li>
          <li class="text-gray-300">/</li>
          <li class="text-gray-900">{{ product.name }}</li>
        </ol>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Image -->
        <div class="space-y-4">
          <div class="aspect-square bg-white rounded-xl overflow-hidden shadow-sm">
            <img :src="product.image" :alt="product.name" class="w-full h-full object-cover" />
          </div>
        </div>

        <!-- Infos -->
        <div class="space-y-6">
          <!-- Catégorie et nom -->
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span v-if="product.category === 'ebook'" class="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">E-book numérique</span>
              <span v-else-if="product.category === 'program'" class="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">Programme complet</span>
              <span v-else-if="product.category === 'repas'" class="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Repas</span>
              <span v-else-if="product.category === 'ingredient'" class="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">Ingrédient</span>
              <span v-else-if="product.category === 'farine'" class="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">Farine</span>
              <span v-else-if="product.category === 'boisson'" class="bg-cyan-500 text-white text-xs px-2 py-1 rounded-full">Boisson</span>
              <span v-else-if="product.category === 'amuse-gueule'" class="bg-pink-500 text-white text-xs px-2 py-1 rounded-full">Amuse-gueule</span>
            </div>
            <h1 class="font-title font-bold text-3xl text-gray-900">{{ product.name }}</h1>
          </div>

          <!-- Note et avis -->
          <div v-if="product.rating" class="flex items-center space-x-2">
            <div class="flex items-center">
              <span class="text-yellow-400">★★★★★</span>
              <span class="ml-2 text-gray-600">{{ product.rating }}/5</span>
            </div>
            <span class="text-gray-400">•</span>
            <span class="text-gray-600">{{ product.reviews }} avis</span>
          </div>

          <!-- Description -->
          <p class="text-gray-600 text-lg leading-relaxed">{{ product.description }}</p>

          <!-- Description étendue selon catégorie -->
          <div class="prose prose-sm max-w-none">
            <div v-if="product.category === 'ebook'">
              <h3 class="font-title font-semibold text-lg">Contenu du guide</h3>
              <ul class="list-disc list-inside space-y-1">
                <li>50+ recettes équilibrées et savoureuses</li>
                <li>Plans de repas personnalisables</li>
                <li>Conseils nutritionnels d'experts</li>
                <li>Guide des superaliments</li>
              </ul>
            </div>
            <div v-else-if="product.category === 'program'">
              <h3 class="font-title font-semibold text-lg">Programme complet</h3>
              <ul class="list-disc list-inside space-y-1">
                <li>21 jours de menus détaillés</li>
                <li>Liste de courses hebdomadaires</li>
                <li>Exercices et activités quotidiennes</li>
                <li>Suivi personnalisé avec notre équipe</li>
              </ul>
            </div>
            <div v-else-if="product.category === 'repas'">
              <h3 class="font-title font-semibold text-lg">Informations nutritionnelles</h3>
              <ul class="list-disc list-inside space-y-1">
                <li>Repas équilibré et savoureux</li>
                <li>Ingrédients frais et de qualité</li>
                <li>Conseils de préparation inclus</li>
                <li>Valeurs nutritionnelles détaillées</li>
              </ul>
            </div>
            <div v-else-if="product.category === 'ingredient'">
              <h3 class="font-title font-semibold text-lg">Utilisation et bienfaits</h3>
              <ul class="list-disc list-inside space-y-1">
                <li>Ingrédient naturel de qualité premium</li>
                <li>Conseils d'utilisation en cuisine</li>
                <li>Propriétés nutritionnelles</li>
                <li>Conservation et stockage</li>
              </ul>
            </div>
            <div v-else-if="product.category === 'amuse-gueule'">
              <h3 class="font-title font-semibold text-lg">Amuse-gueule raffiné</h3>
              <ul class="list-disc list-inside space-y-1">
                <li>Bouchées savoureuses et équilibrées</li>
                <li>Parfait pour l'apéritif ou les collations</li>
                <li>Ingrédients frais et de qualité</li>
                <li>Présentation soignée et élégante</li>
              </ul>
            </div>
          </div>

          <!-- Prix et actions -->
          <div class="bg-white p-6 rounded-xl shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <div class="text-3xl font-bold text-primary">{{ product.price.toFixed(2) }}€</div>
              <div class="text-sm text-gray-500">{{ product.inStock ? 'En stock' : 'Rupture de stock' }}</div>
            </div>

            <div class="flex items-center space-x-4 mb-4">
              <label class="text-sm font-medium">Quantité:</label>
              <div class="flex items-center space-x-2">
                <button @click="quantity > 1 && quantity--" class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50" :disabled="quantity <= 1">-</button>
                <span class="w-8 text-center">{{ quantity }}</span>
                <button @click="quantity++" class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">+</button>
              </div>
            </div>

            <div class="space-y-3">
              <button @click="addToCart" class="w-full btn-primary" :disabled="!product.inStock">{{ product.inStock ? 'Ajouter au panier' : 'Produit indisponible' }}</button>

              <button v-if="product.category === 'ebook'" @click="openDownloadModal" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Télécharger l'e-book</span>
              </button>

              <button @click="orderViaWhatsApp" class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                <span>Commander via WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <EbookDownloadModal 
      v-if="showDownloadModal && product" 
      :products="[product]"
      @close="closeDownloadModal" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useProductStore } from '../stores/products'
import type { Product } from '../types'
import EbookDownloadModal from '../components/EbookDownloadModal.vue'

const route = useRoute()
const cartStore = useCartStore()
const productStore = useProductStore()
const quantity = ref(1)
const product = ref<Product | null>(null)
const showDownloadModal = ref(false)
const loading = ref(true)

const openDownloadModal = () => showDownloadModal.value = true
const closeDownloadModal = () => showDownloadModal.value = false

const addToCart = () => {
  if (!product.value || !product.value.inStock || quantity.value < 1) return
  cartStore.addToCart(product.value as Product, quantity.value)
  quantity.value = 1
  alert(`${product.value.name} ajouté au panier !`)
}

const orderViaWhatsApp = () => {
  if (!product.value || quantity.value < 1) return

  const message = `🛒 *Commande Produit - Merry's Food*\n\n` +
    `*${product.value.name}*\n` +
    `Quantité: ${quantity.value}\n` +
    `Prix unitaire: ${product.value.price.toFixed(2)}€\n` +
    `Total: ${(product.value.price * quantity.value).toFixed(2)}€\n\n` +
    `Description: ${product.value.description}\n\n` +
    `Je souhaiterais commander ce produit. Pouvez-vous me confirmer la disponibilité et me donner les informations de livraison ?\n\nMerci ! 😊`

  const encodedMessage = encodeURIComponent(message)
  const whatsappNumber = "+33782593084"
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
  window.open(whatsappUrl, '_blank')
}

onMounted(async () => {
  const productId = route.params.id as string
  if (productId) {
    product.value = await productStore.getProductById(productId)
  }
  loading.value = false
})
</script>
