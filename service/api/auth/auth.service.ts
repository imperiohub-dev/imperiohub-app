/**
 * Auth Service
 *
 * Servicio centralizado para todas las operaciones de autenticación:
 * - Login con Google
 * - Logout
 * - Obtener usuario actual
 * - Verificar si está autenticado
 */

import type { User as UserInfoGoogle } from "@react-native-google-signin/google-signin";
import { api, getErrorMessage } from "../config/axios.config";
import { AUTH_ENDPOINTS } from "../config/api.constants";
import { tokenStorage } from "../storage/token.storage";
import type {
  GoogleAuthRequest,
  AuthResponse,
  MeResponse,
  LogoutResponse,
  User,
} from "./auth.types";

class AuthService {
  /**
   * Login con Google
   *
   * @param UserInfoGoogle - Usuario retornado por Google Sign-In
   * @param idToken - Token de Google para validación en backend
   * @returns Usuario y token del backend
   */
  async loginWithGoogle(
    userInfoGoogle: UserInfoGoogle
  ): Promise<{ user: User; token: string }> {
    try {
      // Preparar request para el backend
      const requestData: UserInfoGoogle = userInfoGoogle;

      // Enviar a backend
      const response = await api.post<AuthResponse>(
        AUTH_ENDPOINTS.GOOGLE_AUTH,
        requestData
      );

      const { token, user } = response.data;

      // Guardar token y datos del usuario
      await this.saveAuthData(token, user);

      return { user, token };
    } catch (error) {
      const message = getErrorMessage(error);
      console.error("Error en loginWithGoogle:", message);
      throw new Error(`Failed to authenticate with Google: ${message}`);
    }
  }

  /**
   * Obtener usuario actual desde el backend
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get<MeResponse>(AUTH_ENDPOINTS.ME);

      if (response.data.authenticated && response.data.user) {
        // Actualizar datos del usuario en storage
        await tokenStorage.saveUserData(response.data.user);
        return response.data.user;
      }

      return null;
    } catch (error) {
      console.error("Error obteniendo usuario actual:", getErrorMessage(error));
      return null;
    }
  }

  /**
   * Cerrar sesión
   */
  async logout(): Promise<void> {
    try {
      // Llamar al endpoint de logout (limpia cookies en web)
      await api.post<LogoutResponse>(AUTH_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error("Error en logout:", getErrorMessage(error));
      // Continuar con limpieza local aunque falle el backend
    } finally {
      // Limpiar storage local
      await this.clearAuthData();
    }
  }

  /**
   * Verificar si el usuario está autenticado
   * Intenta obtener el usuario actual del backend
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return user !== null;
    } catch {
      return false;
    }
  }

  /**
   * Obtener token guardado localmente
   */
  async getStoredToken(): Promise<string | null> {
    return await tokenStorage.getToken();
  }

  /**
   * Obtener datos del usuario guardados localmente
   */
  async getStoredUser(): Promise<User | null> {
    return await tokenStorage.getUserData<User>();
  }

  // ============================================
  // Métodos privados para manejo de storage
  // ============================================

  /**
   * Guarda token y datos de usuario en storage
   */
  private async saveAuthData(token: string, user: User): Promise<void> {
    await tokenStorage.saveToken(token);
    await tokenStorage.saveUserData(user);
  }

  /**
   * Limpia todos los datos de autenticación del storage
   */
  private async clearAuthData(): Promise<void> {
    await tokenStorage.clear();
  }
}

// Exportar instancia singleton
export const authService = new AuthService();
