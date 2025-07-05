import { defineStore } from 'pinia'
import { ref } from 'vue'
import { blogService } from '../services/firebase'
import type { BlogPost } from '../types'

export const useBlogStore = defineStore('blog', () => {
  const posts = ref<BlogPost[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Charger tous les articles
  const loadPosts = async () => {
    loading.value = true
    error.value = null
    try {
      posts.value = await blogService.getAll()
    } catch (err) {
      error.value = 'Erreur lors du chargement des articles'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // Charger un article par ID
  const getPostById = async (id: string): Promise<BlogPost | null> => {
    try {
      return await blogService.getById(id)
    } catch (err) {
      error.value = 'Erreur lors du chargement de l\'article'
      console.error(err)
      return null
    }
  }

  // Charger articles par tag
  const getPostsByTag = async (tag: string): Promise<BlogPost[]> => {
    try {
      return await blogService.getByTag(tag)
    } catch (err) {
      error.value = 'Erreur lors du chargement par tag'
      console.error(err)
      return []
    }
  }

  // Ajouter un article (admin)
  const addPost = async (post: Omit<BlogPost, 'id'>): Promise<boolean> => {
    try {
      const id = await blogService.add(post)
      if (id) {
        await loadPosts() // Recharger la liste
        return true
      }
      return false
    } catch (err) {
      error.value = 'Erreur lors de l\'ajout de l\'article'
      console.error(err)
      return false
    }
  }

  // Mettre à jour un article (admin)
  const updatePost = async (id: string, updates: Partial<BlogPost>): Promise<boolean> => {
    try {
      const success = await blogService.update(id, updates)
      if (success) {
        await loadPosts() // Recharger la liste
      }
      return success
    } catch (err) {
      error.value = 'Erreur lors de la mise à jour de l\'article'
      console.error(err)
      return false
    }
  }

  // Supprimer un article (admin)
  const deletePost = async (id: string): Promise<boolean> => {
    try {
      const success = await blogService.delete(id)
      if (success) {
        await loadPosts() // Recharger la liste
      }
      return success
    } catch (err) {
      error.value = 'Erreur lors de la suppression de l\'article'
      console.error(err)
      return false
    }
  }

  return {
    posts,
    loading,
    error,
    loadPosts,
    getPostById,
    getPostsByTag,
    addPost,
    updatePost,
    deletePost
  }
})