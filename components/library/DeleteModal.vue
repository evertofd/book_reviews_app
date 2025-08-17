<template>
  <div v-if="show" class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">Confirmar eliminación</h3>
        <div class="modal-icon">🗑️</div>
      </div>
      
      <div class="modal-body">
        <p>
          ¿Estás seguro de que quieres eliminar 
          <strong>"{{ book?.title }}"</strong> de tu biblioteca?
        </p>
        <p class="warning-text">Esta acción no se puede deshacer.</p>
      </div>
      
      <div class="modal-actions">
        <button @click="$emit('close')" class="cancel-btn">
          Cancelar
        </button>
        <button @click="handleDelete" class="confirm-delete-btn" :disabled="loading">
          <span v-if="loading" class="button-loader"></span>
          {{ loading ? 'Eliminando...' : 'Eliminar' }}
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
}

interface Props {
  show: boolean
  book?: Book | null
  loading?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  'close': []
  'confirm': []
}>()

const handleDelete = () => {
  emit('confirm')
}
</script>

<style scoped lang="scss">
@use '@/assets/scss/components/library-delete-modal';
</style>