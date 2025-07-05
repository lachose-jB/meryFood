import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product, BlogPost } from '../types'

export const useAdminStore = defineStore('admin', () => {
  const products = ref<Product[]>([])
  const blogPosts = ref<BlogPost[]>([])

  // Product management
  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString()
    }
    products.value.push(newProduct)
    return newProduct
  }

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const index = products.value.findIndex(p => p.id === id)
    if (index !== -1) {
      products.value[index] = { ...products.value[index], ...updates }
    }
  }

  const deleteProduct = (id: string) => {
    const index = products.value.findIndex(p => p.id === id)
    if (index !== -1) {
      products.value.splice(index, 1)
    }
  }

  // Blog management
  const addBlogPost = (post: Omit<BlogPost, 'id'>) => {
    const newPost: BlogPost = {
      ...post,
      id: Date.now().toString()
    }
    blogPosts.value.push(newPost)
    return newPost
  }

  const updateBlogPost = (id: string, updates: Partial<BlogPost>) => {
    const index = blogPosts.value.findIndex(p => p.id === id)
    if (index !== -1) {
      blogPosts.value[index] = { ...blogPosts.value[index], ...updates }
    }
  }

  const deleteBlogPost = (id: string) => {
    const index = blogPosts.value.findIndex(p => p.id === id)
    if (index !== -1) {
      blogPosts.value.splice(index, 1)
    }
  }

  return {
    products,
    blogPosts,
    addProduct,
    updateProduct,
    deleteProduct,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost
  }
})