/**
 * Types para Objetivos
 * Basado en el modelo Objetivo de Prisma
 */

import type { BaseEntity, BaseCreateDTO, BaseUpdateDTO } from "./base.types";
import type { Mision } from "./mision.types";

export interface Objetivo extends BaseEntity {
  metaId: string;
  // Relaciones opcionales
  misiones?: Mision[];
}

export interface CreateObjetivoDTO extends BaseCreateDTO {
  metaId: string;
}

export interface UpdateObjetivoDTO extends BaseUpdateDTO {}
