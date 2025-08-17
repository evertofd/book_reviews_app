import { defineStore } from 'pinia'

interface LibraryBook {
  _id: string
  userId: string
  title: string
  author: string
  publishYear: string
  coverBase64: string
  review: string
  rating: number
  openLibraryId: string
  isbn: string
  createdAt: string
  updatedAt: string
  coverSizeKB: number
  id: string
  coverUrl?: string 
}

interface LibraryStats {
  totalBooks: number
  booksWithReview: number
  booksWithoutReview: number
  averageRating: number
  highestRating: number
  lowestRating: number
}

interface LibraryResponse {
  success: boolean
  books: LibraryBook[]
  total: number
  stats: LibraryStats
  filters: {
    search: string | null
    sortBy: string
    excludeNoReview: boolean
  }
  user: string
}

interface LibraryState {
  books: LibraryBook[]
  loading: boolean
  error: string | null
  stats: LibraryStats | null
  total: number
}

export const useLibraryStore = defineStore('library', {
  state: (): LibraryState => ({
    books: [],
    loading: false,
    error: null,
    stats: null,
    total: 0
  }),

  actions: {
    async loadLibrary(filters?: { search?: string; sortBy?: string; excludeNoReview?: boolean }) {
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const authStore = useAuthStore()

        // Construir query parameters
        const params = new URLSearchParams()
        if (filters?.search) params.append('search', filters.search)
        if (filters?.sortBy) params.append('sortBy', filters.sortBy)
        if (filters?.excludeNoReview) params.append('excludeNoReview', 'true')

        const queryString = params.toString()
        const url = `${config.public.apiBase}/books/my-library${queryString ? `?${queryString}` : ''}`

        const response = await $fetch<LibraryResponse>(url, {
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        })

        if (response.success) {
          // Convertir coverBase64 a coverUrl para compatibilidad con componentes
          this.books = response.books.map(book => ({
            ...book,
            coverUrl: book.coverBase64 
          }))
          this.total = response.total
          this.stats = response.stats
        } else {
          this.error = 'Error al cargar la biblioteca'
          this.books = []
        }

      } catch (error: any) {
        this.error = error.data?.error || 'Error al cargar la biblioteca'
        this.books = []
      } finally {
        this.loading = false
      }
    },

    async updateBook(bookId: string, updateData: { review: string; rating: number }) {
      try {
        const config = useRuntimeConfig()
        const authStore = useAuthStore()

        await $fetch(`${config.public.apiBase}/books/my-library/${bookId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          },
          body: updateData
        })

        const bookIndex = this.books.findIndex(book => book._id === bookId)
        if (bookIndex !== -1) {
          this.books[bookIndex].review = updateData.review
          this.books[bookIndex].rating = updateData.rating
          this.books[bookIndex].updatedAt = new Date().toISOString()
        }

        await this.loadLibrary()

      } catch (error: any) {
        throw new Error(error.data?.error || 'Error al actualizar el libro')
      }
    },

    async deleteBook(bookId: string) {
      try {
        const config = useRuntimeConfig()
        const authStore = useAuthStore()

        await $fetch(`${config.public.apiBase}/books/my-library/${bookId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        })

        this.books = this.books.filter(book => book._id !== bookId)
        this.total = this.books.length

        await this.loadLibrary()

      } catch (error: any) {
        throw new Error(error.data?.error || 'Error al eliminar el libro')
      }
    },

    clearLibrary() {
      this.books = []
      this.error = null
      this.stats = null
      this.total = 0
    }
  }
})