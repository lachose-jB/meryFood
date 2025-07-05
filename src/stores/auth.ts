import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { auth } from '../config/firebase'
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth'

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
  lastLogin?: string
  permissions?: string[]
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const sessionTimeout = ref<number | null>(null)
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  // Durée de session (2 heures)
  const SESSION_DURATION = 2 * 60 * 60 * 1000

  const login = async (email: string, password: string) => {
    try {
      if (!email || !password) {
        throw new Error('Email et mot de passe requis')
      }

      console.log('[Auth] Connexion en cours avec Firebase Auth...')

      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user

      console.log('[Auth] Utilisateur Firebase connecté:', firebaseUser.uid)

      // Créer l'objet utilisateur local
      const userData: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || email,
        name: firebaseUser.displayName || 'Utilisateur',
        role: 'admin', // Tous les utilisateurs Firebase sont considérés comme admin
        lastLogin: new Date().toISOString(),
        permissions: ['read', 'write', 'delete', 'admin']
      }

      user.value = userData

      // Enregistrement de la session
      const sessionData = {
        user: userData,
        timestamp: Date.now(),
        expires: Date.now() + SESSION_DURATION
      }
      localStorage.setItem('auth_session', JSON.stringify(sessionData))

      setSessionTimeout()

      return { success: true, user: userData }

    } catch (error: any) {
      console.error('[Auth] Erreur de connexion:', error)

      let errorMessage = 'Erreur de connexion'

      // Gestion des erreurs Firebase Auth spécifiques
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Utilisateur non trouvé. Vérifiez votre adresse email.'
          break
        case 'auth/wrong-password':
          errorMessage = 'Mot de passe incorrect. Veuillez réessayer.'
          break
        case 'auth/invalid-email':
          errorMessage = 'Adresse email invalide. Vérifiez le format de votre email.'
          break
        case 'auth/too-many-requests':
          errorMessage = 'Trop de tentatives de connexion. Veuillez patienter avant de réessayer.'
          break
        case 'auth/user-disabled':
          errorMessage = 'Ce compte utilisateur a été désactivé.'
          break
        case 'auth/invalid-credential':
          errorMessage = 'Identifiants invalides. Vérifiez votre email et mot de passe.'
          break
        case 'auth/operation-not-allowed':
          errorMessage = 'Méthode de connexion non autorisée. Contactez l\'administrateur.'
          break
        case 'auth/network-request-failed':
          errorMessage = 'Erreur de connexion réseau. Vérifiez votre connexion internet.'
          break
        case 'auth/internal-error':
          errorMessage = 'Erreur interne du serveur. Veuillez réessayer plus tard.'
          break
        case 'auth/invalid-api-key':
          errorMessage = 'Configuration Firebase invalide. Contactez l\'administrateur.'
          break
        case 'auth/user-token-expired':
          errorMessage = 'Votre session a expiré. Reconnectez-vous.'
          break
        case 'auth/requires-recent-login':
          errorMessage = 'Cette opération nécessite une connexion récente. Reconnectez-vous.'
          break
        default:
          if (error.message) {
            errorMessage = error.message
          }
          break
      }

      return { success: false, error: errorMessage }
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      console.log('[Auth] Déconnexion Firebase réussie')
    } catch (error) {
      console.error('[Auth] Erreur lors de la déconnexion Firebase:', error)
    } finally {
      // Nettoyage local même en cas d'erreur réseau
      user.value = null
      localStorage.removeItem('auth_session')
      
      if (sessionTimeout.value) {
        clearTimeout(sessionTimeout.value)
        sessionTimeout.value = null
      }
      
      clearSensitiveData()
    }
  }

  const initAuth = () => {
    return new Promise<boolean>((resolve) => {
      // Écouter les changements d'état d'authentification Firebase
      const unsubscribe = onAuthStateChanged(auth, 
        (firebaseUser: FirebaseUser | null) => {
          if (firebaseUser) {
            // Utilisateur connecté
            const userData: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || 'Utilisateur',
              role: 'admin',
              lastLogin: new Date().toISOString(),
              permissions: ['read', 'write', 'delete', 'admin']
            }
            
            user.value = userData
            
            // Enregistrer la session
            const sessionData = {
              user: userData,
              timestamp: Date.now(),
              expires: Date.now() + SESSION_DURATION
            }
            localStorage.setItem('auth_session', JSON.stringify(sessionData))
            
            setSessionTimeout()
            console.log('[Auth] Utilisateur Firebase restauré:', firebaseUser.uid)
            resolve(true)
          } else {
            // Utilisateur non connecté
            user.value = null
            localStorage.removeItem('auth_session')
            console.log('[Auth] Aucun utilisateur Firebase connecté')
            resolve(false)
          }
          
          // Se désabonner après la première vérification
          unsubscribe()
        },
        (error) => {
          console.error('[Auth] Erreur lors de l\'initialisation:', error)
          user.value = null
          localStorage.removeItem('auth_session')
          resolve(false)
          unsubscribe()
        }
      )
    })
  }

  const setSessionTimeout = () => {
    if (sessionTimeout.value) {
      clearTimeout(sessionTimeout.value)
    }
    
    sessionTimeout.value = setTimeout(() => {
      logout()
      alert('Votre session a expiré. Veuillez vous reconnecter.')
    }, SESSION_DURATION)
  }

  const clearSensitiveData = () => {
    console.log('[Auth] Données sensibles nettoyées')
  }

  const refreshSession = () => {
    if (user.value) {
      const sessionData = {
        user: user.value,
        timestamp: Date.now(),
        expires: Date.now() + SESSION_DURATION
      }
      localStorage.setItem('auth_session', JSON.stringify(sessionData))
      setSessionTimeout()
    }
  }

  const hasPermission = (permission: string) => {
    return user.value?.permissions?.includes(permission) || false
  }

  const requireAdmin = () => {
    if (!isAdmin.value) {
      throw new Error('Accès administrateur requis')
    }
  }

  return {
    user,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    initAuth,
    refreshSession,
    hasPermission,
    requireAdmin
  }
})