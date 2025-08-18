import { defineStore } from 'pinia'

/**
 * @Everto Farias
 * @description: Interfaces TypeScript
 * @return: Tipos definidos para Book, SearchResponse, SearchHistory y SearchState
 */
interface Book {
  title: string
  author: string
  publishYear: string
  coverId: number
  coverUrl: string
  openLibraryId: string
  isbn: string
  inLibrary: boolean
  hasFulltext: boolean
  editionCount: number
}

interface SearchResponse {
  success: boolean
  message: string
  books: Book[]
  total: number
  query: string
  timestamp: string
}

interface SearchHistoryItem {
  query: string
  createdAt: string
}

interface SearchHistoryResponse {
  success: boolean
  searches: SearchHistoryItem[]
  total: number
  user: string
}

interface SearchState {
  searchResults: Book[]
  searchHistory: string[]
  loading: boolean
  error: string | null
  selectedBook: Book | null
  total: number
  historyLoaded: boolean
}

/**
 * @Everto Farias
 * @description: Estado inicial del store de libros con resultados, historial y flags de control
 * @return: SearchState - Estado reactivo con arrays, loading, error y libro seleccionado
 */
export const useBooksStore = defineStore('books', {
  state: (): SearchState => ({
    searchResults: [],
    searchHistory: [],
    loading: false,
    error: null,
    selectedBook: null,
    total: 0,
    historyLoaded: false
  }),
  getters: {
    /**
     * @Everto Farias
     * @description: Getter que retorna imagen placeholder por defecto para portadas de libros
     * @return: string - Data URL SVG en base64 reutilizable en toda la aplicación
     */
    defaultBookCover: () => 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI4MCIgdmlld0JveD0iMCAwIDIwMCAyODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04MCA5MEgxMjBWMTIwSDgwVjkwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNNzAgMTQwSDE3MFYxNTBINzBWMTQwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNODAgMTYwSDE0MFYxNzBIODBWMTYwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K'
  },
  actions: {
    /**
     * @Everto Farias
     * @description: Carga historial de búsquedas desde API una sola vez usando flag de control
     * @return: Promise<void> - Obtiene últimas 5 búsquedas y actualiza searchHistory array
     */
    async loadSearchHistory() {
      if (this.historyLoaded) return

      try {
        const config = useRuntimeConfig()
        const authStore = useAuthStore()

        if (!authStore.token) return

        const response = await $fetch<SearchHistoryResponse>(`${config.public.apiBase}/books/last-search`, {
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        })

        if (response.success) {
          this.searchHistory = response.searches.map(item => item.query)
          this.historyLoaded = true
        }

      } catch (error) {
        console.error('Error cargando historial:', error)
      }
    },

    /**
     * @Everto Farias
     * @description: Ejecuta búsqueda en OpenLibrary API y actualiza historial local automáticamente
     * @return: Promise<void> - Busca libros, actualiza resultados y mantiene historial de 5 elementos
     */
    async searchBooks(query: string, limit: number = 10) {
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const authStore = useAuthStore()

        const response = await $fetch<SearchResponse>(`${config.public.apiBase}/books/search`, {
          query: {
            q: query,
            limit: limit
          },
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        })

        if (response.success) {
          this.searchResults = response.books
          this.total = response.total
          this.error = null
        } else {
          this.searchResults = []
          this.error = null
        }
          /**
           * @description: Verifica si la query no existe en historial para evitar duplicados
           */
        if (!this.searchHistory.includes(query)) {
          this.searchHistory.unshift(query)
          if (this.searchHistory.length > 5) {
            this.searchHistory = this.searchHistory.slice(0, 5)
          }
        }
      } catch (error: any) {
        this.error = error.data?.error || 'Error al buscar libros'
        this.searchResults = []
      } finally {
        this.loading = false
      }
    },

    /**
     * @Everto Farias
     * @description: Selecciona libro para mostrar en página de detalle
     * @return: void - Establece selectedBook para navegación a /book/[id]
     */
    selectBook(book: Book) {
      this.selectedBook = book
    },

    /**
     * @Everto Farias
     * @description: Limpia resultados de búsqueda y estado de error
     * @return: void - Resetea searchResults, selectedBook, error y total
     */
    clearSearch() {
      this.searchResults = []
      this.selectedBook = null
      this.error = null
      this.total = 0
    },
    /**
     * @Everto Farias
     * @description: Limpia todo el estado del store de books al cambiar de usuario
     * @return: void - Resetea searchResults, history y flags
     */
    clearAllData() {
      this.searchResults = []
      this.searchHistory = []
      this.selectedBook = null
      this.total = 0
      this.historyLoaded = false
      this.error = null
    }
  }
})