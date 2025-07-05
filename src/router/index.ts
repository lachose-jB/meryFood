import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Home from '../views/Home.vue'
import Shop from '../views/Shop.vue'
import ProductDetail from '../views/ProductDetail.vue'
import Cart from '../views/Cart.vue'
import Consultation from '../views/Consultation.vue'
import About from '../views/About.vue'
import Blog from '../views/Blog.vue'
import Contact from '../views/Contact.vue'
import Login from '../views/Login.vue'
import Dashboard from '../views/admin/Dashboard.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/shop',
    name: 'Shop',
    component: Shop
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: ProductDetail,
    props: true
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart
  },
  {
    path: '/consultation',
    name: 'Consultation',
    component: Consultation
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/blog',
    name: 'Blog',
    component: Blog
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { 
      hideFromGuests: false,
      redirectIfAuthenticated: true 
    }
  },
  {
    path: '/admin',
    name: 'Dashboard',
    component: Dashboard,
    meta: { 
      requiresAuth: true, 
      requiresAdmin: true,
      adminOnly: true
    }
  },
  // Route de redirection pour les accès non autorisés
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: () => import('../views/Unauthorized.vue')
  },
  // Route 404
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Guard de sécurité renforcé
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Vérifier l'état d'authentification
  if (!authStore.user && localStorage.getItem('auth_session')) {
    await authStore.initAuth()
  }

  // Redirection si déjà connecté et tentative d'accès à la page de login
  if (to.meta.redirectIfAuthenticated && authStore.isAuthenticated) {
    if (authStore.isAdmin) {
      next('/admin')
    } else {
      next('/')
    }
    return
  }

  // Protection des routes nécessitant une authentification
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
    return
  }

  // Protection stricte des routes administrateur
  if (to.meta.requiresAdmin || to.meta.adminOnly) {
    if (!authStore.isAuthenticated) {
      next({
        path: '/login',
        query: { redirect: to.fullPath, admin: 'required' }
      })
      return
    }
    
    if (!authStore.isAdmin) {
      next('/unauthorized')
      return
    }
  }

  // Vérification supplémentaire pour les routes admin
  if (to.path.startsWith('/admin') && !authStore.isAdmin) {
    next('/unauthorized')
    return
  }

  next()
})

// Guard après navigation pour nettoyer les données sensibles
router.afterEach((to, from) => {
  // Nettoyer les données sensibles si on quitte l'admin
  if (from.path.startsWith('/admin') && !to.path.startsWith('/admin')) {
    // Optionnel : nettoyer le cache admin
    console.log('Sortie de la zone admin')
  }
})

export default router