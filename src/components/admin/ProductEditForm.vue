<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div class="p-6 border-b">
        <h2 class="font-title font-semibold text-xl">Modifier le produit</h2>
      </div>

      <div v-if="success" class="p-6 text-green-600 text-center">
        <div class="mb-4">✅ Produit modifié avec succès !</div>
        <button @click="$emit('close')" class="btn-primary">
          Fermer
        </button>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Nom -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Nom du produit *</label>
          <input 
            v-model="form.name"
            type="text" 
            required
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary"
            placeholder="Nom du produit"
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
            placeholder="Description du produit"
          ></textarea>
        </div>

        <!-- Prix + Catégorie -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Prix *</label>
            <input 
              v-model.number="form.price"
              type="number" 
              step="0.01"
              required
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary"
              placeholder="0.00"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Catégorie *</label>
            <select 
              v-model="form.category"
              required
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary"
            >
              <option value="">Choisir une catégorie</option>
              <option value="ebook">E-book</option>
              <option value="repas">Repas</option>
              <option value="ingredient">Ingrédient</option>
              <option value="farine">Farine</option>
              <option value="boisson">Boisson</option>
              <option value="amuse-gueule">Amuse-gueule</option>
              <option value="program">Programme</option>
            </select>
          </div>
        </div>

        <!-- Image actuelle -->
        <div v-if="form.image">
          <label class="block text-sm font-medium text-gray-700 mb-2">Image actuelle</label>
          <img :src="form.image" alt="Image actuelle" class="w-32 h-32 object-cover rounded-lg border" />
        </div>

        <!-- Nouvelle image (optionnelle) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Changer l'image (optionnel)</label>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            @change="handleImageUpload"
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
          
          <!-- Aperçu de la nouvelle image -->
          <div v-if="imagePreview" class="mt-4">
            <img :src="imagePreview" alt="Aperçu" class="rounded-lg w-full max-h-64 object-contain border" />
          </div>
        </div>

        <!-- Note + Avis -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Note (optionnel)</label>
            <input 
              v-model.number="form.rating"
              type="number" 
              step="0.1"
              min="0"
              max="5"
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary"
              placeholder="4.5"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nombre d'avis (optionnel)</label>
            <input 
              v-model.number="form.reviews"
              type="number" 
              min="0"
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary"
              placeholder="25"
            >
          </div>
        </div>

        <!-- En stock -->
        <div class="flex items-center">
          <input 
            v-model="form.inStock"
            type="checkbox" 
            class="text-primary focus:ring-primary"
          >
          <label class="ml-2 text-sm text-gray-700">Produit en stock</label>
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
            :disabled="loading || uploading"
            class="btn-primary"
          >
            {{ loading ? 'Modification...' : 'Modifier le produit' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { uploadProductImage } from '../../services/firebase'
import type { Product } from '../../types'

interface Props {
  product: Product
}

const props = defineProps<Props>()
const emit = defineEmits(['close', 'save'])

const form = ref({
  id: '',
  name: '',
  description: '',
  price: 0,
  category: '',
  image: '',
  rating: null as number | null,
  reviews: null as number | null,
  inStock: true
})

const loading = ref(false)
const error = ref('')
const uploading = ref(false)
const imageError = ref('')
const imagePreview = ref<string | null>(null)
let imageFile: File | null = null
const success = ref(false)

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
      if (target instanceof HTMLInputElement) {
        target.value = '' // Reset input
      }
    }
  }
}

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  success.value = false

  try {
    let imageUrl = form.value.image

    if (imageFile) {
      uploading.value = true

      imageUrl = await uploadProductImage(imageFile)

      uploading.value = false
    }

    const productData: Product = {
      id: form.value.id,
      name: form.value.name,
      description: form.value.description,
      price: form.value.price,
      category: form.value.category as any,
      image: imageUrl,
      rating: form.value.rating ?? undefined,
      reviews: form.value.reviews ?? undefined,
      inStock: form.value.inStock
    }

    emit('save', productData)
    success.value = true

  } catch (e: any) {
    error.value = e.message || "Erreur lors de la modification du produit"
  } finally {
    loading.value = false
    uploading.value = false
  }
}

onMounted(() => {
  // Initialiser le formulaire avec les données du produit
  form.value = {
    id: props.product.id!,
    name: props.product.name,
    description: props.product.description,
    price: props.product.price,
    category: props.product.category,
    image: props.product.image,
    rating: props.product.rating ?? null,
    reviews: props.product.reviews ?? null,
    inStock: props.product.inStock
  }
})
</script>