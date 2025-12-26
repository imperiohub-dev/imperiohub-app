/**
 * Hook personalizado para autenticación
 *
 * 📚 ¿QUÉ ES UN HOOK?
 *
 * Un hook es una función especial de React que te permite "enganchar"
 * funcionalidades de React (como estado, efectos, etc.) en componentes funcionales.
 *
 * Los hooks SIEMPRE empiezan con "use" (useAuth, useState, useEffect, etc.)
 *
 * 📚 ¿POR QUÉ CREAR UN HOOK PERSONALIZADO?
 *
 * - Reutilización: Puedes usar useAuth() en cualquier componente
 * - Separación de lógica: La lógica de auth está separada de la UI
 * - Mantenibilidad: Si cambias la lógica de auth, solo cambias el hook
 *
 * 📚 HOOKS QUE USAMOS AQUÍ:
 *
 * - useState: Para manejar el estado (usuario, loading, etc.)
 * - useEffect: Para ejecutar código cuando el componente se monta
 *              (similar a componentDidMount en class components)
 */

import { useState, useEffect } from "react";
import { checkAuth, loginWithGoogle, logout } from "../services/auth";

/**
 * Tipo de datos que retorna el usuario
 */
interface User {
  id: string;
  email: string;
  nombre: string;
}

/**
 * Hook para manejar autenticación
 *
 * USO:
 * ```tsx
 * const { user, isLoading, login, logout } = useAuth();
 *
 * if (isLoading) return <Text>Cargando...</Text>;
 * if (!user) return <LoginButton />;
 * return <Text>Hola {user.nombre}</Text>;
 * ```
 */
export const useAuth = () => {
  // Estado: Usuario actual (null si no está autenticado)
  const [user, setUser] = useState<User | null>(null);

  // Estado: ¿Está cargando?
  const [isLoading, setIsLoading] = useState(true);

  // Estado: ¿Hubo un error?
  const [error, setError] = useState<string | null>(null);

  /**
   * useEffect se ejecuta cuando el componente se monta
   *
   * El array vacío [] al final significa: "ejecutar solo una vez al montar"
   * Si pusiera [user], se ejecutaría cada vez que user cambie
   */
  useEffect(() => {
    // Verificar si el usuario está autenticado al cargar la app
    checkAuthStatus();
  }, []);

  /**
   * Verifica el estado de autenticación
   */
  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await checkAuth();

      if (result.authenticated && result.user) {
        setUser(result.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Error verificando auth:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Inicia sesión con Google
   */
  const login = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await loginWithGoogle();

      if (result.success) {
        // Recargar el estado de autenticación
        await checkAuthStatus();
        return { success: true };
      } else {
        setError(result.error || "Error al iniciar sesión");
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Cierra la sesión
   */
  const handleLogout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      await logout();
      setUser(null);
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * El hook retorna un objeto con todo lo que necesitas
   */
  return {
    // Datos
    user,              // Usuario actual (o null)
    isLoading,         // ¿Está cargando?
    error,             // Error (si hay)
    isAuthenticated: !!user, // Boolean: ¿está autenticado?

    // Acciones
    login,             // Función para hacer login
    logout: handleLogout, // Función para hacer logout
    refresh: checkAuthStatus, // Función para refrescar el estado
  };
};
