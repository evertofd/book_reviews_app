<template>
  <div class="loading-container">
    <div class="spinner-wrapper">
      <div class="spinner"></div>
      <div class="loading-text">📚{{ message }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message?: string
}

withDefaults(defineProps<Props>(), {
  message: 'Cargando...'
})
</script>

<style scoped lang="scss">
@use '@/assets/scss/components/loading-spinner';
</style>