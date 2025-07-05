<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-white">
      <div class="max-w-7xl mx-auto px-4 py-16">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-6">
            <h1 class="font-title font-bold text-4xl text-gray-900">
              À propos de <span class="text-primary">NutriVie</span>
            </h1>
            <p class="text-xl text-gray-600 leading-relaxed">
              Votre partenaire de confiance pour une transformation durable de vos habitudes alimentaires 
              et l'atteinte de vos objectifs santé.
            </p>
            <p class="text-gray-600">
              Depuis plus de 10 ans, nous accompagnons nos clients vers une meilleure santé grâce à 
              une approche personnalisée et bienveillante de la nutrition.
            </p>
          </div>
          <div>
            <img 
              src="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=800" 
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
          <h2 class="font-title font-bold text-3xl text-gray-900 mb-4">Nos valeurs</h2>
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
        <h2 class="font-title font-bold text-3xl text-gray-900 mb-8">Notre mission</h2>
        <div class="bg-white p-8 rounded-2xl shadow-sm">
          <p class="text-xl text-gray-600 leading-relaxed mb-6">
            "Rendre la nutrition accessible à tous en proposant des solutions personnalisées, 
            des produits de qualité et un accompagnement bienveillant pour une transformation 
            durable de vos habitudes alimentaires."
          </p>
          <div class="flex items-center justify-center space-x-4">
            <img 
              src="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=100" 
              alt="Dr. Marie Dubois"
              class="w-12 h-12 rounded-full object-cover"
            >
            <div class="text-left">
              <div class="font-semibold">Dr. Marie Dubois</div>
              <div class="text-gray-600 text-sm">Fondatrice & Nutritionniste</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { HeartIcon, UserGroupIcon, SparklesIcon } from '@heroicons/vue/24/outline'


const values = [
  {
    title: 'Bienveillance',
    description: 'Nous accompagnons chaque personne avec empathie et sans jugement.',
    icon: HeartIcon
  },
  {
    title: 'Expertise',
    description: 'Notre équipe de professionnels formés vous garantit des conseils de qualité.',
    icon: SparklesIcon
  },
  {
    title: 'Communauté',
    description: 'Nous créons un environnement de soutien mutuel et d\'entraide.',
    icon: UserGroupIcon
  }
]

const stats = [
  { value: '1000+', label: 'Clients accompagnés' },
  { value: '10', label: 'Années d\'expérience' },
  { value: '95%', label: 'Clients satisfaits' },
  { value: '24/7', label: 'Support disponible' }
]
</script>