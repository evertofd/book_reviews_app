<template>
  <div class="auth-container">
    <!-- Sección de imagen -->
    <div class="image-section">
      <div class="image-overlay">
        <div class="image-content">
          <h2>Bienvenido a Entre Páginas</h2>
          <p>Descubre, reseña y organiza tus libros favoritos</p>
        </div>
      </div>
    </div>

    <!-- Sección del formulario -->
    <div class="form-section">
      <div class="login-card">
        <div class="login-header">
          <div class="login-icon">📚</div>
          <h1 class="login-title">Iniciar Sesión</h1>
          <p class="login-subtitle">Accede a tu biblioteca personal</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input id="email" v-model="form.email" type="email" class="form-input" placeholder="tu@email.com" required
              :disabled="authStore.loading" />
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Contraseña</label>
            <input id="password" v-model="form.password" type="password" class="form-input" placeholder="Tu contraseña"
              required :disabled="authStore.loading" />
          </div>

          <button type="submit" class="login-button" :disabled="authStore.loading || !form.email || !form.password">
            <span v-if="authStore.loading" class="button-loader"></span>
            {{ authStore.loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>

          <div v-if="error" class="error-message">
            <span class="error-icon">⚠️</span>
            {{ error }}
          </div>
        </form>

        <div class="login-footer">
          <p class="register-text">
            ¿No tienes cuenta?
            <NuxtLink to="/register" class="register-link">Regístrate aquí</NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @Everto Farias
 * @description: Configuración de página que aplica middleware guest para bloquear usuarios autenticados
 * @return: PageMeta - Configuración que redirige usuarios logueados a home
 */
definePageMeta({
  middleware: 'guest'
})

const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: ''
})

const error = ref('')

/**
 * @Everto Farias
 * @description: Maneja envío del formulario, autentica usuario y redirige a home en caso de éxito
 * @return: Promise<void> - Ejecuta login y navegación o muestra error si falla
 */
const handleLogin = async () => {
  try {
    error.value = ''
    await authStore.login(form)
    await navigateTo('/')
  } catch (err: any) {
    error.value = err.data?.message || 'Error al iniciar sesión'
  }
}
</script>

<style scoped lang="scss">
@use '@/assets/scss/pages/login';
</style>