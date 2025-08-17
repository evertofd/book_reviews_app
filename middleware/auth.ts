/**
 * @Everto Farias
 * @description: Middleware de protección de rutas que verifica autenticación antes de acceder a páginas protegidas
 * @return: void | NavigationGuard - Permite acceso o redirige a login según estado de auth
 */

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()
  
  /**
   * @description: Evita verificación de auth en servidor (SSR) para prevenir hidration mismatches
   */
  if (process.server) return
  
  /**
   * @description: Inicializa autenticación si no se ha hecho, verificando cookie y estado
   */
  if (!authStore.initialized) {
    await authStore.checkAuth()
  }
  
  /**
   * @description: Redirige a login si usuario no está autenticado después de verificar
   */
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
})