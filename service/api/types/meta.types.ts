/**
 * Types para Metas
 * Basado en el modelo Meta de Prisma
 */

import type { Objetivo } from "./objetivo.types";

export interface Meta {
  id: string;
  titulo: string;
  descripcion: string | null;
  isDone: boolean;
  visionId: string;
  createdAt: string;
  updatedAt: string;
  // Relaciones opcionales
  objetivos?: Objetivo[];
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
  isDone?: boolean;
}
