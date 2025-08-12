<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div class="p-6 border-b">
        <h2 class="font-title font-semibold text-xl">Ajouter une promotion</h2>
      </div>

      <div v-if="success" class="p-6 text-green-600 text-center">
        <div class="mb-4">✅ Promotion ajoutée avec succès !</div>
        <button @click="$emit('close')" class="btn-primary">
          Fermer
        </button>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Titre -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Titre de la promotion *</label>
          <input 
            v-model="form.title"
            type="text" 
            required
            minlength="5"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary"
            placeholder="Ex: Offre spéciale été"
          >
          <div class="mt-1 text-xs text-gray-500">Minimum 5 caractères</div>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Description *</label>
          <textarea 
            v-model="form.description"
            rows="3"
            required
            minlength="10"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary"
            placeholder="Description de la promotion"
          ></textarea>
          <div class="mt-1 text-xs text-gray-500">Minimum 10 caractères</div>
        </div>

        <!-- Pourcentage de réduction -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Pourcentage de réduction *</label>
          <input 
            v-model.number="form.discountPercentage"
            type="number" 
            min="1"
            max="100"
            required
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary"
            placeholder="Ex: 20"
          >
          <div class="mt-1 text-xs text-gray-500">Minimum 1% requis</div>
        </div>

        <!-- Dates de validité -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date de début *</label>
            <input 
              v-model="form.validFrom"
              type="date" 
              required
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date de fin *</label>
            <input 
              v-model="form.validUntil"
              type="date" 
              required
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary"
            >
          </div>
        </div>

        <!-- Code promo -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Code promo (optionnel)</label>
          <input 
            v-model="form.promoCode"
            type="text" 
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary"
            placeholder="Ex: SUMMER2025"
          >
        </div>

        <!-- Image -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Image de la promotion *</label>
          <div class="mb-2 text-sm text-gray-600">
            Veuillez sélectionner une image illustrant la promotion. Elle sera affichée sur le site et doit être attractive pour les clients.
          </div>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            @change="handleImageUpload"
            required
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary"
          >
          <div class="mt-2 text-xs text-gray-500">
            <p>• Formats acceptés: JPEG, PNG, WebP</p>
            <p>• Taille maximum: 2 Mo</p>
          </div>
          <div v-if="uploading" class="text-sm text-blue-600 mt-2 flex items-center">
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
            Upload en cours...
          </div>
          <div v-if="imageError" class="text-sm text-red-600 mt-2">
            {{ imageError }}
          </div>
          <div v-if="imagePreview" class="mt-4 flex flex-col items-center">
            <img :src="imagePreview" alt="Aperçu de l'image sélectionnée" class="rounded-lg w-full max-h-64 object-contain border mb-2" />
            <span class="text-xs text-gray-500">Aperçu de l'image sélectionnée</span>
          </div>
        </div>

        <!-- Active -->
        <div class="flex items-center">
          <input 
            v-model="form.isActive"
            type="checkbox" 
            class="text-primary focus:ring-primary"
          >
          <label class="ml-2 text-sm text-gray-700">Promotion active</label>
        </div>

        <!-- Erreur -->
        <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>

        <!-- Boutons -->
        <div class="flex justify-end space-x-4 pt-6 border-t">
          <button 
            type="button"
            @click="$emit('close')"
            class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button 
            type="submit"
            :disabled="loading || uploading || !isFormValid"
            :class="{'opacity-50 cursor-not-allowed': loading || uploading || !isFormValid}"
            class="btn-primary"
          >
            {{ loading ? 'Ajout en cours...' : 'Ajouter la promotion' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Timestamp } from 'firebase/firestore'
import { usePromotionStore } from '../../stores/promotions'
import { uploadPromotionImage } from '../../services/firebase' // assure-toi d’avoir ce fichier avec la fonction upload ci-dessous

const emit = defineEmits(['close', 'save'])
const promotionStore = usePromotionStore()

const form = ref({
  title: '',
  description: '',
  discountPercentage: 0,
  validFrom: '',
  validUntil: '',
  promoCode: '',
  image: '',
  isActive: true
})

const loading = ref(false)
const error = ref('')
const uploading = ref(false)
const uploadProgress = ref(0)
const imageError = ref('')
const imagePreview = ref<string | null>(null)
let imageFile: File | null = null
const success = ref(false)

const isFormValid = computed(() => {
  error.value = '' // reset avant validation

  if (
    !form.value.title ||
    !form.value.description ||
    form.value.discountPercentage <= 0 ||
    !form.value.validFrom ||
    !form.value.validUntil ||
    !imageFile
  ) {
    return false
  }

  const startDate = new Date(form.value.validFrom)
  const endDate = new Date(form.value.validUntil)
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    error.value = 'Dates invalides'
    return false
  }

  if (endDate <= startDate) {
    error.value = "La date de fin doit être après la date de début"
    return false
  }

  return true
})

const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  imageError.value = ''

  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
    imagePreview.value = null
  }

  if (target.files && target.files[0]) {
    const file = target.files[0]

    try {
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('Image trop volumineuse (max 2 Mo)')
      }

      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!validTypes.includes(file.type)) {
        throw new Error('Format non supporté (JPEG, PNG, WebP uniquement)')
      }

      imageFile = file
      imagePreview.value = URL.createObjectURL(file)
    } catch (err: any) {
      imageError.value = err.message
      imageFile = null
      target.value = ''
    }
  }
}

const handleSubmit = async () => {
  if (!isFormValid.value) {
    error.value = error.value || 'Veuillez remplir tous les champs obligatoires'
    return
  }

  loading.value = true
  error.value = ''
  success.value = false
  uploadProgress.value = 0

  try {
    if (!imageFile) throw new Error('Aucune image sélectionnée')

    uploading.value = true
    const imageUrl = await uploadPromotionImage(imageFile, (percent) => {
      uploadProgress.value = percent
    })
    uploading.value = false

    const validFromDate = new Date(form.value.validFrom)
    const validUntilDate = new Date(form.value.validUntil)

    if (isNaN(validFromDate.getTime()) || isNaN(validUntilDate.getTime())) {
      throw new Error('Dates invalides')
    }

    const validFrom = Timestamp.fromDate(validFromDate)
    const validUntil = Timestamp.fromDate(validUntilDate)

    const promotionData = {
      title: form.value.title,
      description: form.value.description,
      discount: Number(form.value.discountPercentage),
      validFrom,
      validUntil,
      promoCode: form.value.promoCode || null,
      image: imageUrl,
      isActive: form.value.isActive,
      createdAt: Timestamp.now()
    }

    const added = await promotionStore.addPromotion(promotionData)
    if (!added) {
      throw new Error("Échec de l'ajout de la promotion")
    }

    emit('save', promotionData)
    success.value = true
    resetForm()

  } catch (e: any) {
    console.error("Erreur:", e)
    error.value = e.message || "Erreur lors de l'enregistrement"
    cleanImagePreview()
  } finally {
    loading.value = false
    uploading.value = false
    uploadProgress.value = 0
  }
}

const resetForm = () => {
  form.value = {
    title: '',
    description: '',
    discountPercentage: 0,
    validFrom: '',
    validUntil: '',
    promoCode: '',
    image: '',
    isActive: true
  }
  error.value = ''
  imageError.value = ''
  cleanImagePreview()
}

const cleanImagePreview = () => {
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
    imagePreview.value = null
  }
  imageFile = null
}
</script>

