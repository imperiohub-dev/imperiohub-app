/**
 * Servicio para operaciones CRUD de Tareas
 */

import { api } from "../config/axios.config";
import { TAREA_ENDPOINTS } from "../config/api.constants";
import type {
  Tarea,
  CreateTareaDTO,
  UpdateTareaDTO,
  ApiResponse,
  ApiListResponse,
} from "../types";

/**
 * Obtiene todas las tareas del usuario autenticado
 */
export const getTareas = async (): Promise<Tarea[]> => {
  const response = await api.get<ApiListResponse<Tarea>>(TAREA_ENDPOINTS.LIST);
  return response.data.data;
};

/**
 * Obtiene una tarea por ID
 */
export const getTareaById = async (id: string): Promise<Tarea> => {
  const response = await api.get<ApiResponse<Tarea>>(TAREA_ENDPOINTS.GET(id));
  return response.data.data;
};

/**
 * Crea una nueva tarea
 */
export const createTarea = async (data: CreateTareaDTO): Promise<Tarea> => {
  const response = await api.post<ApiResponse<Tarea>>(
    TAREA_ENDPOINTS.CREATE,
    data
  );
  return response.data.data;
};

/**
 * Actualiza una tarea existente (upsert)
 */
export const updateTarea = async (data: UpdateTareaDTO): Promise<Tarea> => {
  const response = await api.post<ApiResponse<Tarea>>(
    TAREA_ENDPOINTS.UPDATE,
    data
  );
  return response.data.data;
};

/**
 * Elimina una tarea
 */
export const deleteTarea = async (id: string): Promise<void> => {
  await api.delete(TAREA_ENDPOINTS.DELETE(id));
};

/**
 * Marca una tarea como completada/incompleta
 */
export const toggleTareaCompletada = async (
  id: string,
  completada: boolean
): Promise<Tarea> => {
  return updateTarea({ id, completada });
};

/**
 * Exporta todas las funciones como un objeto (opcional)
 */
export const tareaService = {
  getTareas,
  getTareaById,
  createTarea,
  updateTarea,
  deleteTarea,
  toggleTareaCompletada,
};
