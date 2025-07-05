<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="max-w-md w-full text-center">
      <div class="mb-8">
        <div class="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ExclamationTriangleIcon class="h-12 w-12 text-red-600" />
        </div>
        <h1 class="font-title font-bold text-3xl text-gray-900 mb-2">
          Accès non autorisé
        </h1>
        <p class="text-gray-600">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>
      </div>

      <div class="space-y-4">
        <router-link to="/" class="btn-primary block">
          Retour à l'accueil
        </router-link>
        
        <router-link 
          v-if="!authStore.isAuthenticated"
          to="/login" 
          class="btn-secondary block"
        >
          Se connecter
        </router-link>
        
        <button 
          v-else
          @click="logout"
          class="btn-secondary block w-full"
        >
          Se déconnecter
        </button>
      </div>

      <div class="mt-8 text-sm text-gray-500">
        <p>Si vous pensez qu'il s'agit d'une erreur, contactez l'administrateur.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const logout = () => {
  authStore.logout()
  router.push('/')
}
</script>