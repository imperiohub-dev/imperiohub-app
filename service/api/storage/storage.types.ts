/**
 * Storage Types
 *
 * Tipos para la abstracción de almacenamiento multiplataforma
 */

export enum StorageKey {
  AUTH_TOKEN = "auth_token",
  USER_DATA = "user_data",
}

export interface StorageService {
  saveItem(key: string, value: string): Promise<void>;
  getItem(key: string): Promise<string | null>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}
