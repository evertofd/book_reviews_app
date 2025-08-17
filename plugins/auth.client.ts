export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  
  if (process.client && !authStore.initialized) {
    await authStore.checkAuth()
  }
})