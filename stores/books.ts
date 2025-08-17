import { defineStore } from 'pinia'

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

  actions: {
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
          
          if (!this.searchHistory.includes(query)) {
            this.searchHistory.unshift(query)
            if (this.searchHistory.length > 5) {
              this.searchHistory = this.searchHistory.slice(0, 5)
            }
          }
        } else {
          this.error = 'No se pudieron obtener resultados'
          this.searchResults = []
        }
        
      } catch (error: any) {
        this.error = error.data?.error || 'Error al buscar libros'
        this.searchResults = []
      } finally {
        this.loading = false
      }
    },

    selectBook(book: Book) {
      this.selectedBook = book
    },

    clearSearch() {
      this.searchResults = []
      this.selectedBook = null
      this.error = null
      this.total = 0
    }
  }
})