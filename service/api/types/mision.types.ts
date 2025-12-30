/**
 * Types para Misiones
 * Basado en el modelo Mision de Prisma
 */

import type { Tarea } from "./tarea.types";

export interface Mision {
  id: string;
  titulo: string;
  descripcion: string | null;
  isDone: boolean;
  objetivoId: string;
  createdAt: string;
  updatedAt: string;
  // Relaciones opcionales
  tareas?: Tarea[];
}

export interface CreateMisionDTO {
  titulo: string;
  descripcion?: string;
  objetivoId: string;
}

export interface UpdateMisionDTO {
  id: string;
  titulo?: string;
  descripcion?: string;
  isDone?: boolean;
}
