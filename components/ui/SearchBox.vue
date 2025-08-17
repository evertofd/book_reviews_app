<template>
  <div class="search-section-input">
    <input
      v-model="internalQuery"
      type="text"
      class="search-input"
      :placeholder="placeholder"
      @keyup.enter="handleSearch"
      :disabled="loading"
    />
    <button
      @click="handleSearch"
      :disabled="!internalQuery.trim() || loading"
      class="search-button"
    >
      {{ loading ? loadingText : buttonText }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string;
  placeholder?: string;
  buttonText?: string;
  loadingText?: string;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  placeholder: "Escribe el nombre de un libro para continuar...",
  buttonText: "Buscar",
  loadingText: "Buscando...",
  loading: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  search: [query: string];
}>();

const internalQuery = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const handleSearch = () => {
  if (!internalQuery.value.trim()) return;
  emit("search", internalQuery.value.trim());
};
</script>

<style scoped lang="scss">
@use "@/assets/scss/components/search-box";
</style>