export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  css: ['~/assets/scss/main.scss'],
  typescript: {
    strict: false  
  },
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:3001/api'
    }
  }
})