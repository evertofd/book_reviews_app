/**
 * @Everto Farias
 * @description: Plugin que inicializa automáticamente la autenticación al cargar la aplicación en el cliente
 * @return: void - Ejecuta checkAuth una sola vez
 */
export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  /**
    * @description: Verifica si auth no está inicializado y ejecuta checkAuth para restaurar desde cookie
  */
  if (process.client && !authStore.initialized) {
    await authStore.checkAuth()
  }
})