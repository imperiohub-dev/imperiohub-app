/**
 * Types para Tareas
 * Basado en el modelo Tarea de Prisma
 */

export interface Tarea {
  id: string;
  titulo: string;
  descripcion: string | null;
  completada: boolean;
  misionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTareaDTO {
  titulo: string;
  descripcion?: string;
  misionId: string;
}

export interface UpdateTareaDTO {
  id: string;
  titulo?: string;
  descripcion?: string;
  completada?: boolean;
}
