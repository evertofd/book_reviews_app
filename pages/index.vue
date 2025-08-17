<template>
  <UiLoadingSpinner v-if="!authInitialized" message="Verificando sesión..." />

  <!-- Main content -->
  <div v-else class="search-container">
    <div class="search-section">
      <UiSearchBox
        v-model="searchQuery"
        :loading="booksStore.loading"
        @search="handleSearch"
      />

      <BooksSearchHistory @search="searchFromHistory" />
    </div>

    <BooksSearchResults :show-results="showResults" @book-select="selectBook" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

const authStore = useAuthStore();
const booksStore = useBooksStore();

const authInitialized = computed(() => authStore.initialized);

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

const handleSearch = async () => {
  if (!searchQuery.value.trim()) return;
  showResults.value = true;
  await booksStore.searchBooks(searchQuery.value.trim(), 10);
};

const searchFromHistory = async (query: string) => {
  searchQuery.value = query;
  await handleSearch();
};

const selectBook = (book: any) => {
  booksStore.selectBook(book);
  const cleanId = book.openLibraryId.replace(/^\/works\//, '');
  navigateTo(`/book/${cleanId}`);
};
const goToLibrary = () => {
  navigateTo("/library");
};
</script>

<style scoped lang="scss">
@use "@/assets/scss/pages/index";
</style>

