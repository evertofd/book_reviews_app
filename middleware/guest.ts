export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()
  
  // En el servidor, siempre permitir
  if (process.server) return
  
  // Si no está inicializado, verificar auth
  if (!authStore.initialized) {
    await authStore.checkAuth()
  }
  
  // Si está autenticado, redirigir al dashboard
  if (authStore.isAuthenticated) {
    return navigateTo('/')
  }
})