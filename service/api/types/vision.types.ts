/**
 * Types para Visiones
 * Basado en el modelo Vision de Prisma
 */

import type { Meta } from "./meta.types";

export interface Vision {
  id: string;
  titulo: string;
  descripcion: string | null;
  isDone: boolean;
  usuarioId: string;
  createdAt: string;
  updatedAt: string;
  // Relaciones opcionales (cuando se incluyen desde el backend)
  metas?: Meta[];
}

export interface CreateVisionDTO {
  titulo: string;
  descripcion?: string;
}

export interface UpdateVisionDTO {
  id: string;
  titulo?: string;
  descripcion?: string;
  isDone?: boolean;
}
