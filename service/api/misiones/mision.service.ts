/**
 * Servicio para operaciones CRUD de Misiones
 */

import { api } from "../config/axios.config";
import { MISION_ENDPOINTS } from "../config/api.constants";
import type {
  Mision,
  CreateMisionDTO,
  UpdateMisionDTO,
  ApiResponse,
  ApiListResponse,
} from "../types";

/**
 * Obtiene todas las misiones del usuario autenticado
 */
export const getMisiones = async (): Promise<Mision[]> => {
  const response = await api.get<ApiListResponse<Mision>>(
    MISION_ENDPOINTS.LIST
  );
  return response.data.data;
};

/**
 * Obtiene una misión por ID
 */
export const getMisionById = async (id: string): Promise<Mision> => {
  const response = await api.get<ApiResponse<Mision>>(
    MISION_ENDPOINTS.GET(id)
  );
  return response.data.data;
};

/**
 * Crea una nueva misión
 */
export const createMision = async (
  data: CreateMisionDTO
): Promise<Mision> => {
  const response = await api.post<ApiResponse<Mision>>(
    MISION_ENDPOINTS.CREATE,
    data
  );
  return response.data.data;
};

/**
 * Actualiza una misión existente (upsert)
 */
export const updateMision = async (
  data: UpdateMisionDTO
): Promise<Mision> => {
  const response = await api.post<ApiResponse<Mision>>(
    MISION_ENDPOINTS.UPDATE,
    data
  );
  return response.data.data;
};

/**
 * Elimina una misión
 */
export const deleteMision = async (id: string): Promise<void> => {
  await api.delete(MISION_ENDPOINTS.DELETE(id));
};

/**
 * Exporta todas las funciones como un objeto (opcional)
 */
export const misionService = {
  getMisiones,
  getMisionById,
  createMision,
  updateMision,
  deleteMision,
};
