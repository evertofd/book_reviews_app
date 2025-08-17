<template>
  <div class="auth-container">
    <!-- Sección de imagen -->
    <div class="image-section">
      <div class="image-overlay">
        <div class="image-content">
          <h2>Únete a Entre Páginas</h2>
          <p>Crea tu cuenta y comienza tu viaje literario</p>
        </div>
      </div>
    </div>

    <!-- Sección del formulario -->
    <div class="form-section">
      <div class="register-card">
        <div class="register-header">
          <div class="register-icon">📝</div>
          <h1 class="register-title">Crear Cuenta</h1>
          <p class="register-subtitle">Únete a nuestra comunidad de lectores</p>
        </div>
        
        <form @submit.prevent="handleRegister" class="register-form">
          <div class="form-group">
            <label for="alias" class="form-label">Alias</label>
            <input 
              id="alias"
              v-model="form.alias" 
              type="text" 
              class="form-input"
              placeholder="Tu nombre de usuario"
              required
              :disabled="authStore.loading"
            />
          </div>

          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input 
              id="email"
              v-model="form.email" 
              type="email" 
              class="form-input"
              placeholder="tu@email.com"
              required
              :disabled="authStore.loading"
            />
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Contraseña</label>
            <input 
              id="password"
              v-model="form.password" 
              type="password" 
              class="form-input"
              placeholder="Tu contraseña"
              required
              :disabled="authStore.loading"
            />
          </div>

          <button 
            type="submit" 
            class="register-button"
            :disabled="authStore.loading || !form.alias || !form.email || !form.password"
          >
            <span v-if="authStore.loading" class="button-loader"></span>
            {{ authStore.loading ? 'Creando cuenta...' : 'Crear Cuenta' }}
          </button>

          <div v-if="error" class="error-message">
            <span class="error-icon">⚠️</span>
            {{ error }}
          </div>

          <div v-if="success" class="success-message">
            <span class="success-icon">✅</span>
            {{ success }}
          </div>
        </form>

        <div class="register-footer">
          <p class="login-text">
            ¿Ya tienes cuenta? 
            <NuxtLink to="/login" class="login-link">Inicia sesión aquí</NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'guest'
})

const authStore = useAuthStore()

const form = reactive({
  alias: '',
  email: '',
  password: ''
})

const error = ref('')
const success = ref('')

const handleRegister = async () => {
  try {
    error.value = ''
    success.value = ''
    
    await authStore.register(form)
    
    success.value = 'Cuenta creada exitosamente. Redirigiendo al login...'
    
    // Redirigir al login después de 2 segundos
    setTimeout(() => {
      navigateTo('/login')
    }, 2000)
    
  } catch (err) {
    error.value = 'Error al crear la cuenta'
  }
}
</script>

<style scoped lang="scss">
@use '@/assets/scss/pages/register';
</style>