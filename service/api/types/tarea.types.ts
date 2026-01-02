/**
 * Types para Tareas
 * Basado en el modelo Tarea de Prisma
 */

import type { BaseEntity, BaseCreateDTO, BaseUpdateDTO } from "./base.types";

export interface Tarea extends BaseEntity {
  misionId: string;
}

export interface CreateTareaDTO extends BaseCreateDTO {
  misionId: string;
}

export interface UpdateTareaDTO extends BaseUpdateDTO {}
