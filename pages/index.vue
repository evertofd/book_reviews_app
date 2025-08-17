<template>
  <UiLoadingSpinner v-if="!authInitialized" message="Verificando sesión..." />

  <!-- Main content -->
  <div v-else class="search-container">
    <div class="search-section">
      <UiSearchBox v-model="searchQuery" :loading="booksStore.loading" @search="handleSearch" />

      <BooksSearchHistory @search="searchFromHistory" />
    </div>

    <BooksSearchResults :show-results="showResults" @book-select="selectBook" />
  </div>
</template>

<script setup lang="ts">
/**
 * @Everto Farias
 * @description: Configuración que protege la página principal requiriendo autenticación
 * @return: PageMeta - Aplica middleware auth para bloquear usuarios no autenticados
 */
definePageMeta({
  middleware: "auth",
});

const authStore = useAuthStore();
const booksStore = useBooksStore();
/**
 * @Everto Farias
 * @description: Computed que verificamos si la autentication ya fue realizada
 * @return: ComputedRef<boolean> - Estado reactivo de inicialización del auth store
 */
const authInitialized = computed(() => authStore.initialized);

/**
 * @Everto Farias
 * @description: Carga historial de búsquedas cuando auth se inicializa y usuario está logueado
 * @return: void - Ejecuta loadSearchHistory al completarse la inicialización
 */
watch(
  authInitialized,
  async (isInitialized: any) => {
    if (isInitialized && authStore.isAuthenticated) {
      await booksStore.loadSearchHistory();
    }
  },
  { immediate: true }
);

const searchQuery = ref("");
const showResults = ref(false);

/**
 * @Everto Farias
 * @description: Ejecuta búsqueda de libros si hay query válido y muestra sección de resultados
 * @return: Promise<void> - Busca en OpenLibrary API y actualiza estado
 */
const handleSearch = async () => {
  if (!searchQuery.value.trim()) return;
  showResults.value = true;
  await booksStore.searchBooks(searchQuery.value.trim(), 10);
};

/**
 * @Everto Farias
 * @description: Maneja búsqueda desde el historial estableciendo query y ejecutando búsqueda
 * @return: Promise<void> - Reutiliza lógica de handleSearch con query del historial
 */
const searchFromHistory = async (query: string) => {
  searchQuery.value = query;
  await handleSearch();
};

/**
 * @Everto Farias
 * @description: Maneja selección de libro, guarda en store y navega a página de detalle
 * @return: void - Navega a /book/[cleanId] removiendo prefijo de OpenLibrary
 */
const selectBook = (book: any) => {
  booksStore.selectBook(book);
  const cleanId = book.openLibraryId.replace(/^\/works\//, '');
  navigateTo(`/book/${cleanId}`);
};

</script>

<style scoped lang="scss">
@use "@/assets/scss/pages/index";
</style>
