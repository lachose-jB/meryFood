import type { BlogPost } from '../types'

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Les 5 superaliments à intégrer dans votre alimentation',
    excerpt: 'Découvrez ces aliments exceptionnels qui boosteront votre santé au quotidien.',
    content: 'Les superaliments sont des aliments naturellement riches en nutriments essentiels...',
    image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=800',
    author: 'Dr. Marie Dubois',
    date: '2025-01-15',
    readTime: '5 min',
    tags: ['nutrition', 'superaliments', 'santé']
  },
  {
    id: '2', 
    title: 'Comment bien s\'hydrater : guide complet',
    excerpt: 'L\'hydratation est cruciale pour votre santé. Apprenez les bonnes pratiques.',
    content: 'L\'eau représente environ 60% du poids corporel chez l\'adulte...',
    image: 'https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg?auto=compress&cs=tinysrgb&w=800',
    author: 'Dr. Marie Dubois',
    date: '2025-01-12',
    readTime: '3 min',
    tags: ['hydratation', 'eau', 'conseils']
  },
  {
    id: '3',
    title: 'Planification des repas : organisez votre semaine',
    excerpt: 'Optimisez votre temps et votre nutrition avec une planification efficace.',
    content: 'La planification des repas est un outil puissant pour maintenir une alimentation équilibrée...',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    author: 'Dr. Marie Dubois',
    date: '2025-01-10',
    readTime: '7 min',
    tags: ['planification', 'organisation', 'repas']
  }
]