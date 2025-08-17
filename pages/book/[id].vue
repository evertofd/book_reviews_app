<template>
  <div>
    <!-- Alertas tipo toast -->
    <div v-if="error" class="toast toast-error">
      <span class="toast-icon">❌</span>
      <span class="toast-message">{{ error }}</span>
      <button @click="error = ''" class="toast-close">×</button>
    </div>

    <div v-if="success" class="toast toast-success">
      <span class="toast-icon">✅</span>
      <span class="toast-message">{{ success }}</span>
      <button @click="success = ''" class="toast-close">×</button>
    </div>

    <UiLoadingSpinner v-if="!authInitialized" message="Cargando..." />

    <div v-else class="book-detail-container">
      <!-- Detalle del libro -->
      <div v-if="selectedBook" class="book-detail">
        <div class="book-info-section">
          <div class="book-cover-container">
            <img :src="selectedBook.coverUrl || defaultBookCover" :alt="selectedBook.title" class="book-cover-large"
              @error="handleImageError" />
          </div>

          <div class="book-details">
            <h1 class="book-title">{{ selectedBook.title }}</h1>
            <p class="book-author">Autor: {{ selectedBook.author }}</p>
            <p class="book-year">
              Año de publicación: {{ selectedBook.publishYear }}
            </p>
            <p v-if="selectedBook.isbn" class="book-isbn">
              ISBN: {{ selectedBook.isbn }}
            </p>
          </div>
        </div>

        <!-- Formulario de review -->
        <div class="review-section">
          <h2 class="review-title">Agregar Review y Calificación</h2>

          <form @submit.prevent="handleSave" class="review-form">
            <!-- Campo de review -->
            <div class="form-group">
              <label for="review" class="form-label">Review del libro:</label>
              <textarea id="review" v-model="reviewForm.review"
                placeholder="Escribe tu opinión sobre este libro (máximo 500 caracteres)" maxlength="500" rows="6"
                class="review-textarea"></textarea>
              <div class="char-counter">
                {{ reviewForm.review.length }}/500 caracteres
              </div>
            </div>

            <!-- Calificación -->
            <div class="form-group">
              <label class="form-label">Calificación (1-5 estrellas):</label>
              <div class="rating-container">
                <button v-for="star in 5" :key="star" type="button" @click="setRating(star)" class="star-btn"
                  :class="{ active: star <= reviewForm.rating }">
                  ★
                </button>
                <span class="rating-text">{{ reviewForm.rating }}/5</span>
              </div>
            </div>

            <!-- Botón guardar -->
            <button type="submit" :disabled="loading || !reviewForm.rating" class="save-btn">
              <span v-if="loading" class="button-loader"></span>
              {{ loading ? "Guardando..." : "Guardar en Mi Biblioteca" }}
            </button>
          </form>
        </div>
      </div>

      <div v-else class="no-book">
        <div class="no-book-icon">📖</div>
        <h3>No se encontró información del libro</h3>
        <p>El libro que buscas no está disponible</p>
        <button @click="goBack" class="back-btn">Volver al buscador</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @Everto Farias
 * @description: Configuración que protege la página de detalle requiriendo autenticación
 * @return: PageMeta - Aplica middleware auth para acceso solo a usuarios logueados
 */
definePageMeta({
  middleware: "auth",
});

const route = useRoute();
const authStore = useAuthStore();
const booksStore = useBooksStore();
const defaultBookCover = booksStore.defaultBookCover

const authInitialized = computed(() => authStore.initialized);
const selectedBook = computed(() => booksStore.selectedBook);

const loading = ref(false);
const error = ref("");
const success = ref("");

const reviewForm = reactive({
  review: "",
  rating: 0,
});


/**
 * @Everto Farias
 * @description: Establece calificación del libro al hacer click en estrellas
 * @return: void - Actualiza reviewForm.rating con valor seleccionado (1-5)
 */
const setRating = (rating: number) => {
  reviewForm.rating = rating;
};

/**
 * @Everto Farias
 * @description: Maneja guardado del libro en biblioteca convirtiendo imagen a base64 
 * @return: Promise<void> - Procesa imagen, envía datos y redirige a biblioteca tras éxito
 */
const handleSave = async () => {
  if (!selectedBook.value || !reviewForm.rating) return;

  loading.value = true;
  error.value = "";
  success.value = "";

  try {
    const config = useRuntimeConfig();

    // Convertir imagen a base64
    const base64Cover = await convertImageToBase64(selectedBook.value.coverUrl);

    const bookData = {
      title: selectedBook.value.title,
      author: selectedBook.value.author,
      publishYear: selectedBook.value.publishYear,
      openLibraryId: selectedBook.value.openLibraryId,
      isbn: selectedBook.value.isbn,
      review: reviewForm.review,
      rating: reviewForm.rating,
      coverBase64: base64Cover,
    };

    await $fetch(`${config.public.apiBase}/books/my-library`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
      body: bookData,
    });

    success.value = "¡Libro guardado exitosamente en tu biblioteca!";

    setTimeout(() => {
      success.value = "";
    }, 3000);

    setTimeout(() => {
      navigateTo("/library");
    }, 2000);
  } catch (err: any) {
    error.value =
      err.data?.error || "Error al guardar el libro. Inténtalo nuevamente.";

    setTimeout(() => {
      error.value = "";
    }, 5000);
  } finally {
    loading.value = false;
  }
};

/**
 * @Everto Farias
 * @description: Convierte URL de imagen a string base64 usando fetch y FileReader
 * @return: Promise<string> - Imagen convertida a formato base64 para almacenamiento
 */

const convertImageToBase64 = async (imageUrl: string): Promise<string> => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting image to base64:", error);
    return "";
  }
};

/**
 * @Everto Farias
 * @description: Maneja error de carga de imagen estableciendo placeholder por defecto
 * @return: void - Reemplaza src con defaultBookCover si la imagen falla
 */
const handleImageError = (event: any) => {
  if (event.target.src !== defaultBookCover) {
    event.target.src = defaultBookCover;
  }
};

const goBack = () => {
  navigateTo("/");
};

onMounted(() => {
  if (!selectedBook.value) {
    navigateTo("/");
  }
});
</script>

<style scoped lang="scss">
@use "@/assets/scss/pages/book-detail";
</style>