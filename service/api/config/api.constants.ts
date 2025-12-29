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
    if (Platform.OS === "android" && process.env.EXPO_PUBLIC_API_URL.includes("localhost")) {
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
console.log(`[API Config] Platform: ${Platform.OS}, Base URL: ${API_BASE_URL}`);

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
