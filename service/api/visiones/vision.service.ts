/**
 * Servicio para operaciones CRUD de Visiones
 */

import { api } from "../config/axios.config";
import { VISION_ENDPOINTS } from "../config/api.constants";
import type {
  Vision,
  FindHierarchyResponse,
  CreateVisionDTO,
  UpdateVisionDTO,
  ApiResponse,
  ApiListResponse,
} from "../types";

/**
 * Obtiene todas las visiones del usuario autenticado (sin relaciones anidadas)
 */
export const getVisiones = async (): Promise<Vision[]> => {
  const response = await api.get<ApiListResponse<Vision>>(
    VISION_ENDPOINTS.LIST
  );

  return response.data.data;
};

/**
 * Obtiene la jerarquía completa de visiones (Vision → Metas → Objetivos → Misiones → Tareas)
 * @param params - Parámetros de paginación, filtros y ordenamiento
 */
export const getVisionesHierarchy = async (params?: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  isDone?: boolean;
  search?: string;
}): Promise<FindHierarchyResponse> => {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
  if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);
  if (params?.isDone !== undefined) queryParams.append("isDone", params.isDone.toString());
  if (params?.search) queryParams.append("search", params.search);

  const url = `${VISION_ENDPOINTS.HIERARCHY}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

  const response = await api.get<ApiResponse<FindHierarchyResponse>>(url);

  return response.data.data;
};

/**
 * Obtiene una visión por ID
 */
export const getVisionById = async (id: string): Promise<Vision> => {
  const response = await api.get<ApiResponse<Vision>>(VISION_ENDPOINTS.GET(id));
  return response.data.data;
};

/**
 * Crea una nueva visión
 */
export const createVision = async (data: CreateVisionDTO): Promise<Vision> => {
  const response = await api.post<ApiResponse<Vision>>(
    VISION_ENDPOINTS.CREATE,
    data
  );
  return response.data.data;
};

/**
 * Actualiza una visión existente (upsert)
 */
export const updateVision = async (data: UpdateVisionDTO): Promise<Vision> => {
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
  getVisionesHierarchy,
  getVisionById,
  createVision,
  updateVision,
  deleteVision,
};
