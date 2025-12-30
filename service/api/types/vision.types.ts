/**
 * Types para Visiones
 * Basado en el modelo Vision de Prisma
 */

export interface Vision {
  id: string;
  titulo: string;
  descripcion: string | null;
  usuarioId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVisionDTO {
  titulo: string;
  descripcion?: string;
}

export interface UpdateVisionDTO {
  id: string;
  titulo?: string;
  descripcion?: string;
}
