import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Pages publiques
import Home from '../views/Home.vue'
import Shop from '../views/Shop.vue'
import ProductDetail from '../views/ProductDetail.vue'
import Cart from '../views/Cart.vue'
import About from '../views/About.vue'
import Blog from '../views/Blog.vue'
import ArticleDetail from '../views/ArticleDetail.vue'
import Contact from '../views/Contact.vue'
import Login from '../views/Login.vue'

// Routes
const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/shop', name: 'Shop', component: Shop },
  { path: '/product/:id', name: 'ProductDetail', component: ProductDetail, props: true },
  { path: '/cart', name: 'Cart', component: Cart },
  { path: '/about', name: 'About', component: About },
  { path: '/blog', name: 'Blog', component: Blog },
  { path: '/article/:title', name: 'ArticleDetail', component: ArticleDetail, props: true },
  { path: '/contact', name: 'Contact', component: Contact },

  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { redirectIfAuthenticated: true }
  },

  // ⚡ Import dynamique admin uniquement en dev
  ...(import.meta.env.DEV
    ? [
        {
          path: '/admin',
          name: 'Dashboard',
          component: () => import('../views/admin/Dashboard.vue'),
          meta: { requiresAuth: true, requiresAdmin: true }
        }
      ]
    : []),

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

  if (!authStore.user && localStorage.getItem('auth_session')) {
    await authStore.initAuth()
  }

  const isAuth = authStore.isAuthenticated
  const isAdmin = authStore.isAdmin

  if (to.meta.redirectIfAuthenticated && isAuth) {
    next(isAdmin ? '/admin' : '/')
    return
  }

  if (to.meta.requiresAuth && !isAuth) {
    next({ path: '/login', query: { redirect: to.fullPath } })
    return
  }

  if (to.meta.requiresAdmin && (!isAuth || !isAdmin)) {
    next(isAuth ? '/unauthorized' : { path: '/login', query: { redirect: to.fullPath, admin: '1' } })
    return
  }

  if (to.path.startsWith('/admin') && !isAdmin) {
    next('/unauthorized')
    return
  }

  next()
})

export default router
