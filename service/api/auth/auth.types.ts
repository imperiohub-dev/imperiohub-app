/**
 * Auth Types
 *
 * Tipos e interfaces para autenticación
 */

/**
 * Usuario retornado por el backend
 */
export interface User {
  id: string;
  email: string;
  nombre: string;
  picture: string; // TODO: Backend debe agregar este campo
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Payload del JWT (lo que viene en el token decodificado)
 */
export interface JWTPayload {
  id: string;
  email: string;
  nombre: string;
  iat: number;
  exp: number;
}

/**
 * Request para login con Google
 */
export interface GoogleAuthRequest {
  idToken: string;
  user: {
    email: string;
    name: string;
    picture: string;
  };
}

/**
 * Response del backend después de login exitoso
 */
export interface AuthResponse {
  token: string;
  user: User;
}

/**
 * Response de /api/auth/me
 */
export interface MeResponse {
  success: boolean;
  authenticated: boolean;
  user: User;
}

/**
 * Response de /api/auth/logout
 */
export interface LogoutResponse {
  success: boolean;
}

/**
 * Errores de autenticación
 */
export interface AuthError {
  error: string;
  message?: string;
  statusCode?: number;
}

/**
 * Estado de autenticación
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
}
