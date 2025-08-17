<template>
  <div class="results-section">
    <!-- Loading durante búsqueda -->
    <UiLoadingSpinner v-if="booksStore.loading" message="Realizando búsqueda..." />

    <!-- Error -->
    <div v-else-if="booksStore.error" class="error-message">
      <span class="error-icon">⚠️</span>
      {{ booksStore.error }}
    </div>

    <!-- Sin resultados después de buscar -->
    <div v-else-if="showResults && booksStore.searchResults.length === 0" class="no-results">
      <div class="no-results-icon">📚</div>
      <h3>No encontramos libros</h3>
      <p>No hay resultados para el término de búsqueda ingresado</p>
    </div>

    <!-- Resultados encontrados -->
    <div v-else-if="showResults && booksStore.searchResults.length > 0" class="results-grid">
      <div class="results-header">
        <h3>Resultados de búsqueda</h3>
        <span class="results-count">{{ booksStore.total }} encontrados</span>
      </div>

      <div class="books-grid">
        <div v-for="book in booksStore.searchResults" :key="book.openLibraryId" @click="handleBookSelect(book)"
          class="book-card">
          <div class="book-cover-container">
            <img :src="book.coverUrl || defaultBookCover" :alt="book.title" class="book-cover"
              @error="handleImageError" />
          </div>
          <div class="book-info">
            <h4 class="book-title">{{ book.title }}</h4>
            <p class="book-author">{{ book.author }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Estado inicial - sin búsquedas -->
    <div v-else class="empty-state">
      <div class="empty-icon">🔍</div>
      <h3>Realiza una búsqueda</h3>
      <p>Escribe el nombre de un libro para comenzar a explorar nuestra colección</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  showResults: boolean
}

defineProps<Props>()

const emit = defineEmits(['book-select'])

const booksStore = useBooksStore()
const defaultBookCover = booksStore.defaultBookCover

/**
 * @Everto Farias
 * @description: Maneja click en libro emitiendo evento book-select al componente padre
 * @return: void - Emite evento con objeto libro seleccionado para navegación
 */
const handleBookSelect = (book: any) => {
  emit('book-select', book)
}
/**
 * @Everto Farias
 * @description: Maneja error de carga de imagen reemplazando src con placeholder por defecto
 * @return: void - Fallback automático para imágenes rotas sin bucles infinitos
 */
const handleImageError = (event: any) => {
  if (event.target.src !== defaultBookCover) {
    event.target.src = defaultBookCover
  }
}
</script>

<style scoped lang="scss">
@use '@/assets/scss/components/search-results';
</style>