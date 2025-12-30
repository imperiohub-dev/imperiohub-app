/**
 * Types para Metas
 * Basado en el modelo Meta de Prisma
 */

export interface Meta {
  id: string;
  titulo: string;
  descripcion: string | null;
  visionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMetaDTO {
  titulo: string;
  descripcion?: string;
  visionId: string;
}

export interface UpdateMetaDTO {
  id: string;
  titulo?: string;
  descripcion?: string;
}
