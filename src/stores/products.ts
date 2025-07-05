import { defineStore } from 'pinia'
import { ref } from 'vue'
import { productService } from '../services/firebase'
import type { Product } from '../types'

export const useProductStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Charger tous les produits
  const loadProducts = async () => {
    loading.value = true
    error.value = null
    try {
      products.value = await productService.getAll()
    } catch (err) {
      error.value = 'Erreur lors du chargement des produits'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // Charger un produit par ID
  const getProductById = async (id: string): Promise<Product | null> => {
    try {
      return await productService.getById(id)
    } catch (err) {
      error.value = 'Erreur lors du chargement du produit'
      console.error(err)
      return null
    }
  }

  // Charger produits par catégorie
  const getProductsByCategory = async (category: string): Promise<Product[]> => {
    try {
      return await productService.getByCategory(category)
    } catch (err) {
      error.value = 'Erreur lors du chargement par catégorie'
      console.error(err)
      return []
    }
  }

  // Ajouter un produit (admin)
  const addProduct = async (product: Omit<Product, 'id'>): Promise<boolean> => {
    try {
      const id = await productService.add(product)
      if (id) {
        await loadProducts() // Recharger la liste
        return true
      }
      return false
    } catch (err) {
      error.value = 'Erreur lors de l\'ajout du produit'
      console.error(err)
      return false
    }
  }

  // Mettre à jour un produit (admin)
  const updateProduct = async (id: string, updates: Partial<Product>): Promise<boolean> => {
    try {
      const success = await productService.update(id, updates)
      if (success) {
        await loadProducts() // Recharger la liste
      }
      return success
    } catch (err) {
      error.value = 'Erreur lors de la mise à jour du produit'
      console.error(err)
      return false
    }
  }

  // Supprimer un produit (admin)
  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      const success = await productService.delete(id)
      if (success) {
        await loadProducts() // Recharger la liste
      }
      return success
    } catch (err) {
      error.value = 'Erreur lors de la suppression du produit'
      console.error(err)
      return false
    }
  }

  return {
    products,
    loading,
    error,
    loadProducts,
    getProductById,
    getProductsByCategory,
    addProduct,
    updateProduct,
    deleteProduct
  }
})