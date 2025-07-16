import axios from 'axios';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 50000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isSearchNotFound = error.config?.url?.includes('/pokemon/search') && error.response?.status === 404;

    if (isSearchNotFound) {
      return Promise.resolve({
        data: {
          data: [],
          total: 0,
          limit: error.config?.params?.limit || 20,
          offset: error.config?.params?.offset || 0,
        },
      });
    }

    let errorMessage = 'Ocurrió un error inesperado';
    
    if (error.response) {
      errorMessage = error.response.data?.message ||
                     error.response.statusText ||
                     `Server responde con status ${error.response.status}`;
    } else if (error.request) {
      errorMessage = 'No hubo respuesta del servidor.';
    } else {
      errorMessage = error.message;
    }

    const enhancedError = new Error(errorMessage);
    enhancedError.name = error.name || 'APIError';
    enhancedError.stack = error.stack;
    
    return Promise.reject(enhancedError);
  }
);