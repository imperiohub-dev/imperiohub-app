/**
 * Types para Metas
 * Basado en el modelo Meta de Prisma
 */

import type { BaseEntity, BaseCreateDTO, BaseUpdateDTO } from "./base.types";
import type { Objetivo } from "./objetivo.types";

export interface Meta extends BaseEntity {
  visionId: string;
  // Relaciones opcionales
  objetivos?: Objetivo[];
}

export interface CreateMetaDTO extends BaseCreateDTO {
  visionId: string;
}

export interface UpdateMetaDTO extends BaseUpdateDTO {}
