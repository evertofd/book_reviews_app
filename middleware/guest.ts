/**
 * @Everto Farias
 * @description: Middleware para páginas de invitados que redirige usuarios autenticados al dashboard
 * @return: void | NavigationGuard - Permite acceso a no autenticados o redirige autenticados a home
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()

  /**
   * @description: Evita verificación en servidor para prevenir problemas de hidratación SSR
   */
  if (process.server) return

  /**
   * @description: Verifica estado de autenticación si no se ha inicializado previamente
   */
  if (!authStore.initialized) {
    await authStore.checkAuth()
  }

  /**
   * @description: Redirige a home si usuario ya está autenticado (evita ver login/register)
   */
  if (authStore.isAuthenticated) {
    return navigateTo('/')
  }
})