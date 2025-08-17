export const useAuth = () => {
  const authStore = useAuthStore()
  
  const ensureAuth = async () => {
    if (!authStore.initialized) {
      await authStore.checkAuth()
    }
    return authStore.isAuthenticated
  }
  
  const requireAuth = async () => {
    const isAuth = await ensureAuth()
    if (!isAuth) {
      await navigateTo('/login')
      return false
    }
    return true
  }
  
  return {
    ensureAuth,
    requireAuth,
    isAuthenticated: computed(() => authStore.isAuthenticated),
    user: computed(() => authStore.user),
    loading: computed(() => authStore.loading),
    initialized: computed(() => authStore.initialized)
  }
}