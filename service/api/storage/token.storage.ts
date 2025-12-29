/**
 * Token Storage - Abstracción multiplataforma
 *
 * Maneja el almacenamiento seguro de tokens en:
 * - iOS/Android: expo-secure-store (almacenamiento encriptado)
 * - Web: localStorage (temporal, las cookies httpOnly manejan el auth real)
 */

import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { StorageKey, type StorageService } from "./storage.types";

class TokenStorage implements StorageService {
  /**
   * Determina si estamos en una plataforma nativa (iOS/Android)
   */
  private get isNative(): boolean {
    return Platform.OS === "ios" || Platform.OS === "android";
  }

  /**
   * Guarda un item en el storage
   * - Mobile: SecureStore (encriptado)
   * - Web: localStorage
   */
  async saveItem(key: string, value: string): Promise<void> {
    try {
      if (this.isNative) {
        await SecureStore.setItemAsync(key, value);
      } else {
        // Web: usar localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem(key, value);
        }
      }
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      throw error;
    }
  }

  /**
   * Obtiene un item del storage
   */
  async getItem(key: string): Promise<string | null> {
    try {
      if (this.isNative) {
        return await SecureStore.getItemAsync(key);
      } else {
        // Web: usar localStorage
        if (typeof window !== "undefined") {
          return localStorage.getItem(key);
        }
        return null;
      }
    } catch (error) {
      console.error(`Error getting ${key}:`, error);
      return null;
    }
  }

  /**
   * Elimina un item del storage
   */
  async removeItem(key: string): Promise<void> {
    try {
      if (this.isNative) {
        await SecureStore.deleteItemAsync(key);
      } else {
        // Web: usar localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      throw error;
    }
  }

  /**
   * Limpia todo el storage relacionado con auth
   */
  async clear(): Promise<void> {
    await this.removeItem(StorageKey.AUTH_TOKEN);
    await this.removeItem(StorageKey.USER_DATA);
  }

  // ============================================
  // Métodos específicos para tokens y usuario
  // ============================================

  /**
   * Guarda el JWT
   * - Mobile: En SecureStore
   * - Web: En localStorage (backup, las cookies httpOnly son la fuente real)
   */
  async saveToken(token: string): Promise<void> {
    await this.saveItem(StorageKey.AUTH_TOKEN, token);
  }

  /**
   * Obtiene el JWT guardado
   */
  async getToken(): Promise<string | null> {
    return await this.getItem(StorageKey.AUTH_TOKEN);
  }

  /**
   * Elimina el JWT
   */
  async removeToken(): Promise<void> {
    await this.removeItem(StorageKey.AUTH_TOKEN);
  }

  /**
   * Guarda datos del usuario
   */
  async saveUserData(userData: object): Promise<void> {
    await this.saveItem(StorageKey.USER_DATA, JSON.stringify(userData));
  }

  /**
   * Obtiene datos del usuario
   */
  async getUserData<T = any>(): Promise<T | null> {
    const data = await this.getItem(StorageKey.USER_DATA);
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch {
      return null;
    }
  }

  /**
   * Elimina datos del usuario
   */
  async removeUserData(): Promise<void> {
    await this.removeItem(StorageKey.USER_DATA);
  }
}

// Exportar instancia singleton
export const tokenStorage = new TokenStorage();
