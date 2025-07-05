<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div class="p-6 border-b">
        <h2 class="font-title font-semibold text-xl">Modifier l'article</h2>
      </div>

      <div v-if="success" class="p-6 text-green-600 text-center">
        <div class="mb-4">✅ Article modifié avec succès !</div>
        <button @click="$emit('close')" class="btn-primary">
          Fermer
        </button>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Titre de l'article *
          </label>
          <input 
            v-model="form.title"
            type="text" 
            required
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary"
            placeholder="Titre de l'article"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Résumé *
          </label>
          <textarea 
            v-model="form.excerpt"
            rows="2"
            required
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary"
            placeholder="Résumé de l'article"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Contenu *
          </label>
          <textarea 
            v-model="form.content"
            rows="8"
            required
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary"
            placeholder="Contenu complet de l'article"
          ></textarea>
        </div>

        <!-- Image actuelle -->
        <div v-if="form.image">
          <label class="block text-sm font-medium text-gray-700 mb-2">Image actuelle</label>
          <img :src="form.image" alt="Image actuelle" class="w-64 h-40 object-cover rounded-lg border" />
        </div>

        <!-- Nouvelle image (optionnelle) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Changer l'image (optionnel)
          </label>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            @change="handleImageUpload"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary"
          >
          
          <!-- Informations sur les contraintes -->
          <div class="mt-2 text-xs text-gray-500">
            <p>• Formats acceptés: JPEG, PNG, WebP</p>
            <p>• Taille maximum: 3 Mo</p>
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

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Auteur *
            </label>
            <input 
              v-model="form.author"
              type="text" 
              required
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary"
              placeholder="Nom de l'auteur"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Date de publication *
            </label>
            <input 
              v-model="form.date"
              type="date" 
              required
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Temps de lecture *
            </label>
            <input 
              v-model="form.readTime"
              type="text" 
              required
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary"
              placeholder="5 min"
            >
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Tags (séparés par des virgules) *
          </label>
          <input 
            v-model="tagsInput"
            type="text" 
            required
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary"
            placeholder="nutrition, santé, conseils"
          >
        </div>

        <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>

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
            {{ loading ? 'Modification...' : 'Modifier l\'article' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { uploadBlogImage } from '../../services/firebase'
import type { BlogPost } from '../../types'

interface Props {
  article: BlogPost
}

const props = defineProps<Props>()
const emit = defineEmits(['close', 'save'])

const form = ref({
  id: '',
  title: '',
  excerpt: '',
  content: '',
  image: '',
  author: '',
  date: '',
  readTime: ''
})

const tagsInput = ref('')
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
      if (file.size > 3 * 1024 * 1024) {
        throw new Error('Image trop volumineuse (max 3 Mo)')
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
      
      imageUrl = await uploadBlogImage(imageFile)
      
      uploading.value = false
    }

    const articleData: BlogPost = {
      id: form.value.id,
      title: form.value.title,
      excerpt: form.value.excerpt,
      content: form.value.content,
      image: imageUrl,
      author: form.value.author,
      date: form.value.date,
      readTime: form.value.readTime,
      tags: tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag)
    }
    
    emit('save', articleData)
    success.value = true

  } catch (err: any) {
    error.value = err.message || 'Erreur lors de la modification de l\'article'
  } finally {
    loading.value = false
    uploading.value = false
  }
}

onMounted(() => {
  // Initialiser le formulaire avec les données de l'article
  form.value = {
    id: props.article.id!,
    title: props.article.title,
    excerpt: props.article.excerpt,
    content: props.article.content,
    image: props.article.image,
    author: props.article.author,
    date: props.article.date,
    readTime: props.article.readTime
  }
  
  tagsInput.value = props.article.tags.join(', ')
})
</script>