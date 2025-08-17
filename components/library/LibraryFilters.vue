<template>
  <div class="filters-section">
    <div class="search-filters">
      <input
        v-model="internalFilters.search"
        type="text"
        placeholder="Buscar por título o autor..."
        class="search-input"
      />

      <select v-model="internalFilters.sortBy" class="sort-select">
        <option value="">Ordenar por...</option>
        <option value="rating-desc">Calificación (mayor a menor)</option>
        <option value="rating-asc">Calificación (menor a mayor)</option>
        <option value="title-asc">Título (A-Z)</option>
        <option value="title-desc">Título (Z-A)</option>
        <option value="newest">Más recientes</option>
        <option value="oldest">Más antiguos</option>
      </select>

      <label class="checkbox-label">
        <input v-model="internalFilters.excludeNoReview" type="checkbox" />
        Excluir libros sin review
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Filters {
  search: string
  sortBy: string
  excludeNoReview: boolean
}

interface Props {
  modelValue: Filters
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [filters: Filters]
}>()

const internalFilters = computed({
  get: () => props.modelValue,
  set: (value:any) => emit('update:modelValue', value)
})
</script>

<style scoped lang="scss">
@use '@/assets/scss/components/library-filters';
</style>