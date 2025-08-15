import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Timestamp } from 'firebase/firestore'
import { promotionService } from '../services/firebase'
import type { Promotion } from '../types'
import { convertToDate } from '../utils/dateUtils'

type PromotionCreate = Omit<Promotion, 'id' | 'createdAt'> & {
  validFrom: string | Timestamp
  validUntil: string | Timestamp
}

export const usePromotionStore = defineStore('promotions', () => {
  const promotions = ref<Promotion[]>([])
  const activePromotions = ref<Promotion[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Convertit une date en Timestamp Firebase
  const toFirebaseTimestamp = (date: string | Timestamp): Timestamp => {
    return date instanceof Timestamp ? date : Timestamp.fromDate(new Date(date))
  }

  // Obtenir les promotions actives pour une catégorie spécifique
  const getActivePromotionsForCategory = (category: string): Promotion[] => {
    const now = new Date()
    
    return promotions.value.filter(promotion => {
      if (!promotion.isActive) return false
      
      const validFrom = convertToDate(promotion.validFrom)
      const validUntil = convertToDate(promotion.validUntil)
      
      if (isNaN(validFrom.getTime()) || isNaN(validUntil.getTime())) return false
      if (now < validFrom || now > validUntil) return false
      
      // Si aucune catégorie spécifiée, la promotion s'applique à tous les produits
      if (!promotion.applicableCategories || promotion.applicableCategories.length === 0) {
        return true
      }
      
      // Vérifier si la catégorie est dans la liste des catégories applicables
      return promotion.applicableCategories.includes(category)
    })
  }

  // Calculer le prix avec réduction pour un produit
  const calculateDiscountedPrice = (originalPrice: number, category: string): { 
    discountedPrice: number, 
    discount: number, 
    promotion: Promotion | null 
  } => {
    const applicablePromotions = getActivePromotionsForCategory(category)
    
    if (applicablePromotions.length === 0) {
      return {
        discountedPrice: originalPrice,
        discount: 0,
        promotion: null
      }
    }
    
    // Prendre la promotion avec le plus gros pourcentage de réduction
    const bestPromotion = applicablePromotions.reduce((best, current) => {
      return Number(current.discount) > Number(best.discount) ? current : best
    })
    
    const discountAmount = (originalPrice * Number(bestPromotion.discount)) / 100
    const discountedPrice = originalPrice - discountAmount
    
    return {
      discountedPrice: Math.max(0, discountedPrice), // S'assurer que le prix ne soit pas négatif
      discount: Number(bestPromotion.discount),
      promotion: bestPromotion
    }
  }

  // Charger toutes les promotions
  const loadPromotions = async (forceReload = false): Promise<void> => {
    if (promotions.value.length > 0 && !forceReload) return
    
    loading.value = true
    error.value = null
    try {
      promotions.value = await promotionService.getAll()
    } catch (err) {
      error.value = 'Erreur lors du chargement des promotions'
      console.error('loadPromotions error:', err)
    } finally {
      loading.value = false
    }
  }

  // Charger les promotions actives
  const loadActivePromotions = async (forceReload = false): Promise<void> => {
    if (activePromotions.value.length > 0 && !forceReload) return

    loading.value = true
    error.value = null
    try {
      activePromotions.value = await promotionService.getActive()
    } catch (err) {
      error.value = 'Erreur lors du chargement des promotions actives'
      console.error('loadActivePromotions error:', err)
      activePromotions.value = []
    } finally {
      loading.value = false
    }
  }

  // Obtenir une promotion par ID
  const getPromotionById = async (id: string): Promise<Promotion | null> => {
    const cachedPromotion = promotions.value.find(p => p.id === id)
    if (cachedPromotion) return cachedPromotion

    try {
      return await promotionService.getById(id)
    } catch (err) {
      error.value = `Erreur lors de la récupération de la promotion ${id}`
      console.error(`getPromotionById error for ${id}:`, err)
      return null
    }
  }

  // Ajouter une nouvelle promotion
  const addPromotion = async (promotionData: PromotionCreate): Promise<string | null> => {
    loading.value = true
    error.value = null
    
    try {
      const promotionWithTimestamps = {
        ...promotionData,
        discount: promotionData.discount, // Assure la cohérence avec l'interface
        validFrom: toFirebaseTimestamp(promotionData.validFrom),
        validUntil: toFirebaseTimestamp(promotionData.validUntil),
        createdAt: Timestamp.now()
      }

      const newPromotionId = await promotionService.add(promotionWithTimestamps)
      
      if (newPromotionId) {
        await Promise.all([
          loadPromotions(true),
          loadActivePromotions(true)
        ])
      }
      
      return newPromotionId
    } catch (err) {
      error.value = 'Erreur lors de la création de la promotion'
      console.error('addPromotion error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  // Mettre à jour une promotion existante
  const updatePromotion = async (
    id: string, 
    updates: Partial<Promotion>
  ): Promise<boolean> => {
    loading.value = true
    error.value = null
    
    try {
      // Convertit les dates si elles sont présentes dans les updates
      const processedUpdates = { ...updates }
      if (updates.validFrom) {
        processedUpdates.validFrom = toFirebaseTimestamp(updates.validFrom)
      }
      if (updates.validUntil) {
        processedUpdates.validUntil = toFirebaseTimestamp(updates.validUntil)
      }

      const success = await promotionService.update(id, processedUpdates)
      
      if (success) {
        // Mise à jour du cache local
        const index = promotions.value.findIndex(p => p.id === id)
        if (index !== -1) {
          promotions.value[index] = { ...promotions.value[index], ...processedUpdates }
        }
        
        // Rechargement si nécessaire
        if (updates.isActive !== undefined || updates.validFrom || updates.validUntil) {
          await loadActivePromotions(true)
        }
      }
      
      return success
    } catch (err) {
      error.value = `Erreur lors de la mise à jour de la promotion ${id}`
      console.error(`updatePromotion error for ${id}:`, err)
      return false
    } finally {
      loading.value = false
    }
  }

  // Supprimer une promotion
  const deletePromotion = async (id: string): Promise<boolean> => {
    loading.value = true
    error.value = null
    
    try {
      const success = await promotionService.delete(id)
      
      if (success) {
        promotions.value = promotions.value.filter(p => p.id !== id)
        activePromotions.value = activePromotions.value.filter(p => p.id !== id)
      }
      
      return success
    } catch (err) {
      error.value = `Erreur lors de la suppression de la promotion ${id}`
      console.error(`deletePromotion error for ${id}:`, err)
      return false
    } finally {
      loading.value = false
    }
  }

  // Activer/désactiver une promotion
  const togglePromotion = async (id: string, isActive: boolean): Promise<boolean> => {
    return updatePromotion(id, { isActive })
  }

  return {
    // State
    promotions,
    activePromotions,
    loading,
    error,
    
    // Actions
    loadPromotions,
    loadActivePromotions,
    getPromotionById,
    addPromotion,
    updatePromotion,
    deletePromotion,
    togglePromotion,
    getActivePromotionsForCategory,
    calculateDiscountedPrice
  }
})