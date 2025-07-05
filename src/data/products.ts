import type { Product } from '../types'

export const products: Product[] = [
  {
    id: '1',
    name: 'Guide Nutrition Équilibrée',
    description: 'E-book complet avec 50 recettes saines et conseils nutritionnels personnalisés.',
    price: 19.99,
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'ebook',
    inStock: true,
    rating: 4.9,
    reviews: 89
  },
  {
    id: '2',
    name: 'Programme Détox 21 jours',
    description: 'Programme complet avec menu, exercices et suivi personnalisé.',
    price: 67.00,
    image: 'https://images.pexels.com/photos/1640771/pexels-photo-1640771.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'program',
    inStock: true,
    rating: 4.9,
    reviews: 156
  },
  {
    id: '3',
    name: 'Recettes Anti-Inflammatoires',
    description: 'E-book avec 30 recettes pour réduire l\'inflammation naturellement.',
    price: 15.99,
    image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'ebook',
    inStock: true,
    rating: 4.8,
    reviews: 67
  }
]