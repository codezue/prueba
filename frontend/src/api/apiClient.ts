import axios from 'axios';

// If using Vite, use import.meta.env; otherwise, declare process for TypeScript
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 50000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'An unexpected error occurred';
    
    if (error.response) {
      // Error de servidor (4xx, 5xx)
      errorMessage = error.response.data?.message || 
                    error.response.statusText || 
                    `Server responded with status ${error.response.status}`;
    } else if (error.request) {
      // La solicitud fue hecha pero no hubo respuesta
      errorMessage = 'No response received from server';
    } else {
      // Error al configurar la solicitud
      errorMessage = error.message;
    }

    const enhancedError = new Error(errorMessage);
    enhancedError.name = error.name || 'APIError';
    enhancedError.stack = error.stack;
    
    return Promise.reject(enhancedError);
  },
);