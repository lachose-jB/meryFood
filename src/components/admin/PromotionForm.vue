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
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary"
            placeholder="Ex: Offre spéciale été"
          >
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Description *</label>
          <textarea 
            v-model="form.description"
            rows="3"
            required
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary"
            placeholder="Description de la promotion"
          ></textarea>
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
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            @change="handleImageUpload"
            required
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary"
          >
          
          <!-- Informations sur les contraintes -->
          <div class="mt-2 text-xs text-gray-500">
            <p>• Formats acceptés: JPEG, PNG, WebP</p>
            <p>• Taille maximum: 2 Mo</p>
          </div>
          
          <!-- État de l'upload -->
          <div v-if="uploading" class="text-sm text-blue-600 mt-2 flex items-center">
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
            Upload en cours...
          </div>
          
          <!-- Validation des erreurs -->
          <div v-if="imageError" class="text-sm text-red-600 mt-2">
            {{ imageError }}
          </div>
          
          <!-- Aperçu de l'image -->
          <div v-if="imagePreview" class="mt-4">
            <img :src="imagePreview" alt="Aperçu" class="rounded-lg w-full max-h-64 object-contain border" />
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
import { uploadPromotionImage } from '../../services/firebase'
import { usePromotionStore } from '../../stores/promotions'

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
const imageError = ref('')
const imagePreview = ref<string | null>(null)
let imageFile: File | null = null
const success = ref(false)

const isFormValid = computed(() => {
  return form.value.title && 
         form.value.description && 
         form.value.discountPercentage > 0 && 
         form.value.validFrom && 
         form.value.validUntil && 
         imageFile !== null
})

const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  imageError.value = ''
  
  if (target.files && target.files[0]) {
    const file = target.files[0]
    
    try {
      // Validation simple côté client
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('Image trop volumineuse (max 2 Mo)')
      }
      
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!validTypes.includes(file.type)) {
        throw new Error('Format d\'image non supporté (JPEG, PNG, WebP uniquement)')
      }
      
      imageFile = file
      const previewUrl = URL.createObjectURL(imageFile)
      imagePreview.value = previewUrl
      
      
    } catch (err: any) {
      imageError.value = err.message
      imageFile = null
      imagePreview.value = null
      target.value = '' // Reset input
    }
  }
}

const handleSubmit = async () => {
  if (!isFormValid.value) {
    error.value = 'Veuillez remplir tous les champs obligatoires'
    return
  }

  loading.value = true
  error.value = ''
  success.value = false

  try {
    let imageUrl = ''

    if (imageFile) {
      uploading.value = true

      imageUrl = await uploadPromotionImage(imageFile)

      uploading.value = false
    }

    const promotionData = {
      title: form.value.title,
      description: form.value.description,
      discountPercentage: form.value.discountPercentage,
      validFrom: form.value.validFrom,
      validUntil: form.value.validUntil,
      promoCode: form.value.promoCode || undefined,
      image: imageUrl,
      isActive: form.value.isActive
    }

    const added = await promotionStore.addPromotion(promotionData)

    if (added) {
      emit('save', promotionData)
      success.value = true

      // Reset form
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
      imageFile = null
      imagePreview.value = null
      imageError.value = ''
    } else {
      error.value = "Erreur lors de l'ajout de la promotion"
    }
  } catch (e: any) {
    error.value = e.message || "Erreur lors de l'ajout de la promotion"
  } finally {
    loading.value = false
    uploading.value = false
  }
}
</script>