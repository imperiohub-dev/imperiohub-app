/**
 * API Constants
 *
 * URLs base y endpoints de la API
 */

import { Platform } from "react-native";

/**
 * Obtiene la URL base del backend según la plataforma
 * - iOS Simulator: localhost funciona directamente
 * - Android Emulator: usa 10.0.2.2 (mapea al localhost del host)
 * - Web: localhost
 * - Producción: usa EXPO_PUBLIC_API_URL del .env
 */
function getApiBaseUrl(): string {
  // Si hay URL en .env (producción), usarla
  if (process.env.EXPO_PUBLIC_API_URL) {
    // En Android, reemplazar localhost por 10.0.2.2
    if (
      Platform.OS === "android" &&
      process.env.EXPO_PUBLIC_API_URL.includes("localhost")
    ) {
      return process.env.EXPO_PUBLIC_API_URL.replace("localhost", "10.0.2.2");
    }
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // Fallback para desarrollo local
  if (Platform.OS === "android") {
    return "http://10.0.2.2:3000";
  }
  return "http://localhost:3000";
}

export const API_BASE_URL = getApiBaseUrl();

// Log para debugging
// console.log(`[API Config] Platform: ${Platform.OS}, Base URL: ${API_BASE_URL}`);

/**
 * Endpoints de autenticación
 */
export const AUTH_ENDPOINTS = {
  // Endpoint para login/registro con Google (mobile y web)
  GOOGLE_AUTH: "/api/auth/google/mobile", // TODO: Backend debe crear este endpoint
  // Endpoint para obtener el usuario actual
  ME: "/api/auth/me",
  // Endpoint para cerrar sesión
  LOGOUT: "/api/auth/logout",
} as const;

/**
 * Endpoints de Organizaciones
 */
export const ORGANIZACION_ENDPOINTS = {
  LIST: "/api/organizaciones",
  HIERARCHY: "/api/organizaciones/hierarchy",
  GET: (id: string) => `/api/organizaciones/${id}`,
  CREATE: "/api/organizaciones",
  UPDATE: "/api/organizaciones",
  DELETE: (id: string) => `/api/organizaciones/${id}`,
} as const;

/**
 * Endpoints de Visiones
 */
export const VISION_ENDPOINTS = {
  LIST: "/api/visiones",
  HIERARCHY: "/api/visiones/hierarchy",
  GET: (id: string) => `/api/visiones/${id}`,
  CREATE: "/api/visiones",
  UPDATE: "/api/visiones",
  DELETE: (id: string) => `/api/visiones/${id}`,
} as const;

/**
 * Endpoints de Metas
 */
export const META_ENDPOINTS = {
  LIST: "/api/metas",
  GET: (id: string) => `/api/metas/${id}`,
  CREATE: "/api/metas",
  UPDATE: "/api/metas",
  DELETE: (id: string) => `/api/metas/${id}`,
} as const;

/**
 * Endpoints de Objetivos
 */
export const OBJETIVO_ENDPOINTS = {
  LIST: "/api/objetivos",
  GET: (id: string) => `/api/objetivos/${id}`,
  CREATE: "/api/objetivos",
  UPDATE: "/api/objetivos",
  DELETE: (id: string) => `/api/objetivos/${id}`,
} as const;

/**
 * Endpoints de Misiones
 */
export const MISION_ENDPOINTS = {
  LIST: "/api/misiones",
  GET: (id: string) => `/api/misiones/${id}`,
  CREATE: "/api/misiones",
  UPDATE: "/api/misiones",
  DELETE: (id: string) => `/api/misiones/${id}`,
} as const;

/**
 * Endpoints de Tareas
 */
export const TAREA_ENDPOINTS = {
  LIST: "/api/tareas",
  GET: (id: string) => `/api/tareas/${id}`,
  CREATE: "/api/tareas",
  UPDATE: "/api/tareas",
  DELETE: (id: string) => `/api/tareas/${id}`,
} as const;

/**
 * Timeouts
 */
export const API_TIMEOUT = 30000; // 30 segundos

/**
 * Headers comunes
 */
export const COMMON_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
} as const;
