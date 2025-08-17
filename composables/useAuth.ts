/**
 * @Everto Farias
 * @description: Composable que encapsula lógica de autenticación
 * @return: Object - Funciones de auth y computeds reactivos del estado
 */
export const useAuth = () => {
  const authStore = useAuthStore()
  
  /**
   * @Everto Farias
   * @description: Garantiza que la autenticación esté inicializada antes de verificar estado
   * @return: Promise<boolean> - true si el usuario está autenticado después de verificar
   */
  const ensureAuth = async () => {
    if (!authStore.initialized) {
      await authStore.checkAuth()
    }
    return authStore.isAuthenticated
  }

  /**
   * @Everto Farias
   * @description: Verifica autenticación y redirige a login si no está autenticado
   * @return: Promise<boolean> - true si autenticado, false si redirigió a login
   */
  const requireAuth = async () => {
    const isAuth = await ensureAuth()
    if (!isAuth) {
      await navigateTo('/login')
      return false
    }
    return true
  }

  /**
   * @Everto Farias
   * @description: Expone funciones de auth y computeds 
   * @return: Object - API limpia y reactiva para gestión de autenticación
   */
  return {
    ensureAuth,
    requireAuth,
    isAuthenticated: computed(() => authStore.isAuthenticated),
    user: computed(() => authStore.user),
    loading: computed(() => authStore.loading),
    initialized: computed(() => authStore.initialized)
  }
}