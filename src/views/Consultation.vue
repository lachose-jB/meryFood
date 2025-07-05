<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm">
      <div class="max-w-4xl mx-auto px-4 py-8">
        <h1 class="font-title font-bold text-3xl text-gray-900 mb-2">
          Consultation Nutritionnelle
        </h1>
        <p class="text-gray-600">
          Réservez votre consultation personnalisée avec notre experte
        </p>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Booking Form -->
        <div class="bg-white p-8 rounded-xl shadow-sm">
          <h2 class="font-title font-semibold text-xl mb-6">Informations personnelles</h2>
          
          <form @submit.prevent="submitBooking" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nom complet *
              </label>
              <input 
                v-model="form.name"
                type="text" 
                required
                class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary"
                placeholder="Votre nom complet"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input 
                v-model="form.email"
                type="email" 
                required
                class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary"
                placeholder="votre@email.com"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Téléphone *
              </label>
              <input 
                v-model="form.phone"
                type="tel" 
                required
                class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary"
                placeholder="06 12 34 56 78"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Date souhaitée *
              </label>
              <select 
                v-model="selectedDate"
                @change="loadAvailableSlots"
                required
                class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary"
              >
                <option value="">Choisir une date</option>
                <option v-for="date in availableDates" :key="date" :value="date">
                  {{ formatDate(date) }}
                </option>
              </select>
            </div>

            <div v-if="availableSlots.length > 0">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Heure souhaitée *
              </label>
              <div class="grid grid-cols-2 gap-3">
                <button
                  v-for="slot in availableSlots"
                  :key="slot.id"
                  type="button"
                  @click="selectedTime = slot.time"
                  :class="[
                    'p-3 border rounded-lg text-sm font-medium transition-colors',
                    selectedTime === slot.time
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-300 hover:border-primary hover:bg-primary/5'
                  ]"
                >
                  {{ slot.time }}
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Message (optionnel)
              </label>
              <textarea 
                v-model="form.message"
                rows="4"
                class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary"
                placeholder="Décrivez brièvement vos objectifs ou questions..."
              ></textarea>
            </div>

            <button 
              type="submit"
              class="w-full btn-primary"
              :disabled="!canSubmit || bookingStore.loading"
            >
              {{ bookingStore.loading ? 'Réservation...' : 'Réserver ma consultation' }}
            </button>

            <div v-if="bookingStore.error" class="text-red-600 text-sm">
              {{ bookingStore.error }}
            </div>
          </form>
        </div>

        <!-- Consultation Info -->
        <div class="space-y-6">
          <div class="bg-white p-6 rounded-xl shadow-sm">
            <h3 class="font-title font-semibold text-lg mb-4">Votre nutritionniste</h3>
            <div class="flex items-center space-x-4 mb-4">
              <img 
                src="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=200" 
                alt="Dr. Marie Dubois"
                class="w-16 h-16 rounded-full object-cover"
              >
              <div>
                <h4 class="font-semibold">Dr. Marie Dubois</h4>
                <p class="text-gray-600 text-sm">Nutritionniste diplômée</p>
                <p class="text-gray-600 text-sm">15 ans d'expérience</p>
              </div>
            </div>
            <p class="text-gray-600 text-sm">
              Spécialisée en nutrition préventive et thérapeutique, 
              je vous accompagne vers une alimentation équilibrée et adaptée à vos besoins.
            </p>
          </div>

          <div class="bg-white p-6 rounded-xl shadow-sm">
            <h3 class="font-title font-semibold text-lg mb-4">Tarifs</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span>Consultation (1h)</span>
                <span class="font-semibold">60€</span>
              </div>
              <div class="flex justify-between">
                <span>Suivi (30min)</span>
                <span class="font-semibold">35€</span>
              </div>
              <div class="text-sm text-gray-600 pt-3 border-t">
                * Consultations remboursables par certaines mutuelles
              </div>
            </div>
          </div>

          <div class="bg-primary/10 p-6 rounded-xl">
            <h3 class="font-title font-semibold text-lg mb-4">Ce qui vous attend</h3>
            <ul class="space-y-2 text-sm">
              <li class="flex items-start">
                <span class="text-primary mr-2">✓</span>
                Bilan nutritionnel complet
              </li>
              <li class="flex items-start">
                <span class="text-primary mr-2">✓</span>
                Plan alimentaire personnalisé
              </li>
              <li class="flex items-start">
                <span class="text-primary mr-2">✓</span>
                Conseils et recommandations
              </li>
              <li class="flex items-start">
                <span class="text-primary mr-2">✓</span>
                Suivi et ajustements
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFirebaseBookingStore } from '../stores/firebaseBooking'

const bookingStore = useFirebaseBookingStore()

const form = ref({
  name: '',
  email: '',
  phone: '',
  message: ''
})

const selectedDate = ref('')
const selectedTime = ref('')
const availableSlots = ref([])

const availableDates = ['2025-01-20', '2025-01-21', '2025-01-22', '2025-01-23', '2025-01-24']

const canSubmit = computed(() => 
  form.value.name && 
  form.value.email && 
  form.value.phone && 
  selectedDate.value && 
  selectedTime.value
)

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

const loadAvailableSlots = () => {
  if (selectedDate.value) {
    availableSlots.value = bookingStore.getAvailableSlotsByDate(selectedDate.value)
    selectedTime.value = ''
  }
}

const submitBooking = async () => {
  if (canSubmit.value) {
    const success = await bookingStore.createBooking({
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone,
      date: selectedDate.value,
      time: selectedTime.value,
      message: form.value.message
    })
    
    if (success) {
      alert(`Consultation réservée avec succès pour le ${formatDate(selectedDate.value)} à ${selectedTime.value}`)
      
      // Reset form
      form.value = { name: '', email: '', phone: '', message: '' }
      selectedDate.value = ''
      selectedTime.value = ''
      availableSlots.value = []
    }
  }
}

onMounted(() => {
  bookingStore.loadBookings()
})
</script>