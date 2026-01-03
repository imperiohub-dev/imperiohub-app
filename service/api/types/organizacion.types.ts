/**
 * Types para Organizaciones
 * Basado en el modelo Organizacion de Prisma
 */

import type { VisionHierarchy } from "./vision.types";
import type { PaginationMeta } from "./common.types";

/**
 * Base para Organizacion (sin nombre, usa titulo de BaseEntity)
 */
export interface BaseOrganizacion {
  id: string;
  nombre: string;
  descripcion: string | null;
  usuarioId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Organizacion con propiedades compatibles con BaseEntity
 * Mapeamos 'nombre' a 'titulo' para mantener consistencia con el resto de la jerarquía
 */
export interface Organizacion {
  id: string;
  titulo: string; // Mapeado desde 'nombre' del backend
  descripcion: string | null;
  usuarioId: string;
  createdAt: string;
  updatedAt: string;
  isDone: boolean; // Siempre false para organizaciones, pero mantenemos consistencia
  // Propiedad interna para tracking
  _originalNombre?: string;
}

export interface CreateOrganizacionDTO {
  nombre: string;
  descripcion?: string;
}

export interface UpdateOrganizacionDTO {
  id: string;
  nombre?: string;
  descripcion?: string;
}

// ============================================
// Tipos de Jerarquía Completa (desde el backend)
// ============================================

/**
 * Jerarquía completa: Organizacion con toda su descendencia
 */
export interface OrganizacionHierarchy extends Organizacion {
  visiones: VisionHierarchy[];
}

// Respuesta de jerarquía con paginación
// Esta es la jerarquía completa del sistema: Organizacion → Vision → Meta → Objetivo → Mision → Tarea
export interface FindHierarchyResponse {
  organizaciones: OrganizacionHierarchy[];
  pagination: PaginationMeta;
}
