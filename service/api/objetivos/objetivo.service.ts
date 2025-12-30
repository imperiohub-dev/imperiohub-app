/**
 * Servicio para operaciones CRUD de Objetivos
 */

import { api } from "../config/axios.config";
import { OBJETIVO_ENDPOINTS } from "../config/api.constants";
import type {
  Objetivo,
  CreateObjetivoDTO,
  UpdateObjetivoDTO,
  ApiResponse,
  ApiListResponse,
} from "../types";

/**
 * Obtiene todos los objetivos del usuario autenticado
 */
export const getObjetivos = async (): Promise<Objetivo[]> => {
  const response = await api.get<ApiListResponse<Objetivo>>(
    OBJETIVO_ENDPOINTS.LIST
  );
  return response.data.data;
};

/**
 * Obtiene un objetivo por ID
 */
export const getObjetivoById = async (id: string): Promise<Objetivo> => {
  const response = await api.get<ApiResponse<Objetivo>>(
    OBJETIVO_ENDPOINTS.GET(id)
  );
  return response.data.data;
};

/**
 * Crea un nuevo objetivo
 */
export const createObjetivo = async (
  data: CreateObjetivoDTO
): Promise<Objetivo> => {
  const response = await api.post<ApiResponse<Objetivo>>(
    OBJETIVO_ENDPOINTS.CREATE,
    data
  );
  return response.data.data;
};

/**
 * Actualiza un objetivo existente (upsert)
 */
export const updateObjetivo = async (
  data: UpdateObjetivoDTO
): Promise<Objetivo> => {
  const response = await api.post<ApiResponse<Objetivo>>(
    OBJETIVO_ENDPOINTS.UPDATE,
    data
  );
  return response.data.data;
};

/**
 * Elimina un objetivo
 */
export const deleteObjetivo = async (id: string): Promise<void> => {
  await api.delete(OBJETIVO_ENDPOINTS.DELETE(id));
};

/**
 * Exporta todas las funciones como un objeto (opcional)
 */
export const objetivoService = {
  getObjetivos,
  getObjetivoById,
  createObjetivo,
  updateObjetivo,
  deleteObjetivo,
};
