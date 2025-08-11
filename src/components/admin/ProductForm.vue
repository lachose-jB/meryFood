<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div class="p-6 border-b">
        <h2 class="font-title font-semibold text-xl">Ajouter un produit</h2>
      </div>

      <div v-if="success" class="p-6 text-green-600 text-center">
        <div class="mb-4">✅ Produit ajouté avec succès !</div>
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
          <p class="mt-1 text-xs text-gray-500">⚠ Minimum 3 caractères</p>
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
          <p class="mt-1 text-xs text-gray-500">⚠ Minimum 10 caractères</p>
        </div>

        <!-- Prix -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Prix *</label>
          <input 
            v-model.number="form.price"
            type="number" 
            step="0.01"
            required
            min="0.01"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary"
            placeholder="0.00"
          >
          <p class="mt-1 text-xs text-gray-500">⚠ Doit être supérieur à 0</p>
        </div>

        <!-- Catégorie -->
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
          <p class="mt-1 text-xs text-gray-500">⚠ Sélection obligatoire</p>
        </div>

        <!-- Image -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Image du produit *</label>
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
            <p>⚠ Image obligatoire</p>
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
            :disabled="loading || uploading || !isFormValid"
            class="btn-primary"
          >
            {{ loading ? 'Ajout en cours...' : 'Ajouter le produit' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import imageCompression from 'browser-image-compression'
import { uploadProductImage } from '../../services/firebase'
import { useProductStore } from '../../stores/products'

const emit = defineEmits(['close', 'save'])
const productStore = useProductStore()

type Category = "ebook" | "program" | "repas" | "ingredient" | "farine" | "boisson" | "amuse-gueule"

const form = ref({
  name: '',
  description: '',
  price: 0,
  category: '' as Category | '',
  image: '',
  rating: undefined,
  reviews: undefined,
  inStock: true
})

const loading = ref(false)
const error = ref('')
const uploading = ref(false)
const imageError = ref('')
const imagePreview = ref<string | null>(null)
let imageFile: File | null = null
const success = ref(false)

const isFormValid = computed(() => {
  return form.value.name.trim().length >= 3 &&
         form.value.description.trim().length >= 10 &&
         form.value.price > 0 &&
         form.value.category &&
         imageFile !== null
})

const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  imageError.value = ''
  
  if (target.files && target.files[0]) {
    let file = target.files[0]
    
    try {
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('Image trop volumineuse (max 2 Mo)')
      }
      
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!validTypes.includes(file.type)) {
        throw new Error('Format d\'image non supporté (JPEG, PNG, WebP uniquement)')
      }

      // Compression de l'image avant upload
      file = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1080,
        useWebWorker: true
      })

      imageFile = file
      imagePreview.value = URL.createObjectURL(file)

    } catch (err: any) {
      imageError.value = err.message
      imageFile = null
      imagePreview.value = null
      target.value = '' // reset input
    }
  }
}

const handleSubmit = async () => {
  if (!isFormValid.value) {
    error.value = 'Veuillez remplir tous les champs obligatoires avec les valeurs minimales requises'
    return
  }

  loading.value = true
  error.value = ''
  success.value = false

  try {
    let imageUrl = ''

    if (imageFile) {
      uploading.value = true

      // Timeout manuel de 60s
      imageUrl = await Promise.race([
        uploadProductImage(imageFile),
        new Promise<string>((_, reject) =>
          setTimeout(() => reject(new Error("Timeout: Upload trop long (60s)")), 60000)
        )
      ])

      uploading.value = false
    }

    const productData = {
      name: form.value.name.trim(),
      description: form.value.description.trim(),
      price: form.value.price,
      category: form.value.category as Category,
      image: imageUrl,
      rating: form.value.rating !== undefined ? form.value.rating : undefined,
      reviews: form.value.reviews !== undefined ? form.value.reviews : undefined,
      inStock: form.value.inStock
    }

    const added = await productStore.addProduct(productData)

    if (added) {
      emit('save', productData)
      success.value = true

      // Reset du formulaire
      form.value = {
        name: '',
        description: '',
        price: 0,
        category: '',
        image: '',
        rating: undefined,
        reviews: undefined,
        inStock: true
      }
      imageFile = null
      imagePreview.value = null
      imageError.value = ''
    } else {
      error.value = "Erreur lors de l'ajout du produit"
    }
  } catch (e: any) {
    error.value = e.message || "Erreur lors de l'ajout du produit"
  } finally {
    loading.value = false
    uploading.value = false
  }
}
</script>
