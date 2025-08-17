<template>
  <div class="error-container">
    <div class="error-content">
      <!-- Icono de error -->
      <div class="error-icon">
        <span v-if="error.statusCode === 404">📚</span>
        <span v-else-if="error.statusCode >= 500">⚠️</span>
        <span v-else>❌</span>
      </div>

      <!-- Código de error -->
      <h1 class="error-code">{{ error.statusCode || '404' }}</h1>

      <!-- Mensaje principal -->
      <h2 class="error-title">{{ errorTitle }}</h2>
      
      <!-- Descripción -->
      <p class="error-description">{{ errorDescription }}</p>

      <!-- Acciones -->
      <div class="error-actions">
        <button @click="goHome" class="home-btn">
          🏠 Volver al Inicio
        </button>
        
        <button @click="goBack" class="back-btn" v-if="canGoBack">
          ← Volver Atrás
        </button>

        <button @click="refresh" class="refresh-btn" v-if="error.statusCode >= 500">
          🔄 Reintentar
        </button>
      </div>

      <!-- Información adicional para desarrollo -->
      <details v-if="isDev && error.message" class="error-details">
        <summary>Detalles técnicos</summary>
        <pre>{{ error.message }}</pre>
        <pre v-if="error.stack">{{ error.stack }}</pre>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ErrorProps {
  error: {
    statusCode?: number
    statusMessage?: string
    message?: string
    stack?: string
  }
}

const props = defineProps<ErrorProps>()

// Verificar si estamos en desarrollo
const isDev = process.dev

// Verificar si podemos ir atrás
const canGoBack = ref(false)

onMounted(() => {
  canGoBack.value = window.history.length > 1
})

// Títulos y descripciones según el error
const errorTitle = computed(() => {
  const code = props.error.statusCode
  
  switch (code) {
    case 404:
      return 'Página no encontrada'
    case 500:
      return 'Error del servidor'
    case 503:
      return 'Servicio no disponible'
    default:
      return 'Algo salió mal'
  }
})

const errorDescription = computed(() => {
  const code = props.error.statusCode
  
  switch (code) {
    case 404:
      return 'La página que buscas no existe o ha sido movida. Verifica la URL o navega desde el menú principal.'
    case 500:
      return 'Estamos experimentando problemas técnicos. Nuestro equipo está trabajando para solucionarlo.'
    case 503:
      return 'El servicio está temporalmente no disponible. Por favor, inténtalo en unos minutos.'
    default:
      return 'Ha ocurrido un error inesperado. Por favor, inténtalo nuevamente.'
  }
})

// Funciones de navegación
const goHome = () => {
  navigateTo('/')
}

const goBack = () => {
  if (canGoBack.value) {
    window.history.back()
  } else {
    goHome()
  }
}

const refresh = () => {
  window.location.reload()
}
</script>

<style scoped lang="scss">
@use '@/assets/scss/pages/error';
</style>