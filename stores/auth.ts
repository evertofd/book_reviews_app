import { defineStore } from 'pinia'

interface User {
  _id: string
  email: string
  alias: string
  createdAt: string
  updatedAt: string
  id: string
}

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData {
  email: string
  password: string
  alias: string
}

interface AuthResponse {
  token: string
  user: User
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  initialized: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    initialized: false
  }),

  actions: {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
      this.loading = true
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<AuthResponse>(`${config.public.apiBase}/public/auth/login`, {
          method: 'POST',
          body: credentials
        })
        
        this.token = response.token
        this.user = response.user
        this.isAuthenticated = true
        
        const tokenCookie = useCookie('auth-token', {
          default: () => null,
          maxAge: 60 * 60 * 24, 
          httpOnly: false,
          secure: false, 
          sameSite: 'lax'
        })
        tokenCookie.value = response.token
        
        return response
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async register(userData: RegisterData): Promise<any> {
      this.loading = true
      try {
        const config = useRuntimeConfig()
        const response = await $fetch(`${config.public.apiBase}/public/auth/register`, {
          method: 'POST',
          body: userData
        })
        
        return response
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async checkAuth(): Promise<boolean> {
      const tokenCookie = useCookie('auth-token')
      
      if (!tokenCookie.value) {
        this.initialized = true
        return false
      }

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ success: boolean; user: User }>(`${config.public.apiBase}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${tokenCookie.value}`
          }
        })
        
        if (response.success && response.user) {
          this.token = tokenCookie.value
          this.user = response.user
          this.isAuthenticated = true
          this.initialized = true
          return true
        } else {
          await this.logout()
          return false
        }
      } catch (error) {
        await this.logout()
        return false
      }
    },

    async logout(): Promise<void> {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      this.initialized = true
      
      // Limpiar cookie
      const tokenCookie = useCookie('auth-token')
      tokenCookie.value = null
      
      await navigateTo('/login')
    }
  }
})