import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Pages publiques
import Home from '../views/Home.vue'
import Shop from '../views/Shop.vue'
import ProductDetail from '../views/ProductDetail.vue'
import Cart from '../views/Cart.vue'
import Consultation from '../views/Consultation.vue'
import About from '../views/About.vue'
import Blog from '../views/Blog.vue'
import ArticleDetail from '../views/ArticleDetail.vue'
import ArticleDetail from '../views/ArticleDetail.vue'
import Contact from '../views/Contact.vue'
import Login from '../views/Login.vue'

// Pages admin
import Dashboard from '../views/admin/Dashboard.vue'

// Routes
const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/shop', name: 'Shop', component: Shop },
  { path: '/product/:id', name: 'ProductDetail', component: ProductDetail, props: true },
  { path: '/cart', name: 'Cart', component: Cart },
  { path: '/consultation', name: 'Consultation', component: Consultation },
  { path: '/about', name: 'About', component: About },
  { path: '/blog', name: 'Blog', component: Blog },
  { path: '/article/:id', name: 'ArticleDetail', component: ArticleDetail, props: true },
  { path: '/article/:id', name: 'ArticleDetail', component: ArticleDetail, props: true },
  { path: '/contact', name: 'Contact', component: Contact },

  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      redirectIfAuthenticated: true
    }
  },
  {
    path: '/admin',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: () => import('../views/Unauthorized.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

// Auth Guard
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()

  // Restaurer la session s’il y a un token local
  if (!authStore.user && localStorage.getItem('auth_session')) {
    await authStore.initAuth()
  }

  const isAuth = authStore.isAuthenticated
  const isAdmin = authStore.isAdmin

  // 🔒 Rediriger les utilisateurs connectés depuis /login
  if (to.meta.redirectIfAuthenticated && isAuth) {
    next(isAdmin ? '/admin' : '/')
    return
  }

  // 🔐 Protection des routes avec login requis
  if (to.meta.requiresAuth && !isAuth) {
    next({ path: '/login', query: { redirect: to.fullPath } })
    return
  }

  // 🔐 Protection des routes admin
  if (to.meta.requiresAdmin && (!isAuth || !isAdmin)) {
    next(isAuth ? '/unauthorized' : { path: '/login', query: { redirect: to.fullPath, admin: '1' } })
    return
  }

  // 🛑 Vérif complémentaire sur les chemins commençant par /admin
  if (to.path.startsWith('/admin') && !isAdmin) {
    next('/unauthorized')
    return
  }

  next()
})

// Optional: nettoyage post-navigation
router.afterEach((to, from) => {
  if (from.path.startsWith('/admin') && !to.path.startsWith('/admin')) {
    console.log('Déconnexion de la zone admin')
    // authStore.clearAdminCache() ?
  }
})

export default router
