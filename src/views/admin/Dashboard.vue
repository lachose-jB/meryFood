<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="font-title font-bold text-3xl text-gray-900">Dashboard Admin</h1>
            <p class="text-gray-600 mt-1">Gestion de votre site Mery's Food</p>
          </div>
          <div class="flex items-center space-x-4">
            <div class="text-sm text-gray-500">
              Connecté en tant que <span class="font-medium">{{ authStore.user?.email }}</span>
            </div>
            <button 
              @click="logout"
              class="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-xl shadow-sm">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <ShoppingBagIcon class="h-6 w-6 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Produits</p>
              <p class="text-2xl font-bold text-gray-900">{{ productStore.products.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <DocumentTextIcon class="h-6 w-6 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Articles</p>
              <p class="text-2xl font-bold text-gray-900">{{ blogStore.posts.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <CalendarIcon class="h-6 w-6 text-yellow-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Réservations</p>
              <p class="text-2xl font-bold text-gray-900">{{ bookingStore.bookings.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <TagIcon class="h-6 w-6 text-purple-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Promotions</p>
              <p class="text-2xl font-bold text-gray-900">{{ promotionStore.promotions.length }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="bg-white rounded-xl shadow-sm mb-8">
        <div class="border-b border-gray-200">
          <nav class="flex space-x-8 px-6">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              <component :is="tab.icon" class="h-5 w-5 inline mr-2" />
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- Products Tab -->
          <div v-if="activeTab === 'products'">
            <div class="flex justify-between items-center mb-6">
              <h2 class="font-title font-semibold text-xl">Gestion des produits</h2>
              <button @click="showProductForm = true" class="btn-primary">
                Ajouter un produit
              </button>
            </div>
            <ProductsManager />
          </div>

          <!-- Articles Tab -->
          <div v-if="activeTab === 'articles'">
            <div class="flex justify-between items-center mb-6">
              <h2 class="font-title font-semibold text-xl">Gestion des articles</h2>
              <button @click="showArticleForm = true" class="btn-primary">
                Ajouter un article
              </button>
            </div>
            <ArticlesManager />
          </div>

          <!-- Bookings Tab -->
          <div v-if="activeTab === 'bookings'">
            <div class="flex justify-between items-center mb-6">
              <h2 class="font-title font-semibold text-xl">Gestion des réservations</h2>
            </div>
            <BookingsManager />
          </div>

          <!-- Promotions Tab -->
          <div v-if="activeTab === 'promotions'">
            <div class="flex justify-between items-center mb-6">
              <h2 class="font-title font-semibold text-xl">Gestion des promotions</h2>
              <button @click="showPromotionForm = true" class="btn-primary">
                Ajouter une promotion
              </button>
            </div>
            <PromotionsManager />
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <ProductForm 
      v-if="showProductForm"
      @close="showProductForm = false"
      @save="handleProductSave"
    />

    <ArticleForm 
      v-if="showArticleForm"
      @close="showArticleForm = false"
      @save="handleArticleSave"
    />

    <PromotionForm 
      v-if="showPromotionForm"
      @close="showPromotionForm = false"
      @save="handlePromotionSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ShoppingBagIcon, 
  DocumentTextIcon, 
  CalendarIcon,
  TagIcon
} from '@heroicons/vue/24/outline'

// Stores
import { useAuthStore } from '../../stores/auth'
import { useProductStore } from '../../stores/products'
import { useBlogStore } from '../../stores/blog'
import { useFirebaseBookingStore } from '../../stores/firebaseBooking'
import { usePromotionStore } from '../../stores/promotions'

// Components
import ProductsManager from '../../components/admin/ProductsManager.vue'
import ArticlesManager from '../../components/admin/ArticlesManager.vue'
import BookingsManager from '../../components/admin/BookingsManager.vue'
import PromotionsManager from '../../components/admin/PromotionsManager.vue'
import ProductForm from '../../components/admin/ProductForm.vue'
import ArticleForm from '../../components/admin/ArticleForm.vue'
import PromotionForm from '../../components/admin/PromotionForm.vue'

const router = useRouter()
const authStore = useAuthStore()
const productStore = useProductStore()
const blogStore = useBlogStore()
const bookingStore = useFirebaseBookingStore()
const promotionStore = usePromotionStore()

const activeTab = ref('products')
const showProductForm = ref(false)
const showArticleForm = ref(false)
const showPromotionForm = ref(false)

const tabs = [
  {
    id: 'products',
    name: 'Produits',
    icon: ShoppingBagIcon
  },
  {
    id: 'articles',
    name: 'Articles',
    icon: DocumentTextIcon
  },
  {
    id: 'bookings',
    name: 'Réservations',
    icon: CalendarIcon
  },
  {
    id: 'promotions',
    name: 'Promotions',
    icon: TagIcon
  }
]

const logout = async () => {
  await authStore.logout()
  router.push('/')
}

const handleProductSave = () => {
  showProductForm.value = false
  productStore.loadProducts()
}

const handleArticleSave = () => {
  showArticleForm.value = false
  blogStore.loadPosts()
}

const handlePromotionSave = () => {
  showPromotionForm.value = false
  promotionStore.loadPromotions()
}

onMounted(() => {
  // Charger toutes les données nécessaires
  productStore.loadProducts()
  blogStore.loadPosts()
  bookingStore.loadBookings()
  promotionStore.loadPromotions()
})
</script>