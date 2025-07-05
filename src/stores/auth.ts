import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { auth } from '../config/firebase'
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth'

const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes

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
  const loginAttempts = ref(0)
  const lockoutUntil = ref<number | null>(null)
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  const SESSION_DURATION = 2 * 60 * 60 * 1000

  const isLockedOut = computed(() => {
    if (!lockoutUntil.value) return false
    return Date.now() < lockoutUntil.value
  })

  const sanitizeInput = (input: string): string => {
    return input.trim().toLowerCase()
  }

  const login = async (email: string, password: string) => {
    try {
      if (isLockedOut.value) {
        const remainingTime = Math.ceil((lockoutUntil.value! - Date.now()) / 60000)
        throw new Error(`Compte temporairement verrouillé. Réessayez dans ${remainingTime} minutes.`)
      }

      if (!email || !password) {
        throw new Error('Email et mot de passe requis')
      }

      const sanitizedEmail = sanitizeInput(email)
      
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail)) {
        throw new Error('Format d\'email invalide')
      }

      const userCredential = await signInWithEmailAndPassword(auth, sanitizedEmail, password)
      const firebaseUser = userCredential.user

      const userData: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || sanitizedEmail,
        name: firebaseUser.displayName || 'Utilisateur',
        role: 'admin',
        lastLogin: new Date().toISOString(),
        permissions: ['read', 'write', 'delete', 'admin']
      }

      user.value = userData
      loginAttempts.value = 0
      lockoutUntil.value = null

      const sessionData = {
        user: userData,
        timestamp: Date.now(),
        expires: Date.now() + SESSION_DURATION
      }
      localStorage.setItem('auth_session', JSON.stringify(sessionData))

      setSessionTimeout()

      return { success: true, user: userData }

    } catch (error: any) {
      loginAttempts.value++
      
      if (loginAttempts.value >= MAX_LOGIN_ATTEMPTS) {
        lockoutUntil.value = Date.now() + LOCKOUT_DURATION
        localStorage.setItem('lockoutUntil', lockoutUntil.value.toString())
      }

      let errorMessage = 'Erreur de connexion'

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
        case 'auth/too-many-requests':
          errorMessage = 'Trop de tentatives de connexion. Compte temporairement verrouillé.'
          lockoutUntil.value = Date.now() + LOCKOUT_DURATION
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
    } catch (error) {
      // Silently handle logout errors
    } finally {
      user.value = null
      localStorage.removeItem('auth_session')
      localStorage.removeItem('lockoutUntil')
      
      if (sessionTimeout.value) {
        clearTimeout(sessionTimeout.value)
        sessionTimeout.value = null
      }
      
      loginAttempts.value = 0
      lockoutUntil.value = null
      clearSensitiveData()
    }
  }

  const initAuth = () => {
    return new Promise<boolean>((resolve) => {
      const storedLockout = localStorage.getItem('lockoutUntil')
      if (storedLockout) {
        const lockoutTime = parseInt(storedLockout)
        if (Date.now() < lockoutTime) {
          lockoutUntil.value = lockoutTime
        } else {
          localStorage.removeItem('lockoutUntil')
        }
      }

      const unsubscribe = onAuthStateChanged(auth, 
        (firebaseUser: FirebaseUser | null) => {
          if (firebaseUser) {
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
            resolve(true)
          } else {
            user.value = null
            localStorage.removeItem('auth_session')
            resolve(false)
          }
          
          unsubscribe()
        },
        (error) => {
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
    // Clear any sensitive data from memory
    if (sessionTimeout.value) {
      clearTimeout(sessionTimeout.value)
      sessionTimeout.value = null
    }
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
    isLockedOut,
    login,
    logout,
    initAuth,
    refreshSession,
    hasPermission,
    requireAdmin
  }
})