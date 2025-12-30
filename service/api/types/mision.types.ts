/**
 * Types para Misiones
 * Basado en el modelo Mision de Prisma
 */

export interface Mision {
  id: string;
  titulo: string;
  descripcion: string | null;
  objetivoId: string;
  createdAt: string;
  updatedAt: string;
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
}
