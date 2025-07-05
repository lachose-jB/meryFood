<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-8">
        <h1 class="font-title font-bold text-3xl text-gray-900 mb-2">Contact</h1>
        <p class="text-gray-600">Une question ? N'hésitez pas à nous contacter</p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Contact Form -->
        <div class="bg-white p-8 rounded-xl shadow-sm">
          <h2 class="font-title font-semibold text-xl mb-6">Envoyez-nous un message</h2>
          
          <form @submit.prevent="submitForm" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Prénom *
                </label>
                <input 
                  v-model="form.firstName"
                  type="text" 
                  required
                  class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary"
                  placeholder="Votre prénom"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nom *
                </label>
                <input 
                  v-model="form.lastName"
                  type="text" 
                  required
                  class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary"
                  placeholder="Votre nom"
                >
              </div>
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
                Téléphone
              </label>
              <input 
                v-model="form.phone"
                type="tel" 
                class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary"
                placeholder="06 12 34 56 78"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Sujet *
              </label>
              <select 
                v-model="form.subject"
                required
                class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary"
              >
                <option value="">Choisir un sujet</option>
                <option value="consultation">Consultation nutritionnelle</option>
                <option value="products">Questions sur les produits</option>
                <option value="partnership">Partenariat</option>
                <option value="support">Support technique</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea 
                v-model="form.message"
                rows="5"
                required
                class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary"
                placeholder="Décrivez votre demande en détail..."
              ></textarea>
            </div>

            <div class="space-y-3">
              <button 
                type="submit"
                class="w-full btn-primary"
                :disabled="loading"
              >
                {{ loading ? 'Envoi...' : 'Envoyer le message' }}
              </button>

              <button 
                type="button"
                @click="sendViaWhatsApp"
                class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                <span>Envoyer via WhatsApp</span>
              </button>
            </div>

            <div v-if="error" class="text-red-600 text-sm">
              {{ error }}
            </div>

            <div v-if="success" class="text-green-600 text-sm">
              Message envoyé avec succès !
            </div>
          </form>
        </div>

        <!-- Contact Info -->
        <div class="space-y-8">
          <!-- Contact Details -->
          <div class="bg-white p-6 rounded-xl shadow-sm">
            <h3 class="font-title font-semibold text-lg mb-4">Nos coordonnées</h3>
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <MapPinIcon class="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p class="font-medium">Adresse</p>
                  <p class="text-gray-600">Paris, France</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <PhoneIcon class="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p class="font-medium">Téléphone</p>
                  <p class="text-gray-600">01 23 45 67 89</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <EnvelopeIcon class="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p class="font-medium">Email</p>
                  <p class="text-gray-600">meryfood@yahoo.com</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <svg class="h-5 w-5 text-green-600 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                <div>
                  <p class="font-medium">WhatsApp</p>
                  <a 
                    href="https://wa.me/+33782593084"
                    target="_blank"
                    class="text-green-600 hover:underline"
                  >
                    +33782593084
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Opening Hours -->
          <div class="bg-white p-6 rounded-xl shadow-sm">
            <h3 class="font-title font-semibold text-lg mb-4">Horaires d'ouverture</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span>Lundi - Dimanche</span>
                <span class="text-gray-600">7h00 - 23h00</span>
              </div>
            </div>
          </div>

          <!-- WhatsApp Quick Contact -->
          <div class="bg-green-50 border border-green-200 p-6 rounded-xl">
            <h3 class="font-title font-semibold text-lg mb-4 text-green-800">Contact rapide</h3>
            <p class="text-green-700 text-sm mb-4">
              Pour une réponse rapide, contactez-nous directement via WhatsApp !
            </p>
            <a 
              href="https://wa.me/33123456789?text=Bonjour%20Mery's%20Food,%20j'aimerais%20avoir%20des%20informations"
              target="_blank"
              class="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              <span>Ouvrir WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/vue/24/outline'
import { contactService } from '../services/firebase'

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
})

const loading = ref(false)
const error = ref('')
const success = ref(false)

const submitForm = async () => {
  loading.value = true
  error.value = ''
  success.value = false
  
  try {
    const result = await contactService.add({
      ...form.value,
      status: 'new'
    })
    
    if (result) {
      success.value = true
      
      // Reset form
      form.value = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      }
    } else {
      error.value = 'Erreur lors de l\'envoi du message'
    }
  } catch (err) {
    error.value = 'Erreur lors de l\'envoi du message'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const sendViaWhatsApp = () => {
  const message = `📧 *Message de Contact - Merry's Food*\n\n` +
    `*Nom:* ${form.value.firstName} ${form.value.lastName}\n` +
    `*Email:* ${form.value.email}\n` +
    `*Téléphone:* ${form.value.phone || 'Non renseigné'}\n` +
    `*Sujet:* ${form.value.subject}\n\n` +
    `*Message:*\n${form.value.message}\n\n` +
    `Merci de me recontacter ! 😊`
  
  const encodedMessage = encodeURIComponent(message)
  const whatsappNumber = "+33782593084"
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
  
  window.open(whatsappUrl, '_blank')
}
</script>