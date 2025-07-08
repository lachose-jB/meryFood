<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-white">
      <div class="max-w-7xl mx-auto px-4 py-16">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-6">
            <h1 class="font-title font-bold text-4xl text-gray-900">
              À propos de <span class="text-primary">Grace KIKI</span>
            </h1>
            <p class="text-xl text-gray-600 leading-relaxed">
              Fondatrice de Mery Food, experte en nutrition humaine diplômée de l’EDNH Lyon et titulaire d’un Master en Food Business & Management, Grace KIKI allie savoir scientifique, héritage béninois et passion pour la cuisine saine.
            </p>
            <p class="text-gray-600">
              À travers Mery Food, elle propose des plats faits maison et des produits d’épicerie sélectionnés, inspirés de la cuisine africaine, pensés pour allier équilibre nutritionnel, plaisir gustatif et authenticité.
            </p>
          </div>
          <div>
            <img 
              src="/public/photo.jpeg" 
              alt="À propos de NutriVie"
              class="rounded-2xl shadow-xl w-full h-96 object-cover"
            >
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="font-title font-bold text-3xl text-gray-900 mb-4">Ses valeurs</h2>
          <p class="text-xl text-gray-600">Ce qui guide notre approche au quotidien</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="value in values" :key="value.title" class="text-center">
            <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <component :is="value.icon" class="h-8 w-8 text-primary" />
            </div>
            <h3 class="font-title font-semibold text-xl mb-4">{{ value.title }}</h3>
            <p class="text-gray-600">{{ value.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-16 bg-primary">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div v-for="stat in stats" :key="stat.label" class="text-white">
            <div class="font-title font-bold text-4xl mb-2">{{ stat.value }}</div>
            <div class="text-white/90">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h2 class="font-title font-bold text-3xl text-gray-900 mb-8">Objectif</h2>
        <div class="bg-white p-8 rounded-2xl shadow-sm">
          <p class="text-xl text-gray-600 leading-relaxed mb-6">
            "réconcilier tradition et modernité dans l’assiette, pour une alimentation plus saine, gourmande et consciente."
          </p>
          <div class="flex items-center justify-center space-x-4">
            <img 
              src="/public/photo.jpeg" 
              alt="Grace KIKI"
              class="w-12 h-12 rounded-full object-cover"
            >
            <div class="text-left">
              <div class="font-semibold">Grace KIKI</div>
              <div class="text-gray-600 text-sm">Experte en Nutrition Humaine</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { HeartIcon, UserGroupIcon, SparklesIcon, UserCircleIcon } from '@heroicons/vue/24/outline'

const values = [
  {
    title: 'Santé & bien-être',
    description: 'Nous plaçons la santé physique et mentale au cœur de nos priorités, avec une approche globale et bienveillante.',
    icon: HeartIcon
  },
  {
    title: 'Plaisir sans culpabilité',
    description: 'Nous encourageons une relation saine avec l’alimentation, où le plaisir et l’équilibre ne sont jamais opposés.',
    icon: SparklesIcon
  },
  {
    title: 'Authenticité culturelle',
    description: 'Nous valorisons les traditions culinaires et les identités culturelles, sans les gommer au nom de normes universelles.',
    icon: UserGroupIcon
  },
  {
    title: 'Transmission & pédagogie',
    description: 'Nous partageons notre savoir avec clarté et passion, pour rendre chacun acteur de son propre bien-être.',
    icon: UserCircleIcon
  }
]

const stats = [
  { value: '1000+', label: 'Clients accompagnés' },
  { value: '10', label: 'Années d\'expérience' },
  { value: '95%', label: 'Clients satisfaits' },
  { value: '24/7', label: 'Support disponible' }
]
</script>