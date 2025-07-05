import { defineStore } from 'pinia'
import { ref } from 'vue'
import { bookingService, type Booking } from '../services/firebase'

export const useFirebaseBookingStore = defineStore('firebaseBooking', () => {
  const bookings = ref<Booking[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Charger toutes les réservations
  const loadBookings = async () => {
    loading.value = true
    error.value = null
    try {
      bookings.value = await bookingService.getAll()
    } catch (err: unknown) {
      error.value = 'Erreur lors du chargement des réservations'
      console.error('loadBookings error:', err)
    } finally {
      loading.value = false
    }
  }

  // Créer une réservation
  const createBooking = async (bookingData: Omit<Booking, 'id'>): Promise<boolean> => {
    try {
      const id = await bookingService.add({
        ...bookingData,
        status: 'pending'
      })
      
      if (id) {
        await loadBookings() // Recharger la liste
        return true
      }
      return false
    } catch (err: unknown) {
      error.value = 'Erreur lors de la création de la réservation'
      console.error('createBooking error:', err)
      return false
    }
  }

  // Mettre à jour une réservation
  const updateBooking = async (id: string, updates: Partial<Booking>): Promise<boolean> => {
    try {
      const success = await bookingService.update(id, updates)
      if (success) {
        await loadBookings() // Recharger la liste
      }
      return success
    } catch (err: unknown) {
      error.value = 'Erreur lors de la mise à jour de la réservation'
      console.error('updateBooking error:', err)
      return false
    }
  }

  // Confirmer une réservation
  const confirmBooking = async (id: string): Promise<boolean> => {
    return updateBooking(id, { status: 'confirmed' })
  }

  // Annuler une réservation
  const cancelBooking = async (id: string): Promise<boolean> => {
    return updateBooking(id, { status: 'cancelled' })
  }

  // Créneaux disponibles simulés (à adapter selon vos besoins)
  const getAvailableSlotsByDate = (date: string) => {
    const timeSlots = [
      { id: '1', date, time: '09:00', available: true },
      { id: '2', date, time: '10:30', available: true },
      { id: '3', date, time: '14:00', available: true },
      { id: '4', date, time: '15:30', available: true },
    ]

    // Filtrer les créneaux déjà réservés (non annulés)
    const bookedTimes = bookings.value
      .filter(booking => booking.date === date && booking.status !== 'cancelled')
      .map(booking => booking.time)

    return timeSlots.filter(slot => !bookedTimes.includes(slot.time))
  }

  return {
    bookings,
    loading,
    error,
    loadBookings,
    createBooking,
    updateBooking,
    confirmBooking,
    cancelBooking,
    getAvailableSlotsByDate
  }
})