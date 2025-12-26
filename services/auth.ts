/**
 * Servicio de Autenticación con Google Sign-In
 *
 * Este módulo maneja todo el flujo de autenticación con Google usando
 * @react-native-google-signin/google-signin
 *
 * 📚 FLUJO DE AUTENTICACIÓN:
 *
 * 1. Usuario presiona "Iniciar sesión con Google"
 * 2. GoogleSignin.signIn() abre el flujo nativo de Google
 * 3. Usuario autoriza en Google (interfaz nativa de Google)
 * 4. Recibimos el idToken de Google
 * 5. Enviamos el idToken a nuestro backend
 * 6. Backend valida el idToken con las APIs de Google
 * 7. Backend crea/actualiza el usuario en la base de datos
 * 8. Backend retorna un JWT propio
 * 9. Guardamos el JWT en SecureStore
 *
 * ✅ VENTAJAS SOBRE expo-web-browser:
 * - Funciona PERFECTO en Android (sin problemas de cookies)
 * - Usa el flujo nativo de Google (mejor UX)
 * - Integración automática con Google Play Services
 * - Soporte nativo para iOS y Android
 */

import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";
import { api } from "../api";

/**
 * Configurar Google Sign-In
 *
 * Esto debe llamarse AL INICIO de la app (en _layout.tsx)
 * antes de intentar hacer login
 */
export const configureGoogleSignIn = () => {
  const webClientId =
    Constants.expoConfig?.extra?.googleWebClientId || "";

  if (!webClientId) {
    console.error(
      "❌ GOOGLE_WEB_CLIENT_ID no configurado en las variables de entorno"
    );
    return;
  }

  GoogleSignin.configure({
    webClientId, // Web Client ID de Google Cloud Console
    offlineAccess: false, // No necesitamos refresh token
    forceCodeForRefreshToken: false,
  });

  console.log("✅ Google Sign-In configurado correctamente");
};

/**
 * Inicia el flujo de autenticación con Google
 *
 * Este método:
 * 1. Abre el flujo nativo de Google Sign-In
 * 2. Obtiene el idToken del usuario
 * 3. Envía el idToken al backend para validación
 * 4. Guarda el JWT del backend en SecureStore
 *
 * @returns Resultado de la autenticación
 */
export const loginWithGoogle = async (): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    console.log("🚀 Iniciando login con Google...");

    // 1. Verificar que Google Play Services esté disponible (solo Android)
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });
    console.log("✅ Google Play Services disponible");

    // 2. Iniciar el flujo de sign-in
    console.log("📱 Abriendo Google Sign-In nativo...");
    const userInfo = await GoogleSignin.signIn();

    // 3. Verificar que tengamos el idToken
    if (!userInfo.data?.idToken) {
      console.error("❌ No se recibió idToken de Google");
      return {
        success: false,
        error: "No se recibió el token de autenticación de Google",
      };
    }

    const idToken = userInfo.data.idToken;
    console.log("✅ idToken recibido de Google:", idToken.substring(0, 20) + "...");
    console.log("👤 Usuario de Google:", userInfo.data.user);

    // 4. Enviar el idToken al backend para validación
    console.log("📤 Enviando idToken al backend...");
    const authResult = await api.auth.validateGoogleToken(idToken);

    if (!authResult.success || !authResult.token) {
      console.error("❌ Backend rechazó el token:", authResult.message);
      return {
        success: false,
        error: authResult.message || "Error al validar con el servidor",
      };
    }

    // 5. Guardar el JWT del backend en SecureStore
    await SecureStore.setItemAsync("auth_token", authResult.token);
    console.log("💾 Token guardado en SecureStore");
    console.log("✅ Login exitoso!");

    return { success: true };
  } catch (error: any) {
    console.error("❌ Error en loginWithGoogle:", error);

    // Errores específicos de Google Sign-In
    if (error.code === "SIGN_IN_CANCELLED") {
      console.log("⚠️ Usuario canceló el login");
      return { success: false, error: "Login cancelado" };
    }

    if (error.code === "IN_PROGRESS") {
      console.log("⚠️ Ya hay un login en progreso");
      return { success: false, error: "Ya hay un login en progreso" };
    }

    if (error.code === "PLAY_SERVICES_NOT_AVAILABLE") {
      console.error("❌ Google Play Services no disponible");
      return {
        success: false,
        error: "Google Play Services no disponible. Por favor actualízalo.",
      };
    }

    return {
      success: false,
      error: error.message || "Error desconocido al iniciar sesión",
    };
  }
};

/**
 * Cierra la sesión del usuario
 */
export const logout = async (): Promise<void> => {
  try {
    console.log("👋 Cerrando sesión...");

    // 1. Cerrar sesión en Google Sign-In
    try {
      await GoogleSignin.signOut();
      console.log("✅ Sesión de Google cerrada");
    } catch {
      // Es posible que no haya una sesión activa, no es crítico
      console.log("⚠️ No había sesión de Google activa para cerrar");
    }

    // 2. Eliminar el token del SecureStore
    await SecureStore.deleteItemAsync("auth_token");
    console.log("🗑️ Token eliminado del SecureStore");

    // 3. Llamar al backend para invalidar la sesión (si aplica)
    try {
      await api.auth.logout();
      console.log("✅ Backend notificado del logout");
    } catch (err) {
      // No es crítico si falla, el token local ya fue eliminado
      console.warn("⚠️ Error al notificar logout al backend:", err);
    }

    console.log("✅ Sesión cerrada completamente");
  } catch (error) {
    console.error("❌ Error al cerrar sesión:", error);
    throw error;
  }
};

/**
 * Verifica si el usuario está autenticado
 */
export const checkAuth = async (): Promise<{
  authenticated: boolean;
  user?: any;
}> => {
  try {
    // Verificar si hay un token guardado localmente
    const token = await SecureStore.getItemAsync("auth_token");

    if (!token) {
      console.log("❌ No hay token guardado");
      return { authenticated: false };
    }

    console.log("✅ Token encontrado localmente");

    // Verificar con el backend que el token es válido
    const result = await api.auth.checkAuth();
    return {
      authenticated: result.authenticated || false,
      user: result.user,
    };
  } catch (error) {
    console.error("❌ Error verificando auth:", error);
    // Si el token es inválido, eliminarlo
    await SecureStore.deleteItemAsync("auth_token");
    return { authenticated: false };
  }
};
