/**
 * Types para Visiones
 * Basado en el modelo Vision de Prisma
 */

import type { BaseEntity, BaseCreateDTO, BaseUpdateDTO } from "./base.types";
import type { Meta } from "./meta.types";
import type { Objetivo } from "./objetivo.types";
import type { Mision } from "./mision.types";
import type { Tarea } from "./tarea.types";

export interface Vision extends BaseEntity {
  usuarioId: string;
  organizacionId: string | null; // Relación con Organizacion
  // Relaciones opcionales (cuando se incluyen desde el backend)
  metas?: Meta[];
}

export interface CreateVisionDTO extends BaseCreateDTO {
  organizacionId?: string; // Opcional para retrocompatibilidad
}

export interface UpdateVisionDTO extends BaseUpdateDTO {
  organizacionId?: string;
}

// ============================================
// Tipos de Jerarquía Completa (desde el backend)
// ============================================

export interface VisionWithRelations extends Vision {
  metas: Meta[];
}

// Jerarquía completa: Tarea (nivel final)
export interface TareaHierarchy extends Tarea {}

// Jerarquía completa: Mision con Tareas
export interface MisionHierarchy extends Mision {
  tareas: TareaHierarchy[];
}

// Jerarquía completa: Objetivo con Misiones
export interface ObjetivoHierarchy extends Objetivo {
  misiones: MisionHierarchy[];
}

// Jerarquía completa: Meta con Objetivos
export interface MetaHierarchy extends Meta {
  objetivos: ObjetivoHierarchy[];
}

// Jerarquía completa: Vision con toda su descendencia
export interface VisionHierarchy extends Vision {
  metas: MetaHierarchy[];
}
