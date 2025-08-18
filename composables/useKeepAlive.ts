/**
 * @Everto Farias
 * @description: Composable que mantiene el backend activo con pings automáticos
 * @return: Object con control del keep-alive
 */
export const useKeepAlive = () => {
  const config = useRuntimeConfig()
  const isActive = ref(false)
  let intervalId: NodeJS.Timeout | null = null

  /**
   * @Everto Farias
   * @description: Ejecuta ping al endpoint de health para mantener servidor activo
   * @return: Promise<void> - Realiza request GET al health endpoint
   */
  const pingServer = async () => {
    try {
      await $fetch(`${config.public.apiBase}/public/books/health`, {
        method: 'GET',
        timeout: 5000,
        retry: 0
      })
      console.log('🏓Ping to server successful')
    } catch (error) {
      console.warn('Ping failed:', error)
    }
  }

  /**
   * @Everto Farias
   * @description: Inicia pings automáticos cada 10 minutos para evitar sleep de Render ya que render se apaga cada 15 minutos sin actividad
   * @return: void - Establece intervalo de pings
   */
  const startKeepAlive = () => {
    if (!isActive.value) {
      isActive.value = true
      intervalId = setInterval(pingServer, 10 * 60 * 1000)
      console.log('Keep-alive started - ping every 10 minutes')
    }
  }

  /**
   * @Everto Farias
   * @description: Detiene los pings automáticos
   * @return: void - Limpia el intervalo
   */
  const stopKeepAlive = () => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
      isActive.value = false
      console.log('Keep-alive stopped')
    }
  }

  // Cleanup al desmontar
  onUnmounted(() => {
    stopKeepAlive()
  })

  return {
    isActive: readonly(isActive),
    startKeepAlive,
    stopKeepAlive,
    pingServer
  }
}
