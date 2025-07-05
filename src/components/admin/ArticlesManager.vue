<template>
  <div class="space-y-6">
    <!-- Formulaire d'édition modal -->
    <ArticleEditForm 
      v-if="editingArticle"
      :article="editingArticle"
      @close="editingArticle = null"
      @save="handleArticleUpdate"
    />

    <!-- Loading State -->
    <div v-if="blogStore.loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      <p class="mt-4 text-gray-600">Chargement des articles...</p>
    </div>

    <!-- Articles Table -->
    <div v-else class="bg-white rounded-lg border">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Article
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Auteur
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tags
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="article in blogStore.posts" :key="article.id">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <img 
                    :src="article.image" 
                    :alt="article.title"
                    class="h-12 w-12 rounded-lg object-cover"
                  >
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ article.title }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ article.excerpt.substring(0, 60) }}...
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ article.author }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(article.date) }}
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="tag in article.tags.slice(0, 2)" 
                    :key="tag"
                    class="px-2 py-1 text-xs bg-nature-100 text-nature-800 rounded-md"
                  >
                    #{{ tag }}
                  </span>
                  <span v-if="article.tags.length > 2" class="text-xs text-gray-500">
                    +{{ article.tags.length - 2 }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button 
                  @click="editArticle(article)"
                  class="text-primary hover:text-primary/80"
                >
                  Modifier
                </button>
                <button 
                  @click="deleteArticle(article.id!)"
                  class="text-red-600 hover:text-red-800"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBlogStore } from '../../stores/blog'
import ArticleEditForm from './ArticleEditForm.vue'
import type { BlogPost } from '../../types'

const blogStore = useBlogStore()
const editingArticle = ref<BlogPost | null>(null)

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR')
}

const editArticle = (article: any) => {
  editingArticle.value = { ...article }
}

const deleteArticle = async (id: string) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
    const success = await blogStore.deletePost(id)
    if (!success) {
      alert('Erreur lors de la suppression de l\'article')
    }
  }
}

const handleArticleUpdate = async (updatedArticle: BlogPost) => {
  const success = await blogStore.updatePost(updatedArticle.id!, updatedArticle)
  if (success) {
    editingArticle.value = null
  } else {
    alert('Erreur lors de la mise à jour de l\'article')
  }
}

onMounted(() => {
  blogStore.loadPosts()
})
</script>