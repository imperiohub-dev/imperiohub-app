/**
 * Types para Objetivos
 * Basado en el modelo Objetivo de Prisma
 */

import type { Mision } from "./mision.types";

export interface Objetivo {
  id: string;
  titulo: string;
  descripcion: string | null;
  isDone: boolean;
  metaId: string;
  createdAt: string;
  updatedAt: string;
  // Relaciones opcionales
  misiones?: Mision[];
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
  isDone?: boolean;
}
