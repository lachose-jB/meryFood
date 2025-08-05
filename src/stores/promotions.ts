import { defineStore } from 'pinia'
import { ref } from 'vue'
import { promotionService } from '../services/firebase'
import type { Promotion } from '../types'

export const usePromotionStore = defineStore('promotions', () => {
  const promotions = ref<Promotion[]>([])
  const activePromotions = ref<Promotion[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Charger toutes les promotions
  const loadPromotions = async () => {
    loading.value = true
    error.value = null
    try {
      promotions.value = await promotionService.getAll()
    } catch (err) {
      error.value = 'Erreur lors du chargement des promotions'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // Charger les promotions actives
  const loadActivePromotions = async () => {
    try {
      activePromotions.value = await promotionService.getActive()
    } catch (err) {
      error.value = 'Erreur lors du chargement des promotions actives'
      console.error(err)
    }
  }

  // Charger une promotion par ID
  const getPromotionById = async (id: string): Promise<Promotion | null> => {
    try {
      return await promotionService.getById(id)
    } catch (err) {
      error.value = 'Erreur lors du chargement de la promotion'
      console.error(err)
      return null
    }
  }

  // Ajouter une promotion (admin)
  const addPromotion = async (promotion: Omit<Promotion, 'id'>): Promise<boolean> => {
    try {
      const id = await promotionService.add(promotion)
      if (id) {
        await loadPromotions() // Recharger la liste
        await loadActivePromotions() // Recharger les promotions actives
        return true
      }
      return false
    } catch (err) {
      error.value = 'Erreur lors de l\'ajout de la promotion'
      console.error(err)
      return false
    }
  }

  // Mettre à jour une promotion (admin)
  const updatePromotion = async (id: string, updates: Partial<Promotion>): Promise<boolean> => {
    try {
      const success = await promotionService.update(id, updates)
      if (success) {
        await loadPromotions() // Recharger la liste
        await loadActivePromotions() // Recharger les promotions actives
      }
      return success
    } catch (err) {
      error.value = 'Erreur lors de la mise à jour de la promotion'
      console.error(err)
      return false
    }
  }

  // Supprimer une promotion (admin)
  const deletePromotion = async (id: string): Promise<boolean> => {
    try {
      const success = await promotionService.delete(id)
      if (success) {
        await loadPromotions() // Recharger la liste
        await loadActivePromotions() // Recharger les promotions actives
      }
      return success
    } catch (err) {
      error.value = 'Erreur lors de la suppression de la promotion'
      console.error(err)
      return false
    }
  }

  // Activer/désactiver une promotion
  const togglePromotion = async (id: string, isActive: boolean): Promise<boolean> => {
    return updatePromotion(id, { isActive })
  }

  return {
    promotions,
    activePromotions,
    loading,
    error,
    loadPromotions,
    loadActivePromotions,
    getPromotionById,
    addPromotion,
    updatePromotion,
    deletePromotion,
    togglePromotion
  }
})