<template>
  <div v-if="show" class="modal-overlay" @click="$emit('close')">
    <div class="modal-content edit-modal" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">Editar: {{ book?.title }}</h3>
        <div class="modal-icon">✏️</div>
      </div>

      <form @submit.prevent="handleSave" class="edit-form">
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Review:</label>
            <textarea
              v-model="formData.review"
              maxlength="500"
              rows="4"
              class="review-textarea"
              placeholder="Escribe tu opinión sobre este libro..."
            ></textarea>
            <div class="char-counter">{{ formData.review.length }}/500</div>
          </div>

          <div class="form-group">
            <label class="form-label">Calificación:</label>
            <div class="rating-container">
              <button
                v-for="star in 5"
                :key="star"
                type="button"
                @click="formData.rating = star"
                class="star-btn"
                :class="{ active: star <= formData.rating }"
              >
                ★
              </button>
              <span class="rating-text">{{ formData.rating }}/5</span>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button type="button" @click="$emit('close')" class="cancel-btn">
            Cancelar
          </button>
          <button type="submit" :disabled="loading || !formData.rating" class="save-btn">
            <span v-if="loading" class="button-loader"></span>
            {{ loading ? "Guardando..." : "Guardar" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Book {
  _id: string
  title: string
  author: string
  review: string
  rating: number
}

interface EditData {
  review: string
  rating: number
}

interface Props {
  show: boolean
  book?: Book | null
  loading?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'close': []
  'save': [data: EditData]
}>()

const formData = reactive({
  review: '',
  rating: 0
})

// Actualizar formulario cuando cambie el libro
watch(() => props.book, (newBook:any) => {
  if (newBook) {
    formData.review = newBook.review || ''
    formData.rating = newBook.rating || 0
  }
}, { immediate: true })

// Limpiar formulario al cerrar
watch(() => props.show, (isOpen:boolean) => {
  if (!isOpen) {
    formData.review = ''
    formData.rating = 0
  }
})

const handleSave = () => {
  if (!formData.rating) return
  
  emit('save', {
    review: formData.review,
    rating: formData.rating
  })
}
</script>

<style scoped lang="scss">
@use '@/assets/scss/components/library-edit-modal';
</style>