<template>
  <div class="space-y-6">
    <!-- Formulaire d'édition modal -->
    <ProductEditForm 
      v-if="editingProduct"
      :product="editingProduct"
      @close="editingProduct = null"
      @save="handleProductUpdate"
    />

    <!-- Loading State -->
    <div v-if="productStore.loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      <p class="mt-4 text-gray-600">Chargement des produits...</p>
    </div>

    <!-- Products Table -->
    <div v-else class="bg-white rounded-lg border">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produit
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Catégorie
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prix
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="product in productStore.products" :key="product.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <img 
                    :src="product.image" 
                    :alt="product.name"
                    class="h-12 w-12 rounded-lg object-cover"
                  >
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ product.name }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ product.description.substring(0, 50) }}...
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getCategoryClass(product.category)">
                  {{ getCategoryLabel(product.category) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ product.price.toFixed(2) }}€
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  product.inStock 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                ]">
                  {{ product.inStock ? 'En stock' : 'Rupture' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button 
                  @click="editProduct(product)"
                  class="text-primary hover:text-primary/80"
                >
                  Modifier
                </button>
                <button 
                  @click="deleteProduct(product.id!)"
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
import { useProductStore } from '../../stores/products'
import ProductEditForm from './ProductEditForm.vue'
import type { Product } from '../../types'

const productStore = useProductStore()
const editingProduct = ref<Product | null>(null)

const getCategoryClass = (category: string) => {
  const classes = {
    ebook: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800',
    program: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800',
    repas: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800',
    ingredient: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800',
    farine: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800',
    boisson: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-cyan-100 text-cyan-800',
    'amuse-gueule': 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-pink-100 text-pink-800'
  }
  return classes[category as keyof typeof classes] || classes.ebook
}

const getCategoryLabel = (category: string) => {
  const labels = {
    ebook: 'E-book',
    program: 'Programme',
    repas: 'Repas',
    ingredient: 'Ingrédient',
    farine: 'Farine',
    boisson: 'Boisson',
    'amuse-gueule': 'Amuse-gueule'
  }
  return labels[category as keyof typeof labels] || category
}

const editProduct = (product: any) => {
  editingProduct.value = { ...product }
}

const deleteProduct = async (id: string) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
    const success = await productStore.deleteProduct(id)
    if (!success) {
      alert('Erreur lors de la suppression du produit')
    }
  }
}

const handleProductUpdate = async (updatedProduct: Product) => {
  const success = await productStore.updateProduct(updatedProduct.id!, updatedProduct)
  if (success) {
    editingProduct.value = null
  } else {
    alert('Erreur lors de la mise à jour du produit')
  }
}

onMounted(() => {
  productStore.loadProducts()
})
</script>