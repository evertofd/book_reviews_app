<template>
 <div class="app-container">

   <UiLoadingSpinner v-if="!isStylesLoaded" message="Cargando..." />
   
   <div v-else>
     <UiNavbar
       title="Libreria"
       v-if="authInitialized && authStore.isAuthenticated"
       :show-navigation-button="true"
       navigation-button-text="Mi Biblioteca"
       navigation-route="/library"
     />
     <NuxtPage />
   </div>
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
const isStylesLoaded = ref(false)

onMounted(() => {
 /**
  * @Everto Farias
  * @description: Espera un delay mínimo para asegurar que los estilos CSS se hayan aplicado
  * @return: void - Actualiza isStylesLoaded después de 100ms
  */
 setTimeout(() => {
   isStylesLoaded.value = true
 }, 100)
})
</script>