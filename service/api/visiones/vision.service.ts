/**
 * Servicio para operaciones CRUD de Visiones
 */

import { api } from "../config/axios.config";
import { VISION_ENDPOINTS } from "../config/api.constants";
import type {
  Vision,
  CreateVisionDTO,
  UpdateVisionDTO,
  ApiResponse,
  ApiListResponse,
} from "../types";

/**
 * Obtiene todas las visiones del usuario autenticado
 */
export const getVisiones = async (): Promise<Vision[]> => {
  const response = await api.get<ApiListResponse<Vision>>(
    VISION_ENDPOINTS.LIST
  );
  return response.data.data;
};

/**
 * Obtiene una visión por ID
 */
export const getVisionById = async (id: string): Promise<Vision> => {
  const response = await api.get<ApiResponse<Vision>>(
    VISION_ENDPOINTS.GET(id)
  );
  return response.data.data;
};

/**
 * Crea una nueva visión
 */
export const createVision = async (
  data: CreateVisionDTO
): Promise<Vision> => {
  const response = await api.post<ApiResponse<Vision>>(
    VISION_ENDPOINTS.CREATE,
    data
  );
  return response.data.data;
};

/**
 * Actualiza una visión existente (upsert)
 */
export const updateVision = async (
  data: UpdateVisionDTO
): Promise<Vision> => {
  const response = await api.post<ApiResponse<Vision>>(
    VISION_ENDPOINTS.UPDATE,
    data
  );
  return response.data.data;
};

/**
 * Elimina una visión
 */
export const deleteVision = async (id: string): Promise<void> => {
  await api.delete(VISION_ENDPOINTS.DELETE(id));
};

/**
 * Exporta todas las funciones como un objeto (opcional)
 */
export const visionService = {
  getVisiones,
  getVisionById,
  createVision,
  updateVision,
  deleteVision,
};
