<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header sécurisé -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span class="text-white font-bold text-lg">M</span>
            </div>
            <div>
              <h1 class="font-title font-bold text-xl text-gray-900">
                Tableau de bord administrateur
              </h1>
              <p class="text-sm text-gray-600">Merry's Food et nutrition</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <ShieldCheckIcon class="h-5 w-5 text-green-600" />
              <span class="text-sm text-gray-600">
                {{ authStore.user?.name }} (Admin)
              </span>
            </div>
            <button 
              @click="logout"
              class="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Déconnexion sécurisée
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Alerte de sécurité -->
      <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div class="flex items-center">
          <InformationCircleIcon class="h-5 w-5 text-blue-600 mr-2" />
          <p class="text-sm text-blue-800">
            Zone d'administration sécurisée - Données synchronisées avec Firebase
          </p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-xl shadow-sm">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingBagIcon class="h-6 w-6 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Produits</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.products }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DocumentTextIcon class="h-6 w-6 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Articles</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.articles }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <CalendarIcon class="h-6 w-6 text-purple-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Consultations</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.bookings }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <CurrencyEuroIcon class="h-6 w-6 text-yellow-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Firebase</p>
              <p class="text-2xl font-bold text-green-600">✓</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="bg-white rounded-xl shadow-sm mb-8">
        <div class="border-b border-gray-200">
          <nav class="flex space-x-8 px-6">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <div class="p-6">
          <!-- Products Tab -->
          <div v-if="activeTab === 'products'">
            <div class="flex justify-between items-center mb-6">
              <h2 class="font-title font-semibold text-xl">Gestion des produits</h2>
              <button 
                @click="showProductForm = true"
                class="btn-primary"
              >
                Ajouter un produit
              </button>
            </div>
            <ProductsManager />
          </div>

          <!-- Articles Tab -->
          <div v-if="activeTab === 'articles'">
            <div class="flex justify-between items-center mb-6">
              <h2 class="font-title font-semibold text-xl">Gestion des articles</h2>
              <button 
                @click="showArticleForm = true"
                class="btn-primary"
              >
                Ajouter un article
              </button>
            </div>
            <ArticlesManager />
          </div>

          <!-- Bookings Tab -->
          <div v-if="activeTab === 'bookings'">
            <h2 class="font-title font-semibold text-xl mb-6">Consultations</h2>
            <BookingsManager />
          </div>
        </div>
      </div>
    </div>

    <!-- Product Form Modal -->
    <ProductForm 
      v-if="showProductForm"
      @close="showProductForm = false"
    />

    <!-- Article Form Modal -->
    <ArticleForm 
      v-if="showArticleForm"
      @close="showArticleForm = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useProductStore } from '../../stores/products'
import { useBlogStore } from '../../stores/blog'
import { useFirebaseBookingStore } from '../../stores/firebaseBooking'
import { 
  ShoppingBagIcon, 
  DocumentTextIcon, 
  CalendarIcon, 
  CurrencyEuroIcon,
  ShieldCheckIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'
import ProductsManager from '../../components/admin/ProductsManager.vue'
import ArticlesManager from '../../components/admin/ArticlesManager.vue'
import BookingsManager from '../../components/admin/BookingsManager.vue'
import ProductForm from '../../components/admin/ProductForm.vue'
import ArticleForm from '../../components/admin/ArticleForm.vue'

const router = useRouter()
const authStore = useAuthStore()
const productStore = useProductStore()
const blogStore = useBlogStore()
const bookingStore = useFirebaseBookingStore()

const activeTab = ref('products')
const showProductForm = ref(false)
const showArticleForm = ref(false)

const tabs = [
  { id: 'products', name: 'Produits' },
  { id: 'articles', name: 'Articles' },
  { id: 'bookings', name: 'Consultations' }
]

const stats = computed(() => ({
  products: productStore.products.length,
  articles: blogStore.posts.length,
  bookings: bookingStore.bookings.length
}))

const logout = () => {
  if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
    authStore.logout()
    router.push('/login')
  }
}

onMounted(async () => {
  // Double vérification de sécurité
  if (!authStore.isAuthenticated || !authStore.isAdmin) {
    router.push('/unauthorized')
    return
  }
  
  // Charger les données Firebase
  await Promise.all([
    productStore.loadProducts(),
    blogStore.loadPosts(),
    bookingStore.loadBookings()
  ])
  
  // Rafraîchir la session
  authStore.refreshSession()
})
</script>