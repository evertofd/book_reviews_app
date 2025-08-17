<template>
  <div class="book-card">
    <div class="book-cover-container">
      <img
        :src="book.coverUrl || defaultBookCover"
        :alt="book.title"
        class="book-cover"
        @error="handleImageError"
      />
    </div>

    <div class="book-info">
      <h3 class="book-title">{{ book.title }}</h3>
      <p class="book-author">{{ book.author }}</p>
      <p class="book-year">{{ book.publishYear }}</p>

      <div class="rating">
        <span class="stars">
          <span
            v-for="star in 5"
            :key="star"
            class="star"
            :class="{ filled: star <= book.rating }"
          >
            ★
          </span>
        </span>
        <span class="rating-number">{{ book.rating }}/5</span>
      </div>

      <!-- Espacio para reseña siempre presente -->
      <div class="review-preview">
        <p v-if="book.review">{{ truncatedReview }}</p>
        <p v-else class="no-review">Sin reseña</p>
      </div>

      <div class="book-actions">
        <button @click="$emit('edit', book)" class="edit-btn">
          Editar
        </button>
        <button @click="$emit('delete', book)" class="delete-btn">
          Eliminar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Book {
  _id: string
  title: string
  author: string
  publishYear: number
  rating: number
  review?: string
  coverUrl?: string
}

interface Props {
  book: Book
}

const props = defineProps<Props>()

defineEmits<{
  'edit': [book: Book]
  'delete': [book: Book]
}>()

// Imagen por defecto
const defaultBookCover = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI4MCIgdmlld0JveD0iMCAwIDIwMCAyODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04MCA5MEgxMjBWMTIwSDgwVjkwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNNzAgMTQwSDE3MFYxNTBINzBWMTQwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNODAgMTYwSDE0MFYxNzBIODBWMTYwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K'

// Review truncado
const truncatedReview = computed(() => {
  if (!props.book.review) return ''
  return props.book.review.length > 150 
    ? props.book.review.substring(0, 150) + '...' 
    : props.book.review
})

const handleImageError = (event: any) => {
  if (event.target.src !== defaultBookCover) {
    event.target.src = defaultBookCover
  }
}
</script>

<style scoped lang="scss">
@use '@/assets/scss/components/library-book-card';
</style>