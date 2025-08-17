<template>
  <div class="header">
    <div class="header-left">
      <h1>{{ currentTitle }}</h1>
    </div>
    <div class="user-info">
      <span>{{ greeting }}</span>
    <button
        @click="!isLibraryPage ? goToLibrary() : goToHome()"
        class="nav-btn"
      >
        {{ !isLibraryPage ? "Mi Biblioteca" : "Volver al Buscador" }}
      </button>

      <button @click="logout" class="logout-btn">Cerrar Sesión</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const route = useRoute();

// Detectar en qué página estamos
const isLibraryPage = computed(() => route.path === "/library");

// Título dinámico según la página
const currentTitle = computed(() => {
  return isLibraryPage.value ? "📚 Mi Biblioteca" : "📖 Entre Páginas";
});

// Saludo dinámico según la página
const greeting = computed(() => {
  const name = authStore.user?.alias || "Usuario";
  return isLibraryPage.value ? name : `Hola, ${name}!`;
});

const goToHome = () => {
  navigateTo("/");
};

const goToLibrary = () => {
  navigateTo("/library");
};

const logout = () => {
  authStore.logout();
};
</script>

<style scoped lang="scss">
@use "@/assets/scss/components/navbar";
</style>