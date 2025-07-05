<template>
  <nav class="bg-white shadow-sm sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-2">
          <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <span class="text-white font-bold text-lg">M</span>
          </div>
          <span class="font-title font-bold text-xl text-gray-900">Mery's Food et nutrition</span>
        </router-link>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link 
            v-for="item in navigation" 
            :key="item.name"
            :to="item.href"
            class="text-gray-700 hover:text-primary transition-colors duration-200 font-medium"
            :class="{ 'text-primary': $route.path === item.href }"
          >
            {{ item.name }}
          </router-link>
        </div>

        <!-- Cart & Admin & Mobile Menu -->
        <div class="flex items-center space-x-4">
          <!-- Admin Link - Sécurisé (caché pour le public) -->
          <router-link 
            v-if="authStore.isAdmin"
            to="/admin" 
            class="hidden md:flex items-center space-x-1 text-gray-700 hover:text-primary transition-colors font-medium"
          >
            <ShieldCheckIcon class="h-4 w-4" />
            <span>Admin</span>
          </router-link>

          <!-- WhatsApp Contact -->
          <a 
            href="https://wa.me/33123456789?text=Bonjour%20Merry's%20Food,%20j'aimerais%20avoir%20des%20informations"
            target="_blank"
            class="hidden md:flex items-center space-x-1 text-gray-700 hover:text-green-600 transition-colors font-medium"
          >
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
            <span>WhatsApp</span>
          </a>

          <!-- Login Admin (caché pour le public) -->
          <router-link 
            v-if="!authStore.isAuthenticated && showAdminLogin"
            to="/login" 
            class="hidden text-gray-700 hover:text-primary transition-colors font-medium"
          >
            Admin
          </router-link>

          <div v-if="authStore.isAuthenticated" class="hidden md:flex items-center space-x-2">
            <span class="text-sm text-gray-600">{{ authStore.user?.name }}</span>
            <button 
              @click="logout"
              class="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              Déconnexion
            </button>
          </div>

          <router-link 
            to="/cart" 
            class="relative p-2 text-gray-700 hover:text-primary transition-colors"
          >
            <ShoppingBagIcon class="h-6 w-6" />
            <span 
              v-if="cartStore.totalItems > 0"
              class="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
            >
              {{ cartStore.totalItems }}
            </span>
          </router-link>

          <!-- Mobile menu button -->
          <button 
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 text-gray-700 hover:text-primary"
          >
            <Bars3Icon v-if="!mobileMenuOpen" class="h-6 w-6" />
            <XMarkIcon v-else class="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="mobileMenuOpen" class="md:hidden bg-white border-t">
      <div class="px-4 py-2 space-y-1">
        <router-link
          v-for="item in navigation"
          :key="item.name"
          :to="item.href"
          @click="mobileMenuOpen = false"
          class="block px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
          :class="{ 'text-primary bg-gray-50': $route.path === item.href }"
        >
          {{ item.name }}
        </router-link>
        
        <!-- WhatsApp Mobile -->
        <a
          href="https://wa.me/33123456789?text=Bonjour%20Merry's%20Food,%20j'aimerais%20avoir%20des%20informations"
          target="_blank"
          @click="mobileMenuOpen = false"
          class="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md transition-colors"
        >
          <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
          </svg>
          <span>WhatsApp</span>
        </a>
        
        <router-link
          v-if="authStore.isAdmin"
          to="/admin"
          @click="mobileMenuOpen = false"
          class="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
        >
          <ShieldCheckIcon class="h-4 w-4" />
          <span>Admin</span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ShoppingBagIcon, 
  Bars3Icon, 
  XMarkIcon,
  ShieldCheckIcon 
} from '@heroicons/vue/24/outline'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const mobileMenuOpen = ref(false)

// Masquer le lien admin pour le public (peut être activé via console pour debug)
const showAdminLogin = ref(false)

const navigation = [
  { name: 'Accueil', href: '/' },
  { name: 'Boutique', href: '/shop' },
  { name: 'Consultation', href: '/consultation' },
  { name: 'À propos', href: '/about' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' }
]

const logout = () => {
  authStore.logout()
  mobileMenuOpen.value = false
  router.push('/')
}
</script>