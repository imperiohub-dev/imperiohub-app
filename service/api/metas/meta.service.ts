/**
 * Servicio para operaciones CRUD de Metas
 */

import { api } from "../config/axios.config";
import { META_ENDPOINTS } from "../config/api.constants";
import type {
  Meta,
  CreateMetaDTO,
  UpdateMetaDTO,
  ApiResponse,
  ApiListResponse,
} from "../types";

/**
 * Obtiene todas las metas del usuario autenticado
 */
export const getMetas = async (): Promise<Meta[]> => {
  const response = await api.get<ApiListResponse<Meta>>(META_ENDPOINTS.LIST);
  return response.data.data;
};

/**
 * Obtiene una meta por ID
 */
export const getMetaById = async (id: string): Promise<Meta> => {
  const response = await api.get<ApiResponse<Meta>>(META_ENDPOINTS.GET(id));
  return response.data.data;
};

/**
 * Crea una nueva meta
 */
export const createMeta = async (data: CreateMetaDTO): Promise<Meta> => {
  const response = await api.post<ApiResponse<Meta>>(
    META_ENDPOINTS.CREATE,
    data
  );
  return response.data.data;
};

/**
 * Actualiza una meta existente (upsert)
 */
export const updateMeta = async (data: UpdateMetaDTO): Promise<Meta> => {
  const response = await api.post<ApiResponse<Meta>>(
    META_ENDPOINTS.UPDATE,
    data
  );
  return response.data.data;
};

/**
 * Elimina una meta
 */
export const deleteMeta = async (id: string): Promise<void> => {
  await api.delete(META_ENDPOINTS.DELETE(id));
};

/**
 * Exporta todas las funciones como un objeto (opcional)
 */
export const metaService = {
  getMetas,
  getMetaById,
  createMeta,
  updateMeta,
  deleteMeta,
};
