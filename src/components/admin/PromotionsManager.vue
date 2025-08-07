<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="promotionStore.loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      <p class="mt-4 text-gray-600">Chargement des promotions...</p>
    </div>

    <!-- Promotions Table -->
    <div v-else class="bg-white rounded-lg border">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Promotion
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Réduction
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Période
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="promotion in promotionStore.promotions" :key="promotion.id">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <img 
                    :src="promotion.image" 
                    :alt="promotion.title"
                    class="h-12 w-12 rounded-lg object-cover"
                  >
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ promotion.title }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ promotion.description.substring(0, 50) }}...
                    </div>
                    <div v-if="promotion.promoCode" class="text-xs text-purple-600 font-mono">
                      Code: {{ promotion.promoCode }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-lg font-bold text-red-600">
                  -{{ promotion.discount }}%
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div>Du {{ promotion.validFrom ? formatDate(promotion.validFrom) : 'Date inconnue' }}</div>
                <div>Au {{ promotion.validUntil ? formatDate(promotion.validUntil) : 'Date inconnue' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(promotion)">
                  {{ getStatusLabel(promotion) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button 
                  @click="togglePromotion(promotion)"
                  :class="[
                    'px-3 py-1 rounded text-xs font-medium',
                    promotion.isActive 
                      ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  ]"
                >
                  {{ promotion.isActive ? 'Désactiver' : 'Activer' }}
                </button>
                <button 
                  @click="deletePromotion(promotion.id!)"
                  class="text-red-600 hover:text-red-800"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="promotionStore.promotions.length === 0" class="text-center py-12">
        <TagIcon class="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500 text-lg">Aucune promotion créée</p>
        <p class="text-gray-400 text-sm">Créez votre première promotion pour attirer vos clients</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { TagIcon } from '@heroicons/vue/24/outline'
import { usePromotionStore } from '../../stores/promotions'
import type { Promotion } from '../../types'

const promotionStore = usePromotionStore()

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const getStatusClass = (promotion: Promotion) => {
  const now = new Date()

  if (!promotion.validFrom || !promotion.validUntil) {
    return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800'
  }

  const validFrom = new Date(promotion.validFrom)
  const validUntil = new Date(promotion.validUntil)

  if (isNaN(validFrom.getTime()) || isNaN(validUntil.getTime())) {
    return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800'
  }

  if (!promotion.isActive) {
    return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800'
  }
  
  if (now < validFrom) {
    return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800'
  }
  
  if (now > validUntil) {
    return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800'
  }
  
  return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'
}


const getStatusLabel = (promotion: Promotion) => {
  const now = new Date()

  // Si validFrom ou validUntil manquent, on considère la promo comme inactive
  if (!promotion.validFrom || !promotion.validUntil) {
    return 'Inactive'
  }

  const validFrom = new Date(promotion.validFrom)
  const validUntil = new Date(promotion.validUntil)

  // On vérifie si les dates sont valides (not a NaN)
  if (isNaN(validFrom.getTime()) || isNaN(validUntil.getTime())) {
    return 'Inactive'
  }

  if (!promotion.isActive) {
    return 'Inactive'
  }
  
  if (now < validFrom) {
    return 'Programmée'
  }
  
  if (now > validUntil) {
    return 'Expirée'
  }
  
  return 'Active'
}


const togglePromotion = async (promotion: Promotion) => {
  const success = await promotionStore.togglePromotion(promotion.id!, !promotion.isActive)
  if (!success) {
    alert('Erreur lors de la modification de la promotion')
  }
}

const deletePromotion = async (id: string) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette promotion ?')) {
    const success = await promotionStore.deletePromotion(id)
    if (!success) {
      alert('Erreur lors de la suppression de la promotion')
    }
  }
}

onMounted(() => {
  promotionStore.loadPromotions()
})
</script>
