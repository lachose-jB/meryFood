<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="max-w-md w-full text-center">
      <div class="mb-8">
        <div class="text-6xl font-bold text-primary mb-4">404</div>
        <h1 class="font-title font-bold text-3xl text-gray-900 mb-2">
          Page non trouvée
        </h1>
        <p class="text-gray-600">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
      </div>

      <div class="space-y-4">
        <router-link to="/" class="btn-primary block">
          Retour à l'accueil
        </router-link>
        
        <router-link to="/shop" class="btn-secondary block">
          Voir la boutique
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Page 404 simple
</script>