import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface TimeSlot {
  id: string
  date: string
  time: string
  available: boolean
}

export interface Booking {
  id: string
  name: string
  email: string
  phone: string
  date: string
  time: string
  message?: string
  status: 'pending' | 'confirmed' | 'cancelled'
}

export const useBookingStore = defineStore('booking', () => {
  const availableSlots = ref<TimeSlot[]>([
    // Mock data for available time slots
    { id: '1', date: '2025-01-20', time: '09:00', available: true },
    { id: '2', date: '2025-01-20', time: '10:30', available: true },
    { id: '3', date: '2025-01-20', time: '14:00', available: false },
    { id: '4', date: '2025-01-20', time: '15:30', available: true },
    { id: '5', date: '2025-01-21', time: '09:00', available: true },
    { id: '6', date: '2025-01-21', time: '10:30', available: true },
    { id: '7', date: '2025-01-21', time: '14:00', available: true },
    { id: '8', date: '2025-01-22', time: '09:00', available: true },
    { id: '9', date: '2025-01-22', time: '15:30', available: true },
  ])

  const bookings = ref<Booking[]>([])

  const createBooking = (bookingData: Omit<Booking, 'id' | 'status'>) => {
    const booking: Booking = {
      id: Date.now().toString(),
      ...bookingData,
      status: 'pending'
    }
    
    bookings.value.push(booking)
    
    // Mark slot as unavailable
    const slot = availableSlots.value.find(
      s => s.date === booking.date && s.time === booking.time
    )
    if (slot) {
      slot.available = false
    }
    
    return booking
  }

  const getAvailableSlotsByDate = (date: string) => {
    return availableSlots.value.filter(slot => 
      slot.date === date && slot.available
    )
  }

  return {
    availableSlots,
    bookings,
    createBooking,
    getAvailableSlotsByDate
  }
})