/**
 * Tipos base compartidos para todas las entidades de jerarquía
 */

/**
 * Base para todas las entidades del sistema
 */
export interface BaseEntity {
  id: string;
  titulo: string;
  descripcion: string | null;
  isDone: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO base para crear entidades
 */
export interface BaseCreateDTO {
  titulo: string;
  descripcion?: string;
}

/**
 * DTO base para actualizar entidades
 */
export interface BaseUpdateDTO {
  id: string;
  titulo?: string;
  descripcion?: string;
  isDone?: boolean;
}
