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
              src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800" 
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
            Pourquoi choisir Merry's Food ?
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

const productStore = useProductStore()

const featuredProducts = computed(() => productStore.products.slice(0, 3))

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