# 📚 Book Reviews App

## Descripción 📋
Aplicación web completa para la gestión de reseñas de libros personalizadas. Permite buscar libros en tiempo real, crear reseñas con calificaciones, gestionar biblioteca personal y autenticación de usuarios con una interfaz moderna y responsiva.

## Creación de usuario.
Para la creación de usuarios y contraseñas se debe tener en cuenta lo siguiente:
- La contraseña debe incluir al menos una letra mayúscula, un carácter especial y un número.
- Debe tener un largo mínimo de 6 caracteres.
Ejemplo:
--Correo electrónico: user@example.com
- Contraseña: MyPass123!

## Pre-requisitos ⚙️
Antes de comenzar, asegúrate de tener instalado lo siguiente:
- [Node.js](https://nodejs.org/) versión 18 o superior
- [Nuxt 3](https://nuxt.com/)

Además, debes configurar las siguientes variables de entorno:
- `NUXT_PUBLIC_API_BASE`: URL base de la API que consume esta aplicación.

## Comenzando 🚀
Para iniciar el proyecto localmente:

1. Clona este repositorio.
2. Ingresa al directorio del proyecto.
3. Crear el archivo .env y configurar la variable de entorno:
```
NUXT_PUBLIC_API_BASE=http://localhost:3001/api
```
4. Ejecuta los siguientes comandos:
```
npm install
npm run dev
```
> **Nota:** Antes de iniciar el frontend, asegúrate de clonar y levantar el servidor de la API backend. Puedes encontrarlo en la sección de dependencias del proyecto.

## Dependencias del Proyecto 🔗
- [Backend - Book Reviews API](https://github.com/evertofd/book_reviews_api)

## Despliegue en Producción 📦
Para generar los archivos listos para producción, ejecuta:
```
npm run build
npm run preview
```

Esto creará la carpeta `.output/`, que contiene los archivos optimizados listos para ser servidos en un entorno de producción.

## Tecnologías Utilizadas 🛠️
- [Nuxt 3](https://nuxt.com/) - Framework Vue.js full-stack
- [Vue 3](https://vuejs.org/) - Framework JavaScript progresivo
- [Pinia](https://pinia.vuejs.org/) - Store management para Vue
- [TypeScript](https://www.typescriptlang.org/) - Tipado estático
- [SCSS](https://sass-lang.com/) - Preprocesador CSS

## Características Principales ✨
- 🔐 **Sistema de autenticación completo** con registro y login
- 🔍 **Búsqueda en tiempo real** de libros usando OpenLibrary API
- 📚 **Biblioteca personal** con gestión de reseñas y calificaciones
- ⭐ **Sistema de calificación** de 1 a 5 estrellas
- 📝 **Reseñas de hasta 500 caracteres**
- 🔄 **Historial de búsquedas** (últimas 5 búsquedas)
- 📊 **Filtros avanzados** por título, autor, calificación
- 🎨 **Interfaz moderna y responsiva** con SCSS personalizado
- 🔒 **Protección de rutas** con middleware de autenticación
- 📱 **Diseño mobile-first** y totalmente responsivo

## Funcionalidades Destacadas 🎯
- **SPA (Single Page Application)** con navegación fluida
- **Estados de carga** y manejo de errores robusto
- **Persistencia de sesión** con cookies seguras
- **Modales interactivos** para edición y eliminación
- **Validación de formularios** en tiempo real
- **Gestión de estado global** con Pinia
- **Componentes reutilizables** y modulares

## Despliegue 🌐
🔗 [Book Reviews App](https://book-reviews-frontend-d15k.onrender.com/)

### Backend y Documentación:
🔗 [API Backend](https://book-reviews-backend-3b7d.onrender.com/api)

🔗 [Documentación API (Swagger)](https://book-reviews-backend-3b7d.onrender.com/api-docs)

## Autores ✒️
- **Everto Farías** ❤️

---

*Desarrollado con 💚 usando Nuxt 3 y Vue.js*
