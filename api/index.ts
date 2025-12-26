import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

// ============================================
// CONFIGURACIÓN DE LA API
// ============================================

/**
 * En React Native/Expo, las variables de entorno se manejan diferente que en web:
 *
 * ❌ NO funciona: process.env.API_URL (esto es undefined en React Native)
 * ✅ SÍ funciona: Constants.expoConfig?.extra?.apiUrl
 *
 * Las variables se definen en app.config.js y se acceden con expo-constants
 */

// Obtener la URL de la API desde la configuración de Expo
const API_URL = Constants.expoConfig?.extra?.apiUrl || "http://localhost:3000/api";

// Log útil para debugging (puedes verlo en la consola de Expo)
console.log("🌐 API_URL configurada:", API_URL);

const getBaseURL = () => {
  // En React Native siempre necesitamos la URL completa (no hay proxy como en web)
  return API_URL;
};

// ============================================
// INSTANCIA DE AXIOS
// ============================================

export const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true, // IMPORTANTE: permite enviar/recibir cookies automáticamente
  timeout: 10000, // 10 segundos - evita carga indefinida si el backend está caído
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ INTERCEPTOR PARA ENVIAR EL TOKEN EN CADA REQUEST
axiosInstance.interceptors.request.use(
  async (config) => {
    // Obtener el token guardado en SecureStore
    const token = await SecureStore.getItemAsync('auth_token');

    if (token) {
      // Agregar el token al header Authorization
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔑 Token agregado al header Authorization");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Si el token es inválido o expirado (401), eliminarlo
    if (error.response?.status === 401) {
      console.log("🗑️ Error 401: Token inválido o expirado, eliminando...");
      await SecureStore.deleteItemAsync('auth_token');
    }
    return Promise.reject(error);
  }
);

// ============================================
// TIPOS DE AUTH
// ============================================

export interface UserToken {
  id: string;
  email: string;
  nombre: string;
}

export interface AuthResponse {
  success: boolean;
  authenticated?: boolean;
  message?: string;
  user?: UserToken;
  token?: string; // JWT token from backend
}

// ============================================
// SERVICIO DE API CENTRALIZADO
// ============================================

export const api = {
  // ==========================================
  // AUTENTICACIÓN
  // ==========================================
  auth: {
    /**
     * Validar el idToken de Google con el backend
     *
     * El backend debe:
     * 1. Validar el idToken con las APIs de Google
     * 2. Crear/actualizar el usuario en la base de datos
     * 3. Retornar un JWT propio
     *
     * @param idToken - Token de ID de Google obtenido desde GoogleSignin.signIn()
     * @returns AuthResponse con el JWT del backend
     */
    async validateGoogleToken(idToken: string): Promise<AuthResponse> {
      console.log("📤 Validando idToken con el backend...");

      try {
        const { data } = await axiosInstance.post("/auth/google/validate", {
          idToken,
        });

        console.log("✅ Backend validó el token correctamente");
        return {
          success: true,
          authenticated: true,
          token: data.token, // JWT del backend
          user: data.user,
        };
      } catch (error: any) {
        console.error("❌ Error validando token con backend:", error);
        return {
          success: false,
          authenticated: false,
          message: error.response?.data?.message || "Error al validar con el servidor",
        };
      }
    },

    /**
     * Verificar si el usuario está autenticado
     * El token JWT se envía automáticamente en el header Authorization
     * gracias al interceptor de axios
     */
    async checkAuth(): Promise<AuthResponse> {
      console.log("Verificando autenticación...");

      try {
        const { data } = await axiosInstance.get("/auth/me");
        return {
          success: true,
          authenticated: true,
          user: data,
        };
      } catch (error) {
        console.error("Error checking auth:", error);
        return { success: false, authenticated: false };
      }
    },

    /**
     * Logout - Notificar al backend para invalidar el token (opcional)
     */
    async logout(): Promise<void> {
      await axiosInstance.post("/auth/logout");
    },
  },

  // ==========================================
  // USUARIOS
  // ==========================================
  users: {
    /**
     * Obtener todos los usuarios
     */
    async getAll() {
      const { data } = await axiosInstance.get("/users");
      return data;
    },

    /**
     * Obtener un usuario por ID
     */
    async getById(id: string) {
      const { data } = await axiosInstance.get(`/users/${id}`);
      return data;
    },

    /**
     * Crear o actualizar un usuario (upsert)
     */
    async upsert(userData: any) {
      const { data } = await axiosInstance.post("/users", userData);
      return data;
    },

    /**
     * Eliminar un usuario
     */
    async delete(id: string) {
      const { data } = await axiosInstance.delete(`/users/${id}`);
      return data;
    },
  },

  // ==========================================
  // VISIONES
  // ==========================================
  visiones: {
    /**
     * Obtener todas las visiones del usuario autenticado
     */
    async getAll() {
      const { data } = await axiosInstance.get("/visiones");
      return data;
    },

    /**
     * Obtener una visión por ID
     */
    async getById(id: string) {
      const { data } = await axiosInstance.get(`/visiones/${id}`);
      return data;
    },

    /**
     * Crear o actualizar una visión (upsert)
     */
    async upsert(visionData: any) {
      const { data } = await axiosInstance.post("/visiones", visionData);
      return data;
    },

    /**
     * Eliminar una visión
     */
    async delete(id: string) {
      const { data } = await axiosInstance.delete(`/visiones/${id}`);
      return data;
    },
  },

  // ==========================================
  // METAS
  // ==========================================
  metas: {
    /**
     * Obtener todas las metas de una visión específica
     */
    async getByVisionId(visionId: string) {
      const { data } = await axiosInstance.get(`/metas?visionId=${visionId}`);
      return data;
    },

    /**
     * Obtener una meta por ID
     */
    async getById(id: string) {
      const { data } = await axiosInstance.get(`/metas/${id}`);
      return data;
    },

    /**
     * Crear o actualizar una meta (upsert)
     */
    async upsert(metaData: any) {
      const { data } = await axiosInstance.post("/metas", metaData);
      return data;
    },

    /**
     * Eliminar una meta
     */
    async delete(id: string) {
      const { data } = await axiosInstance.delete(`/metas/${id}`);
      return data;
    },
  },

  // ==========================================
  // OBJETIVOS
  // ==========================================
  objetivos: {
    /**
     * Obtener todos los objetivos de una meta específica
     */
    async getByMetaId(metaId: string) {
      const { data } = await axiosInstance.get(
        `/objetivos?metaId=${metaId}`
      );
      return data;
    },

    /**
     * Obtener un objetivo por ID
     */
    async getById(id: string) {
      const { data } = await axiosInstance.get(`/objetivos/${id}`);
      return data;
    },

    /**
     * Crear o actualizar un objetivo (upsert)
     */
    async upsert(objetivoData: any) {
      const { data } = await axiosInstance.post("/objetivos", objetivoData);
      return data;
    },

    /**
     * Eliminar un objetivo
     */
    async delete(id: string) {
      const { data } = await axiosInstance.delete(`/objetivos/${id}`);
      return data;
    },
  },

  // ==========================================
  // MISIONES
  // ==========================================
  misiones: {
    /**
     * Obtener todas las misiones de un objetivo específico
     */
    async getByObjetivoId(objetivoId: string) {
      const { data } = await axiosInstance.get(
        `/misiones?objetivoId=${objetivoId}`
      );
      return data;
    },

    /**
     * Obtener una misión por ID
     */
    async getById(id: string) {
      const { data } = await axiosInstance.get(`/misiones/${id}`);
      return data;
    },

    /**
     * Crear o actualizar una misión (upsert)
     */
    async upsert(misionData: any) {
      const { data } = await axiosInstance.post("/misiones", misionData);
      return data;
    },

    /**
     * Eliminar una misión
     */
    async delete(id: string) {
      const { data } = await axiosInstance.delete(`/misiones/${id}`);
      return data;
    },
  },

  // ==========================================
  // TAREAS
  // ==========================================
  tareas: {
    /**
     * Obtener todas las tareas de una misión específica
     */
    async getByMisionId(misionId: string) {
      const { data } = await axiosInstance.get(
        `/tareas?misionId=${misionId}`
      );
      return data;
    },

    /**
     * Obtener una tarea por ID
     */
    async getById(id: string) {
      const { data } = await axiosInstance.get(`/tareas/${id}`);
      return data;
    },

    /**
     * Crear o actualizar una tarea (upsert)
     */
    async upsert(tareaData: any) {
      const { data } = await axiosInstance.post("/tareas", tareaData);
      return data;
    },

    /**
     * Eliminar una tarea
     */
    async delete(id: string) {
      const { data } = await axiosInstance.delete(`/tareas/${id}`);
      return data;
    },
  },

  // ==========================================
  // MÉTODOS GENÉRICOS (para casos especiales)
  // ==========================================
  generic: {
    /**
     * Llamada GET genérica
     */
    async get<T>(endpoint: string): Promise<T> {
      const { data } = await axiosInstance.get<T>(endpoint);
      return data;
    },

    /**
     * Llamada POST genérica
     */
    async post<T>(endpoint: string, body: unknown): Promise<T> {
      const { data } = await axiosInstance.post<T>(endpoint, body);
      return data;
    },

    /**
     * Llamada PUT genérica
     */
    async put<T>(endpoint: string, body: unknown): Promise<T> {
      const { data } = await axiosInstance.put<T>(endpoint, body);
      return data;
    },

    /**
     * Llamada DELETE genérica
     */
    async delete<T>(endpoint: string): Promise<T> {
      const { data } = await axiosInstance.delete<T>(endpoint);
      return data;
    },
  },
};
