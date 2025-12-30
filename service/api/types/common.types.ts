/**
 * Types comunes para respuestas de la API
 */

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiListResponse<T> {
  data: T[];
  total: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}
