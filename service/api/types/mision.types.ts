/**
 * Types para Misiones
 * Basado en el modelo Mision de Prisma
 */

import type { BaseEntity, BaseCreateDTO, BaseUpdateDTO } from "./base.types";
import type { Tarea } from "./tarea.types";

export interface Mision extends BaseEntity {
  objetivoId: string;
  // Relaciones opcionales
  tareas?: Tarea[];
}

export interface CreateMisionDTO extends BaseCreateDTO {
  objetivoId: string;
}

export interface UpdateMisionDTO extends BaseUpdateDTO {
  objetivoId?: string; // Opcional para no romper código existente
}
