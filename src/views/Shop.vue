<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-8">
        <h1 class="font-title font-bold text-3xl text-gray-900 mb-2">Boutique</h1>
        <p class="text-gray-600">Découvrez nos produits naturels pour votre bien-être</p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Loading State -->
      <div v-if="productStore.loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p class="mt-4 text-gray-600">Chargement des produits...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="productStore.error" class="text-center py-12">
        <p class="text-red-600 mb-4">{{ productStore.error }}</p>
        <button @click="productStore.loadProducts()" class="btn-primary">
          Réessayer
        </button>
      </div>

      <!-- Products Content -->
      <div v-else class="flex flex-col lg:flex-row gap-8">
        <!-- Filters Sidebar -->
        <div class="lg:w-64 space-y-6">
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="font-title font-semibold text-lg mb-4">Catégories</h3>
            <div class="space-y-2">
              <label v-for="category in categories" :key="category.value" class="flex items-center">
                <input 
                  type="radio" 
                  name="category" 
                  :value="category.value"
                  v-model="selectedCategory"
                  class="text-primary focus:ring-primary"
                >
                <span class="ml-2">{{ category.label }}</span>
              </label>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="font-title font-semibold text-lg mb-4">Prix</h3>
            <div class="space-y-2">
              <label v-for="range in priceRanges" :key="range.value" class="flex items-center">
                <input 
                  type="radio" 
                  name="price" 
                  :value="range.value"
                  v-model="selectedPriceRange"
                  class="text-primary focus:ring-primary"
                >
                <span class="ml-2">{{ range.label }}</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Products Grid -->
        <div class="flex-1">
          <div class="flex justify-between items-center mb-6">
            <p class="text-gray-600">{{ filteredProducts.length }} produits</p>
            <select 
              v-model="sortBy" 
              class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary"
            >
              <option value="name">Nom A-Z</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="rating">Mieux notés</option>
            </select>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <ProductCard 
              v-for="product in sortedProducts" 
              :key="product.id" 
              :product="product" 
            />
          </div>

          <div v-if="filteredProducts.length === 0" class="text-center py-12">
            <p class="text-gray-500 text-lg">Aucun produit trouvé pour ces critères.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import { useProductStore } from '../stores/products'

const productStore = useProductStore()

const selectedCategory = ref('all')
const selectedPriceRange = ref('all')
const sortBy = ref('name')

const categories = [
  { value: 'all', label: 'Tous les produits' },
  { value: 'ebook', label: 'E-books' },
  { value: 'repas', label: 'Repas' },
  { value: 'ingredient', label: 'Ingrédients' },
  { value: 'farine', label: 'Farines' },
  { value: 'boisson', label: 'Boissons' },
  { value: 'amuse-gueule', label: 'Amuse-gueules' },
  { value: 'program', label: 'Programmes' }
]

const priceRanges = [
  { value: 'all', label: 'Tous les prix' },
  { value: '0-20', label: 'Moins de 20€' },
  { value: '20-40', label: '20€ - 40€' },
  { value: '40+', label: 'Plus de 40€' }
]

const filteredProducts = computed(() => {
  let filtered = productStore.products

  // Filter by category
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(product => product.category === selectedCategory.value)
  }

  // Filter by price range
  if (selectedPriceRange.value !== 'all') {
    const [min, max] = selectedPriceRange.value.split('-').map(Number)
    if (max) {
      filtered = filtered.filter(product => product.price >= min && product.price <= max)
    } else {
      filtered = filtered.filter(product => product.price >= min)
    }
  }

  return filtered
})

const sortedProducts = computed(() => {
  const sorted = [...filteredProducts.value]

  switch (sortBy.value) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'rating':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    default:
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
  }
})

onMounted(() => {
  productStore.loadProducts()
})
</script>