/**
 * Servicio para operaciones CRUD de Organizaciones
 */

import { api } from "../config/axios.config";
import { ORGANIZACION_ENDPOINTS } from "../config/api.constants";
import type {
  Organizacion,
  OrganizacionHierarchy,
  FindHierarchyResponse,
  CreateOrganizacionDTO,
  UpdateOrganizacionDTO,
  ApiResponse,
  ApiListResponse,
} from "../types";

/**
 * Mapea una organización del backend al formato del frontend
 * Convierte 'nombre' a 'titulo' para mantener consistencia con BaseEntity
 */
const mapOrganizacionFromBackend = (org: any): Organizacion => ({
  id: org.id,
  titulo: org.nombre, // Mapear nombre -> titulo
  descripcion: org.descripcion,
  usuarioId: org.usuarioId,
  createdAt: org.createdAt,
  updatedAt: org.updatedAt,
  isDone: false, // Las organizaciones no tienen isDone, pero lo agregamos para consistencia
  _originalNombre: org.nombre, // Guardar el nombre original para debugging
});

/**
 * Mapea una jerarquía de organización del backend al formato del frontend
 */
const mapOrganizacionHierarchyFromBackend = (org: any): OrganizacionHierarchy => ({
  ...mapOrganizacionFromBackend(org),
  visiones: org.visiones || [],
});

/**
 * Obtiene todas las organizaciones del usuario autenticado (sin relaciones anidadas)
 */
export const getOrganizaciones = async (): Promise<Organizacion[]> => {
  const response = await api.get<ApiListResponse<any>>(
    ORGANIZACION_ENDPOINTS.LIST
  );

  return response.data.data.map(mapOrganizacionFromBackend);
};

/**
 * Obtiene la jerarquía completa de organizaciones (Organizacion → Visiones → Metas → Objetivos → Misiones → Tareas)
 * @param params - Parámetros de paginación, filtros y ordenamiento
 */
export const getOrganizacionesHierarchy = async (params?: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}): Promise<FindHierarchyResponse> => {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
  if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);
  if (params?.search) queryParams.append("search", params.search);

  const url = `${ORGANIZACION_ENDPOINTS.HIERARCHY}${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  const response = await api.get<ApiResponse<any>>(url);

  // Mapear la respuesta del backend
  return {
    organizaciones: response.data.data.organizaciones.map(
      mapOrganizacionHierarchyFromBackend
    ),
    pagination: response.data.data.pagination,
  };
};

/**
 * Obtiene una organización por ID
 */
export const getOrganizacion = async (id: string): Promise<Organizacion> => {
  const response = await api.get<ApiResponse<any>>(
    ORGANIZACION_ENDPOINTS.GET(id)
  );

  return mapOrganizacionFromBackend(response.data.data);
};

/**
 * Crea una nueva organización
 */
export const createOrganizacion = async (
  data: CreateOrganizacionDTO
): Promise<Organizacion> => {
  const response = await api.post<ApiResponse<any>>(
    ORGANIZACION_ENDPOINTS.CREATE,
    data
  );

  return mapOrganizacionFromBackend(response.data.data);
};

/**
 * Actualiza una organización existente
 */
export const updateOrganizacion = async (
  data: UpdateOrganizacionDTO
): Promise<Organizacion> => {
  const response = await api.put<ApiResponse<any>>(
    ORGANIZACION_ENDPOINTS.UPDATE,
    data
  );

  return mapOrganizacionFromBackend(response.data.data);
};

/**
 * Elimina una organización
 */
export const deleteOrganizacion = async (id: string): Promise<void> => {
  await api.delete(ORGANIZACION_ENDPOINTS.DELETE(id));
};
