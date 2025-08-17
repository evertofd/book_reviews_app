<template>
  <div>
    <UiNavbar
      title="Libreria"
      v-if="authInitialized && authStore.isAuthenticated"
      :show-navigation-button="true"
      navigation-button-text="Mi Biblioteca"
      navigation-route="/library"
    />
    <NuxtPage />
  </div>
</template>


<script setup lang="ts">
const authStore = useAuthStore();

/**
 * @Everto Farias
 * @description: Computed que verifica si la autenticación ya fue inicializada
 * @return: Computed<boolean> - true cuando el auth store ha terminado su inicialización
 */
const authInitialized = computed(() => authStore.initialized);
</script>