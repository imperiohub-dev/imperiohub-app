/**
 * Axios Configuration
 *
 * Configuración de axios con interceptors para manejo automático de:
 * - Headers de autenticación (Bearer token para mobile)
 * - Cookies (automático para web)
 * - Errores de autenticación
 */

import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { Platform } from "react-native";
import { tokenStorage } from "../storage/token.storage";
import { API_BASE_URL, API_TIMEOUT, COMMON_HEADERS } from "./api.constants";

/**
 * Instancia de axios configurada
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: COMMON_HEADERS,
  // Web: permitir cookies (importante para httpOnly cookies)
  withCredentials: Platform.OS === "web",
});

/**
 * Request Interceptor
 * Agrega automáticamente el token de autenticación en mobile
 */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Mobile: Agregar token en Authorization header
    if (Platform.OS === "ios" || Platform.OS === "android") {
      const token = await tokenStorage.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Web: Las cookies se envían automáticamente por withCredentials: true
    // No necesitamos hacer nada adicional

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Maneja errores de autenticación globalmente
 */
api.interceptors.response.use(
  (response) => {
    // Response exitosa, retornar data directamente
    return response;
  },
  async (error: AxiosError) => {
    // Manejar errores de autenticación
    switch (error.response?.status) {
      case 400:
        console.error("Bad Request - 400", {
          url: error.config?.url,
          method: error.config?.method?.toUpperCase(),
          data: error.config?.data,
          response: error.response?.data,
        });
        break;
      case 401:
        // Token inválido o expirado
        console.log("Token inválido o expirado, limpiando storage...");

        // Limpiar storage
        await tokenStorage.clear();

        // TODO: Aquí podrías emitir un evento o usar un estado global
        // para redirigir al usuario al login
        // Ejemplo: EventEmitter.emit('auth:logout');
        break;
    }

    return Promise.reject(error);
  }
);

/**
 * Helper para extraer mensaje de error
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as any;
    return data?.error || data?.message || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
}
