<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="max-w-md w-full bg-white p-8 rounded-xl shadow-sm">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-white font-bold text-2xl">M</span>
        </div>
        <h1 class="font-title font-bold text-2xl text-gray-900">
          {{ isAdminRequired ? 'Connexion Administrateur' : 'Connexion' }}
        </h1>
        <p class="text-gray-600 mt-2">
          {{ isAdminRequired ? 'Accès réservé aux gestionnaires' : 'Connectez-vous avec votre compte Firebase' }}
        </p>
      </div>

      <!-- Alerte de sécurité -->
      <div v-if="isAdminRequired" class="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div class="flex items-center">
          <ShieldExclamationIcon class="h-5 w-5 text-amber-600 mr-2" />
          <p class="text-sm text-amber-800">
            Zone d'administration - Accès restreint aux gestionnaires autorisés
          </p>
        </div>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input 
            v-model="form.email"
            type="email" 
            required
            autocomplete="email"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary"
            placeholder="votre@email.com"
            :class="{ 'border-red-300': error }"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Mot de passe *
          </label>
          <div class="relative">
            <input 
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              autocomplete="current-password"
              class="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:ring-primary focus:border-primary"
              placeholder="••••••••"
              :class="{ 'border-red-300': error }"
            >
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <EyeIcon v-if="!showPassword" class="h-5 w-5 text-gray-400" />
              <EyeSlashIcon v-else class="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-center">
            <ExclamationCircleIcon class="h-5 w-5 text-red-600 mr-2" />
            <p class="text-sm text-red-800">{{ error }}</p>
          </div>
        </div>

        <button 
          type="submit"
          class="w-full btn-primary"
          :disabled="loading"
        >
          {{ loading ? 'Connexion...' : 'Se connecter' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <router-link to="/" class="text-primary hover:underline text-sm">
          ← Retour au site
        </router-link>
      </div>

      <!-- Informations Firebase -->
      <div class="mt-8 p-4 bg-blue-50 rounded-lg">
        <div class="flex items-center mb-2">
          <svg class="h-5 w-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3.89 15.672L6.255.461A.542.542 0 017.27.288l2.543 4.771zm16.794 3.692l-2.25-14a.54.54 0 00-.919-.295L14.422 8.5zm-8.794-2.692L7.824 2.5 8.84 15.5z"/>
          </svg>
          <p class="text-sm font-medium text-blue-800">Authentification Firebase</p>
        </div>
        <p class="text-xs text-blue-700">
          Utilisez votre compte Firebase pour accéder à l'administration. 
          Contactez l'administrateur pour créer un compte.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  ShieldExclamationIcon, 
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon 
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: ''
})

const error = ref('')
const loading = ref(false)
const showPassword = ref(false)

const isAdminRequired = computed(() => route.query.admin === 'required')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    const result = await authStore.login(form.value.email, form.value.password)
    
    if (result.success) {
      // Redirection sécurisée
      const redirectPath = route.query.redirect as string
      
      if (redirectPath && redirectPath.startsWith('/')) {
        // Vérifier que la redirection est autorisée
        if (redirectPath.startsWith('/admin') && !authStore.isAdmin) {
          router.push('/unauthorized')
        } else {
          router.push(redirectPath)
        }
      } else {
        // Redirection par défaut selon le rôle
        router.push(authStore.isAdmin ? '/admin' : '/')
      }
    } else {
      error.value = result.error || 'Identifiants invalides'
    }
  } catch (err) {
    error.value = 'Erreur de connexion. Veuillez réessayer.'
    console.error('Erreur de connexion:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Si déjà connecté, rediriger
  if (authStore.isAuthenticated) {
    router.push(authStore.isAdmin ? '/admin' : '/')
  }
})
</script>