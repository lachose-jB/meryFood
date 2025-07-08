<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-nature-50 to-secondary py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-8 animate-fade-in">
            <h1 class="font-title font-bold text-4xl lg:text-6xl text-gray-900 leading-tight">
              Votre santé commence dans votre 
              <span class="text-primary">assiette</span>
            </h1>
            <p class="text-xl text-gray-600 leading-relaxed">
              Découvrez une approche personnalisée de la nutrition avec nos consultations 
              d'experts et nos produits naturels sélectionnés.
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
              <router-link to="/consultation" class="btn-primary text-center">
                Prendre rendez-vous
              </router-link>
              <router-link to="/shop" class="btn-secondary text-center">
                Découvrir la boutique
              </router-link>
            </div>
          </div>
          <div class="animate-slide-up">
            <img 
              src="/public/hero.jpeg" 
              alt="Nutrition saine"
              class="rounded-2xl shadow-xl w-full h-96 object-cover"
            >
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="font-title font-bold text-3xl lg:text-4xl text-gray-900 mb-4">
            Pourquoi choisir Mery's Food ?
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Une approche complète et personnalisée pour transformer votre relation à l'alimentation
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="feature in features" :key="feature.title" class="card p-8 text-center group">
            <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
              <component :is="feature.icon" class="h-8 w-8 text-primary" />
            </div>
            <h3 class="font-title font-semibold text-xl mb-4">{{ feature.title }}</h3>
            <p class="text-gray-600">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-20 bg-nature-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Dish of the Week Section -->
        <div class="mb-20">
          <div class="text-center mb-12">
            <h2 class="font-title font-bold text-3xl lg:text-4xl text-gray-900 mb-4">
              Plat de la semaine
            </h2>
            <p class="text-xl text-gray-600">
              Notre sélection spéciale pour cette semaine
            </p>
          </div>

          <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div class="grid grid-cols-1 lg:grid-cols-2">
              <div class="relative h-64 lg:h-auto">
                <img 
                  :src="dishOfTheWeek.image" 
                  :alt="dishOfTheWeek.name"
                  class="w-full h-full object-cover"
                >
                <div class="absolute top-4 left-4">
                  <span class="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium">
                    ⭐ Plat de la semaine
                  </span>
                </div>
              </div>
              <div class="p-8 lg:p-12 flex flex-col justify-center">
                <div class="mb-4">
                  <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {{ getCategoryLabel(dishOfTheWeek.category) }}
                  </span>
                </div>
                <h3 class="font-title font-bold text-2xl lg:text-3xl text-gray-900 mb-4">
                  {{ dishOfTheWeek.name }}
                </h3>
                <p class="text-gray-600 mb-6 text-lg">
                  {{ dishOfTheWeek.description }}
                </p>
                <div class="flex items-center mb-6">
                  <div class="text-3xl font-bold text-primary mr-4">
                    {{ dishOfTheWeek.price.toFixed(2) }}€
                  </div>
                  <div v-if="dishOfTheWeek.rating" class="flex items-center">
                    <span class="text-yellow-400 mr-1">★</span>
                    <span class="text-gray-600">{{ dishOfTheWeek.rating }}/5</span>
                  </div>
                </div>
                <div class="flex flex-col sm:flex-row gap-4">
                  <button 
                    @click="addToCart(dishOfTheWeek)"
                    class="btn-primary flex-1"
                    :disabled="!dishOfTheWeek.inStock"
                  >
                    {{ dishOfTheWeek.inStock ? 'Ajouter au panier' : 'Rupture' }}
                  </button>
                  <button 
                    @click="orderViaWhatsApp(dishOfTheWeek)"
                    class="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 flex-1"
                  >
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center mb-16">
          <h2 class="font-title font-bold text-3xl lg:text-4xl text-gray-900 mb-4">
            Nos produits phares
          </h2>
          <p class="text-xl text-gray-600">
            Sélection de nos meilleurs produits pour votre bien-être
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="productStore.loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p class="mt-4 text-gray-600">Chargement des produits...</p>
        </div>

        <!-- Products Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ProductCard 
            v-for="product in featuredProducts" 
            :key="product.id" 
            :product="product" 
          />
        </div>

        <div class="text-center mt-12">
          <router-link to="/shop" class="btn-primary">
            Voir tous les produits
          </router-link>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-primary">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="font-title font-bold text-3xl lg:text-4xl text-white mb-6">
          Prêt à transformer votre santé ?
        </h2>
        <p class="text-xl text-white/90 mb-8">
          Réservez votre consultation personnalisée avec notre nutritionniste experte
        </p>
        <router-link to="/consultation" class="btn-secondary">
          Réserver ma consultation
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { UserIcon, HeartIcon, SparklesIcon } from '@heroicons/vue/24/outline'
import ProductCard from '../components/ProductCard.vue'
import { useProductStore } from '../stores/products'
import { useCartStore } from '../stores/cart'
import type { Product } from '../types'

const productStore = useProductStore()
const cartStore = useCartStore()

const featuredProducts = computed(() => productStore.products.slice(0, 3))

// Plat de la semaine - peut être configuré dynamiquement
const dishOfTheWeek = computed(() => {
  // Chercher un produit de catégorie "repas" ou "amuse-gueule" en priorité
  const dishProducts = productStore.products.filter(p => 
    p.category === 'repas' || p.category === 'amuse-gueule'
  )
  
  if (dishProducts.length > 0) {
    return dishProducts[0] // Premier produit trouvé
  }
  
  // Fallback vers un produit par défaut
  return productStore.products[0] || {
    id: 'default',
    name: 'Salade Buddha Bowl',
    description: 'Un mélange parfait de légumes frais, quinoa, avocat et graines, accompagné d\'une vinaigrette maison aux herbes.',
    price: 12.90,
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'repas' as const,
    inStock: true,
    rating: 4.8,
    reviews: 42
  }
})

const getCategoryLabel = (category: string) => {
  const labels = {
    ebook: 'E-book',
    program: 'Programme',
    repas: 'Repas',
    ingredient: 'Ingrédient',
    farine: 'Farine',
    boisson: 'Boisson',
    'amuse-gueule': 'Amuse-gueule'
  }
  return labels[category as keyof typeof labels] || category
}

const addToCart = (product: Product) => {
  if (product.inStock) {
    cartStore.addToCart(product)
  }
}

const orderViaWhatsApp = (product: Product) => {
  const message = `🍽️ *Plat de la semaine - Merry's Food*\n\n` +
    `*${product.name}*\n` +
    `Prix: ${product.price.toFixed(2)}€\n` +
    `Description: ${product.description}\n\n` +
    `Je souhaiterais commander ce plat de la semaine. Pouvez-vous me donner plus d'informations sur la disponibilité et la livraison ?\n\n` +
    `Merci ! 😊`
  
  const encodedMessage = encodeURIComponent(message)
  const whatsappNumber = "+33782593084"
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
  
  window.open(whatsappUrl, '_blank')
}

const features = [
  {
    title: 'Consultation personnalisée',
    description: 'Bénéficiez d\'un accompagnement sur-mesure adapté à vos besoins et objectifs.',
    icon: UserIcon
  },
  {
    title: 'Produits naturels',
    description: 'Découvrez notre sélection de produits et ingrédients 100% naturels.',
    icon: HeartIcon
  },
  {
    title: 'Approche holistique',
    description: 'Une vision globale de votre santé pour des résultats durables.',
    icon: SparklesIcon
  }
]

onMounted(() => {
  productStore.loadProducts()
})
</script>