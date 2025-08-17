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
            <input id="alias" v-model="form.alias" type="text" class="form-input" placeholder="Tu nombre de usuario"
              required :disabled="authStore.loading" />
          </div>

          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input id="email" v-model="form.email" type="email" class="form-input" placeholder="tu@email.com" required
              :disabled="authStore.loading" />
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Contraseña</label>
            <input id="password" v-model="form.password" type="password" class="form-input"
              placeholder="Mínimo 6 caracteres, 1 mayúscula, 1 carácter especial" required :disabled="authStore.loading"
              :class="{ 'error': passwordError }" />

            <!-- Indicadores visuales -->
            <div class="password-requirements">
              <div :class="{ 'valid': hasMinLength }" class="requirement">
                ✓ Mínimo 6 caracteres
              </div>
              <div :class="{ 'valid': hasUppercase }" class="requirement">
                ✓ Una mayúscula
              </div>
              <div :class="{ 'valid': hasSpecialChar }" class="requirement">
                ✓ Un carácter especial
              </div>
            </div>
          </div>

          <button type="submit" class="register-button"
            :disabled="authStore.loading || !form.alias || !form.email || !form.password">
            <span v-if="authStore.loading" class="button-loader"></span>
            {{ authStore.loading ? 'Creando cuenta...' : 'Crear Cuenta' }}
          </button>

          <div v-if="error" class="error-message">
            <span class="error-icon">⚠️ {{ error }}</span>
            
          </div>

          <div v-if="success" class="success-message">
            <span class="success-icon">✅ {{ success }}</span>
            
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
  alias: '',
  email: '',
  password: ''
})

const error = ref('')
const success = ref('')
const passwordError = ref('')

const hasMinLength = computed(() => form.password.length >= 6)
const hasUppercase = computed(() => /[A-Z]/.test(form.password))
const hasSpecialChar = computed(() => /[!@#$%^&*(),.?":{}|<>]/.test(form.password))
const isPasswordValid = computed(() =>
  hasMinLength.value && hasUppercase.value && hasSpecialChar.value
)
/**
 * @Everto Farias
 * @description: Maneja registro de usuario, muestra mensaje de éxito y redirige a login tras delay
 * @return: Promise<void> - Ejecuta registro, muestra feedback y navega a login después de 2s
 */
const handleRegister = async () => {
  try {
    error.value = ''

    if (!isPasswordValid.value) {
      error.value = 'La contraseña no cumple con los requisitos'
      return
    }

    success.value = ''
    await authStore.register(form)
    success.value = 'Cuenta creada exitosamente. Redirigiendo al login...'
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