export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()
  
  // En el servidor, siempre permitir (la verificación será en el cliente)
  if (process.server) return
  
  // Si no está inicializado, esperar a que se inicialice
  if (!authStore.initialized) {
    await authStore.checkAuth()
  }
  
  // Si no está autenticado después de verificar, redirigir al login
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
})