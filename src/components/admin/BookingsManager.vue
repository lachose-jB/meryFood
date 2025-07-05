<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="bookingStore.loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      <p class="mt-4 text-gray-600">Chargement des réservations...</p>
    </div>

    <!-- Bookings Table -->
    <div v-else class="bg-white rounded-lg border">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Heure
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
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
            <tr v-for="booking in bookingStore.bookings" :key="booking.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ booking.name }}
                </div>
                <div v-if="booking.message" class="text-sm text-gray-500">
                  {{ booking.message.substring(0, 50) }}...
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div>{{ formatDate(booking.date) }}</div>
                <div class="text-gray-500">{{ booking.time }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div>{{ booking.email }}</div>
                <div class="text-gray-500">{{ booking.phone }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(booking.status)">
                  {{ getStatusLabel(booking.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button 
                  v-if="booking.status === 'pending'"
                  @click="confirmBooking(booking.id!)"
                  class="text-green-600 hover:text-green-800"
                >
                  Confirmer
                </button>
                <button 
                  @click="cancelBooking(booking.id!)"
                  class="text-red-600 hover:text-red-800"
                >
                  Annuler
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
import { useFirebaseBookingStore } from '../../stores/firebaseBooking'

const bookingStore = useFirebaseBookingStore()

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

const getStatusClass = (status: string) => {
  const classes = {
    pending: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800',
    confirmed: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800',
    cancelled: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800'
  }
  return classes[status as keyof typeof classes] || classes.pending
}

const getStatusLabel = (status: string) => {
  const labels = {
    pending: 'En attente',
    confirmed: 'Confirmé',
    cancelled: 'Annulé'
  }
  return labels[status as keyof typeof labels] || status
}

const confirmBooking = async (id: string) => {
  await bookingStore.confirmBooking(id)
}

const cancelBooking = async (id: string) => {
  if (confirm('Êtes-vous sûr de vouloir annuler cette consultation ?')) {
    await bookingStore.cancelBooking(id)
  }
}

onMounted(() => {
  bookingStore.loadBookings()
})
</script>