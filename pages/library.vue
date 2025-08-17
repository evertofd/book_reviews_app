<template>
  <div>
    <!-- Loading de autenticación -->
    <UiLoadingSpinner v-if="!authInitialized" message="Verificando sesión..." />

    <!-- Contenido principal -->
    <div v-else class="library-container">
      <!-- Filtros y búsqueda -->
      <LibraryFilters v-model="filters" />
      <!-- Loading de libros-->
      <UiLoadingSpinner v-if="libraryStore.loading" message="Cargando libros..." />
      <!-- Error -->
      <div v-else-if="libraryStore.error" class="error-message">
        <span class="error-icon">⚠️</span>
        {{ libraryStore.error }}
      </div>

      <!-- Sin libros -->
      <div v-else-if="filteredBooks.length === 0" class="no-books">
        <div class="no-books-icon">📚</div>
        <h3 v-if="libraryStore.books.length === 0">Tu biblioteca está vacía</h3>
        <h3 v-else>No se encontraron libros</h3>
        <p v-if="libraryStore.books.length === 0">
          Aún no tienes libros en tu biblioteca.
        </p>
        <p v-else>
          No se encontraron libros con los filtros aplicados.
        </p>
        <button @click="goToSearch" class="search-btn">
          Buscar libros
        </button>
      </div>

      <!-- Grid de libros -->
      <div v-else class="books-grid">
        <LibraryBookCard v-for="book in filteredBooks" :key="book._id" :book="book" @edit="editBook"
          @delete="confirmDelete" />
      </div>

      <!-- Modal de confirmación para eliminar -->
      <LibraryDeleteModal :show="showDeleteModal" :book="bookToDelete" :loading="deleteLoading"
        @close="closeDeleteModal" @confirm="deleteBook" />

      <!-- Modal de edición -->
      <LibraryEditModa :show="showEditModal" :book="bookToEdit" :loading="editLoading" @close="closeEditModal"
        @save="saveEdit" />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @Everto Farias
 * @description: Configuración que protege la página de biblioteca requiriendo autenticación
 * @return: PageMeta - Aplica middleware auth para acceso solo a usuarios logueados
 */
definePageMeta({
  middleware: "auth",
});

const authStore = useAuthStore();
const libraryStore = useLibraryStore();

const authInitialized = computed(() => authStore.initialized);

const filters = reactive({
  search: "",
  sortBy: "",
  excludeNoReview: false,
});

const showDeleteModal = ref(false);
const showEditModal = ref(false);
const bookToDelete = ref(null);
const bookToEdit = ref(null);
const editLoading = ref(false);
const deleteLoading = ref(false);

/**
 * @Everto Farias
 * @description: Carga biblioteca cuando auth se inicializa y usuario está autenticado
 * @return: void - Ejecuta loadLibrary al completarse la autenticación
 */
watch(
  authInitialized,
  async (isInitialized: any) => {
    if (isInitialized && authStore.isAuthenticated) {
      await libraryStore.loadLibrary();
    }
  },
  { immediate: true }
);

const filteredBooks = computed(() => libraryStore.books);

/**
 * @Everto Farias
 * @description: Aplica filtros actuales llamando a la API con parámetros de búsqueda y ordenamiento
 * @return: Promise<void> - Recarga biblioteca desde servidor con filtros aplicados
 */
const applyFilters = async () => {
  const filterParams: any = {};

  if (filters.search.trim()) {
    filterParams.search = filters.search.trim();
  }

  if (filters.sortBy) {
    filterParams.sortBy = filters.sortBy;
  }

  if (filters.excludeNoReview) {
    filterParams.excludeNoReview = "true";
  }

  await libraryStore.loadLibrary(filterParams);
};

/**
 * @Everto Farias
 * @description: Aplica filtros automáticamente cuando cambian los valores
 * @return: void - Ejecuta applyFilters en cada cambio de filtro
 */
watch(
  [() => filters.search, () => filters.sortBy, () => filters.excludeNoReview],
  async () => {
    await applyFilters();
  }
);

/**
 * @Everto Farias
 * @description: Abrir modal de edición y guardar cambios de review y rating
 * @return: void | Promise<void> - Maneja flujo completo de edición con loading states
 */
const editBook = (book: any) => {
  bookToEdit.value = book;
  showEditModal.value = true;
};


const saveEdit = async (editData: { review: string; rating: number }) => {
  if (!bookToEdit.value) return;

  editLoading.value = true;
  try {
    await libraryStore.updateBook(bookToEdit.value._id, editData);
    closeEditModal();
  } catch (error) {
    console.error("Error updating book:", error);
  } finally {
    editLoading.value = false;
  }
};

const closeEditModal = () => {
  showEditModal.value = false;
  bookToEdit.value = null;
};
/**
 * @Everto Farias
 * @description: Confirmar eliminación y ejecutar borrado con confirmación previa
 * @return: void | Promise<void> - Maneja eliminación segura con modal de confirmación
 */

const confirmDelete = (book: any) => {
  bookToDelete.value = book;
  showDeleteModal.value = true;
};

const deleteBook = async () => {
  if (!bookToDelete.value) return;

  deleteLoading.value = true;
  try {
    await libraryStore.deleteBook(bookToDelete.value._id);
    closeDeleteModal();
  } catch (error) {
    console.error("Error deleting book:", error);
  } finally {
    deleteLoading.value = false;
  }
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  bookToDelete.value = null;
};

const goToSearch = () => {
  navigateTo("/");
};
</script>

<style scoped lang="scss">
@use '@/assets/scss/pages/library';
</style>