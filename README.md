# 📱 App Pokemon

Aplicación web fullstack para explorar Pokémon consumiendo la PokéAPI, implementada con NestJS + React, con soporte para búsqueda, filtros por tipo, paginación, uso de caché, y despliegue vía Docker + CI/CD con GitHub Actions.

---

## 🛠️ Tecnologías Usadas

### Backend

- NestJS (v11)  
- Axios para llamadas HTTP  
- Redis para caching  
- Docker  
- GitHub Actions para CI/CD  

### Frontend

- React (Vite + TypeScript)  
- React Router  
- React Query para gestión de datos  
- Material UI (MUI) para diseño de interfaz  

---

## 📋 Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

- [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/)

---

## 🚀 Instrucciones de instalación

### 1. Clona el repositorio

```bash
git clone https://github.com/codezue/prueba.git
cd prueba
```

### 2. Configura las variables de entorno

#### 🔧 Backend (`backend/.env`)

Copia el archivo `.env.example` a `.env`:

- En **Linux/macOS**:

  ```bash
  cp backend/.env.example backend/.env
  ```

- En **Windows (PowerShell)**:

  ```powershell
  Copy-Item backend\.env.example backend\.env
  ```

#### 🔧 Frontend (`frontend/.env`)

Copia el archivo `.env.example` a `.env`:

- En **Linux/macOS**:

  ```bash
  cp frontend/.env.example frontend/.env
  ```

- En **Windows (PowerShell)**:

  ```powershell
  Copy-Item frontend\.env.example frontend\.env
  ```

> Luego, abre los archivos `.env` creados y completa las variables necesarias con tus propios valores.

---

### 3. Levanta el entorno con Docker

```bash
docker-compose up --build -d
```

Esto iniciará:

- Backend en [http://localhost:3001](http://localhost:3001)  
- Frontend en [http://localhost](http://localhost)  
- Redis como servicio para caché  

---

## 🧠 Decisiones técnicas clave

- Se utiliza Redis Cache para evitar múltiples llamadas innecesarias a la PokéAPI.  
- Se separa la lógica de negocio en servicios reutilizables tanto en el backend como en el frontend (hooks).  
- El frontend permite filtrar por nombre y tipo de Pokémon, con búsqueda debounced y validación mínima de 3 caracteres.  
- Se implementa paginación, manejo de errores y modal de detalle sin redirección.  
- CI/CD automatizado mediante GitHub Actions, que ejecuta build, test y deploy.  

---

## 🧹 Comandos útiles

### Detener los contenedores

```bash
docker-compose down
```

### Ver logs

```bash
docker-compose logs -f
```

### Reconstruir sin usar caché

```bash
docker-compose build --no-cache
```
