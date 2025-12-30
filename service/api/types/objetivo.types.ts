/**
 * Types para Objetivos
 * Basado en el modelo Objetivo de Prisma
 */

export interface Objetivo {
  id: string;
  titulo: string;
  descripcion: string | null;
  metaId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateObjetivoDTO {
  titulo: string;
  descripcion?: string;
  metaId: string;
}

export interface UpdateObjetivoDTO {
  id: string;
  titulo?: string;
  descripcion?: string;
}
