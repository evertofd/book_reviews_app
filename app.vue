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
const authInitialized = computed(() => authStore.initialized);
</script>