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
                    <div v-if="promotion.promoCode" class="text-xs text-blue-600 font-mono">
                      Code: {{ promotion.promoCode }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-lg font-bold text-red-600">
                  -{{ promotion.discountPercentage }}%
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div>Du {{ formatDate(promotion.validFrom) }}</div>
                <div>Au {{ formatDate(promotion.validUntil) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  promotion.isActive && isPromotionValid(promotion)
                    ? 'bg-green-100 text-green-800' 
                    : promotion.isActive && !isPromotionValid(promotion)
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                ]">
                  {{ getPromotionStatus(promotion) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button 
                  @click="togglePromotion(promotion)"
                  :class="[
                    'text-sm px-3 py-1 rounded',
                    promotion.isActive 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { usePromotionStore } from '../../stores/promotions'
import type { Promotion } from '../../types'

const promotionStore = usePromotionStore()

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR')
}

const isPromotionValid = (promotion: Promotion) => {
  const now = new Date()
  const validFrom = new Date(promotion.validFrom)
  const validUntil = new Date(promotion.validUntil)
  
  return now >= validFrom && now <= validUntil
}

const getPromotionStatus = (promotion: Promotion) => {
  if (!promotion.isActive) return 'Inactive'
  
  const now = new Date()
  const validFrom = new Date(promotion.validFrom)
  const validUntil = new Date(promotion.validUntil)
  
  if (now < validFrom) return 'Programmée'
  if (now > validUntil) return 'Expirée'
  
  return 'Active'
}

const togglePromotion = async (promotion: Promotion) => {
  const newStatus = !promotion.isActive
  const action = newStatus ? 'activer' : 'désactiver'
  
  if (confirm(`Êtes-vous sûr de vouloir ${action} cette promotion ?`)) {
    const success = await promotionStore.togglePromotion(promotion.id!, newStatus)
    if (!success) {
      alert(`Erreur lors de la modification de la promotion`)
    }
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