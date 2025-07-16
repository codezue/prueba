
# 📱 App Pokemon

Aplicación web fullstack para explorar Pokémon consumiendo la PokéAPI, implementada con NestJS + React, con soporte para búsqueda, filtros por tipo, paginación, uso de caché, y despliegue vía Docker + CI/CD con GitHub Actions.


## 🛠️ Tecnologías Usadas

### Backend

    NestJS (v11)

    Axios para llamadas HTTP

    Redis para caching

    Docker

    GitHub Actions para CI/CD

### Frontend

    React (Vite + TypeScript)

    React Router

    React Query para gestión de datos

    Material UI (MUI) para diseño de interfaz

## 🚀 Instrucciones de instalación

  1. Clona el repositorio

  ```bash
    git clone https://github.com/codezue/prueba.git
    cd prueba
  ```
  2. Configura variables de entorno  
   -  Backend(backend/.env)

      Copia el archivo `.env.example` a `.env`:
      ```bash
      cp .env.example .env
      ```

  -  Frontend(frontend/.env)

      Copia el archivo `.env.example` a `.env`:
      ```bash
      cp .env.example .env
      ```

Abre el archivo `.env` recién creado y configura las variables de entorno necesarias con tus propios valores.

  3. Levanta el enterno con Docker

  ```bash
    docker-compose up --build -d
  ```
  
  Esto iniciará:

- Backend en http://localhost:3001

- Frontend en http://localhost

- Redis como servicio para caché
## 🧠 Decisiones técnicas clave

 - Se utiliza Redis Cache para evitar múltiples llamadas innecesarias a la PokéAPI.
 - Separamos lógica de negocio en servicios reutilizables tanto en backend como frontend (hooks).

 - El frontend muestra resultados con filtros por nombre y tipo de Pokémon, con búsqueda debounced y validación mínima de 3 caracteres.

 - Se maneja paginación, errores controlados y modal para detalle sin redirigir.

 - Se implementó un flujo completo de CI/CD usando GitHub Actions, que realiza build, test y deploy.