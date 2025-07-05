<template>
  <div v-if="article" class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <!-- Breadcrumb -->
      <nav class="mb-8">
        <ol class="flex items-center space-x-2 text-sm">
          <li><router-link to="/" class="text-gray-500 hover:text-primary">Accueil</router-link></li>
          <li class="text-gray-300">/</li>
          <li><router-link to="/blog" class="text-gray-500 hover:text-primary">Blog</router-link></li>
          <li class="text-gray-300">/</li>
          <li class="text-gray-900">{{ article.title }}</li>
        </ol>
      </nav>

      <!-- Article Header -->
      <header class="mb-8">
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <img 
            :src="article.image" 
            :alt="article.title"
            class="w-full h-64 md:h-80 object-cover"
          >
          <div class="p-8">
            <div class="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              <span>{{ formatDate(article.date) }}</span>
              <span>•</span>
              <span>{{ article.readTime }}</span>
              <span>•</span>
              <span>{{ article.author }}</span>
            </div>
            
            <h1 class="font-title font-bold text-3xl md:text-4xl text-gray-900 mb-4">
              {{ article.title }}
            </h1>
            
            <p class="text-xl text-gray-600 leading-relaxed mb-6">
              {{ article.excerpt }}
            </p>
            
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="tag in article.tags" 
                :key="tag"
                class="bg-nature-100 text-nature-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                #{{ tag }}
              </span>
            </div>
          </div>
        </div>
      </header>

      <!-- Article Content -->
      <article class="bg-white rounded-xl shadow-sm p-8 mb-8">
        <div class="prose prose-lg max-w-none">
          <div v-html="formattedContent"></div>
        </div>
      </article>

      <!-- Author Bio -->
      <div class="bg-white rounded-xl shadow-sm p-8 mb-8">
        <h3 class="font-title font-semibold text-xl mb-4">À propos de l'auteur</h3>
        <div class="flex items-start space-x-4">
          <img 
            src="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=200" 
            alt="Merry Dubois"
            class="w-16 h-16 rounded-full object-cover"
          >
          <div>
            <h4 class="font-semibold text-lg">{{ article.author }}</h4>
            <p class="text-gray-600 mb-3">Nutritionniste diplômée</p>
            <p class="text-gray-600 text-sm">
              Spécialisée en nutrition préventive et thérapeutique, Merry accompagne ses clients 
              vers une alimentation équilibrée et adaptée à leurs besoins spécifiques.
            </p>
          </div>
        </div>
      </div>

      <!-- Related Articles -->
      <div v-if="relatedArticles.length > 0" class="bg-white rounded-xl shadow-sm p-8">
        <h3 class="font-title font-semibold text-xl mb-6">Articles similaires</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <article 
            v-for="relatedArticle in relatedArticles" 
            :key="relatedArticle.id"
            class="group cursor-pointer"
            @click="goToArticle(relatedArticle.id!)"
          >
            <div class="relative h-40 overflow-hidden rounded-lg mb-4">
              <img 
                :src="relatedArticle.image" 
                :alt="relatedArticle.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              >
            </div>
            <div class="space-y-2">
              <div class="flex items-center space-x-2 text-sm text-gray-500">
                <span>{{ formatDate(relatedArticle.date) }}</span>
                <span>•</span>
                <span>{{ relatedArticle.readTime }}</span>
              </div>
              <h4 class="font-title font-semibold text-lg group-hover:text-primary transition-colors">
                {{ relatedArticle.title }}
              </h4>
              <p class="text-gray-600 text-sm line-clamp-2">
                {{ relatedArticle.excerpt }}
              </p>
            </div>
          </article>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="mt-12 bg-primary rounded-xl p-8 text-center">
        <h3 class="font-title font-bold text-2xl text-white mb-4">
          Besoin de conseils personnalisés ?
        </h3>
        <p class="text-white/90 mb-6">
          Réservez votre consultation avec notre nutritionniste experte
        </p>
        <router-link to="/consultation" class="btn-secondary">
          Prendre rendez-vous
        </router-link>
      </div>
    </div>
  </div>

  <div v-else class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p class="text-gray-500">Chargement de l'article...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBlogStore } from '../stores/blog'
import type { BlogPost } from '../types'

const route = useRoute()
const router = useRouter()
const blogStore = useBlogStore()
const article = ref<BlogPost | null>(null)

const formattedContent = computed(() => {
  if (!article.value) return ''
  
  // Convert line breaks to paragraphs
  return article.value.content
    .split('\n\n')
    .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
    .join('')
})

const relatedArticles = computed(() => {
  if (!article.value) return []
  
  // Find articles with similar tags
  return blogStore.posts
    .filter(post => 
      post.id !== article.value!.id && 
      post.tags.some(tag => article.value!.tags.includes(tag))
    )
    .slice(0, 2)
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

const goToArticle = (articleId: string) => {
  router.push(`/article/${articleId}`)
}

onMounted(async () => {
  const articleId = route.params.id as string
  if (articleId) {
    article.value = await blogStore.getPostById(articleId)
  }
})
</script>