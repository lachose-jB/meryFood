import type { Product } from '../types'

export const products: Product[] = [
  {
    id: '1',
    name: 'Complément Vitamine D3',
    description: 'Vitamine D3 naturelle pour renforcer votre système immunitaire et vos os.',
    price: 24.99,
    image: 'https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'supplement',
    inStock: true,
    rating: 4.8,
    reviews: 127
  },
  {
    id: '2',
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
    id: '3',
    name: 'Oméga-3 Premium',
    description: 'Huile de poisson pure, riche en EPA et DHA pour la santé cardiovasculaire.',
    price: 32.50,
    image: 'https://images.pexels.com/photos/3683101/pexels-photo-3683101.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'supplement',
    inStock: true,
    rating: 4.7,
    reviews: 203
  },
  {
    id: '4',
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
    id: '5',
    name: 'Probiotiques Multi-Souches',
    description: 'Complexe de 10 milliards de probiotiques pour une flore intestinale équilibrée.',
    price: 28.90,
    image: 'https://images.pexels.com/photos/3683111/pexels-photo-3683111.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'supplement',
    inStock: true,
    rating: 4.6,
    reviews: 94
  },
  {
    id: '6',
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