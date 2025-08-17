<template>
  <div v-if="booksStore.searchHistory.length > 0" class="search-history">
    <div class="history-header">
      <h3 class="history-title">
        <span class="history-icon">🔍</span>
        Búsquedas recientes
      </h3>
      <p class="history-subtitle">Haz clic para buscar nuevamente</p>
    </div>

    <div class="history-items">
      <button
        v-for="(query, index) in booksStore.searchHistory"
        :key="`${query}-${index}`"
        @click="handleSearch(query)"
        class="history-item"
      >
        <span class="history-text">{{ query }}</span>
        <span class="history-arrow">→</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const booksStore = useBooksStore();

const emit = defineEmits(["search"]);

const handleSearch = (query: string) => {
  emit("search", query);
};
</script>

<style scoped lang="scss">
@use "@/assets/scss/components/search-history";
</style>