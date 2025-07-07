<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-8">
        <h1 class="font-title font-bold text-3xl text-gray-900 mb-2">Blog Nutrition</h1>
        <p class="text-gray-600">Conseils, recettes et astuces pour une alimentation saine</p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Loading State -->
      <div v-if="blogStore.loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p class="mt-4 text-gray-600">Chargement des articles...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="blogStore.error" class="text-center py-12">
        <p class="text-red-600 mb-4">{{ blogStore.error }}</p>
        <button @click="blogStore.loadPosts()" class="btn-primary">
          Réessayer
        </button>
      </div>

      <!-- Blog Content -->
      <div v-else>
        <!-- Featured Post -->
        <div v-if="featuredPost" class="mb-12">
          <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div class="grid grid-cols-1 lg:grid-cols-2">
              <div class="relative h-64 lg:h-auto">
                <img 
                  :src="featuredPost.image" 
                  :alt="featuredPost.title"
                  class="w-full h-full object-cover"
                >
                <div class="absolute top-4 left-4">
                  <span class="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                    Article vedette
                  </span>
                </div>
              </div>
              <div class="p-8 flex flex-col justify-center">
                <div class="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <span>{{ formatDate(featuredPost.date) }}</span>
                  <span>•</span>
                  <span>{{ featuredPost.readTime }}</span>
                  <span>•</span>
                  <span>{{ featuredPost.author }}</span>
                </div>
                <h2 class="font-title font-bold text-2xl text-gray-900 mb-4">
                  {{ featuredPost.title }}
                </h2>
                <p class="text-gray-600 mb-6">
                  {{ featuredPost.excerpt }}
                </p>
                <div class="flex items-center space-x-2 mb-4">
                  <span 
                    v-for="tag in featuredPost.tags" 
                    :key="tag"
                    class="bg-nature-100 text-nature-800 px-2 py-1 rounded-md text-xs font-medium"
                  >
                    #{{ tag }}
                  </span>
                </div>
                <button class="btn-primary w-fit">
                  <span @click="goToArticle(featuredPost.id!)">Lire l'article</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Blog Posts Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article
            v-for="post in otherPosts"
            :key="post.id"
            class="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-shadow cursor-pointer"
            @click="goToArticle(post.id!)"
          >
            <div class="relative h-48 overflow-hidden">
              <img
                :src="post.image"
                :alt="post.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div class="p-6">
              <div class="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                <span>{{ formatDate(post.date) }}</span>
                <span>•</span>
                <span>{{ post.readTime }}</span>
              </div>
              <h3 class="font-title font-semibold text-lg text-gray-900 mb-3 group-hover:text-primary transition-colors">
                {{ post.title }}
              </h3>
              <p class="text-gray-600 text-sm mb-4 line-clamp-3">
                {{ post.excerpt }}
              </p>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span
                    v-for="tag in post.tags.slice(0, 2)"
                    :key="tag"
                    class="bg-nature-100 text-nature-800 px-2 py-1 rounded-md text-xs font-medium"
                  >
                    #{{ tag }}
                  </span>
                </div>
                <span class="text-primary text-sm font-medium group-hover:underline">
                  Lire →
                </span>
              </div>
            </div>
          </article>
        </div>


        <!-- Newsletter Signup -->
        <section class="mt-16 bg-primary rounded-2xl p-8 text-center">
          <h3 class="font-title font-bold text-2xl text-white mb-4">
            Restez informé de nos derniers articles
          </h3>
          <p class="text-white/90 mb-6">
            Recevez nos conseils nutrition directement dans votre boîte mail
          </p>
          <div class="max-w-md mx-auto flex gap-4">
            <input 
              type="email" 
              placeholder="Votre adresse email"
              class="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white"
            >
            <button class="btn-secondary whitespace-nowrap">
              S'abonner
            </button>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBlogStore } from '../stores/blog'

const router = useRouter()
const blogStore = useBlogStore()

const featuredPost = computed(() => blogStore.posts[0])
const otherPosts = computed(() => blogStore.posts.slice(1))

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

const goToArticle = (articleId: string) => {
  // Trouver l'article et créer un slug à partir du titre
  const article = blogStore.posts.find(post => post.id === articleId)
  if (article) {
    const titleSlug = article.title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()
    router.push(`/article/${titleSlug}`)
  }
}

onMounted(() => {
  blogStore.loadPosts()
})
</script>