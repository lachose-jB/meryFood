<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6" @click.stop>
      <div class="text-center mb-4">
        <h2 class="font-title font-bold text-xl text-gray-900 mb-2">
          Recevez vos e-books gratuits par email
        </h2>
        <p class="text-gray-600">Entrez votre email pour recevoir tous les e-books gratuits du panier.</p>
      </div>

      <div v-if="success" class="text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 class="font-semibold text-lg text-gray-900 mb-2">E-books envoyés !</h3>
        <p class="text-gray-600 mb-6">
          Les e-books ont été envoyés à <strong>{{ form.email }}</strong>. Vérifiez votre boîte mail (et vos spams).
        </p>
        <button @click="$emit('close')" class="btn-primary w-full">Fermer</button>
      </div>

      <form v-else @submit.prevent="handleSendEmail" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Votre adresse email *
          </label>
          <input 
            v-model="form.email"
            type="email" 
            required
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary"
            placeholder="votre@email.com"
          >
        </div>

        <div class="flex items-start">
          <input 
            v-model="form.acceptTerms"
            type="checkbox" 
            required
            class="mt-1 text-primary focus:ring-primary"
          >
          <label class="ml-2 text-sm text-gray-600">
            J'accepte de recevoir ces e-books par email et d'être informé(e) des nouveautés.
          </label>
        </div>

        <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>

        <div class="flex space-x-4">
          <button 
            type="button"
            @click="$emit('close')"
            class="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button 
            type="submit"
            :disabled="loading"
            class="flex-1 btn-primary"
          >
            {{ loading ? 'Envoi...' : 'Envoyer' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ebookDownloadService } from '../services/ebookDownloadService' // 👈 corrige ici
import type { Product } from '../types'

interface Props {
  products: Product[]
}

const props = defineProps<Props>()
const emit = defineEmits(['close'])

const form = ref({
  email: '',
  acceptTerms: false
})

const loading = ref(false)
const error = ref('')
const success = ref(false)

const handleSendEmail = async () => {
  if (props.products.length === 0) {
    error.value = 'Aucun e-book à envoyer.'
    return
  }

  loading.value = true
  error.value = ''

  try {
    // Appel à EmailJS
    await ebookDownloadService.sendEbooksByEmail({
      email: form.value.email,
      products: props.products.map(p => ({
        name: p.name,
        pdfUrl: p.pdfUrl ?? ''
      }))
    })

    success.value = true

  } catch (err: any) {
    error.value = 'Erreur lors de l’envoi. Veuillez réessayer.'
    console.error('Erreur envoi e-books:', err)
  } finally {
    loading.value = false
  }
}

</script>
