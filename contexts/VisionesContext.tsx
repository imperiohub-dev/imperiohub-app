import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  getVisionesHierarchy,
  createVision,
  updateVision as updateVisionService,
  deleteVision,
  type VisionHierarchy,
  type CreateVisionDTO,
  type UpdateVisionDTO,
  type PaginationMeta,
} from "@/service/api";
import { useAuth } from "@/contexts/AuthContext";

interface VisionesContextType {
  // Estado
  visiones: VisionHierarchy[];
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;

  // Acciones CRUD
  fetchVisiones: () => Promise<void>;
  addVision: (data: CreateVisionDTO) => Promise<VisionHierarchy>;
  updateVision: (data: UpdateVisionDTO) => Promise<VisionHierarchy>;
  removeVision: (id: string) => Promise<void>;

  // Helpers
  getVisionById: (id: string) => VisionHierarchy | undefined;
  refreshVisiones: () => Promise<void>;
}

const VisionesContext = createContext<VisionesContextType | undefined>(
  undefined
);

interface VisionesProviderProps {
  children: ReactNode;
}

export const VisionesProvider = ({ children }: VisionesProviderProps) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [visiones, setVisiones] = useState<VisionHierarchy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);

  // Cargar visiones solo cuando el usuario esté autenticado
  useEffect(() => {
    // No intentar cargar si aún está verificando autenticación
    if (authLoading) {
      return;
    }

    // Solo cargar visiones si el usuario está autenticado
    if (isAuthenticated) {
      fetchVisiones();
    } else {
      // Si no está autenticado, limpiar estado
      setVisiones([]);
      setPagination(null);
      setLoading(false);
    }
  }, [isAuthenticated, authLoading]);

  /**
   * Obtiene toda la jerarquía de visiones del backend
   * Ahora trae Vision → Metas → Objetivos → Misiones → Tareas
   */
  const fetchVisiones = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getVisionesHierarchy();
      setVisiones(response.visiones);
      setPagination(response.pagination);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar visiones";
      setError(errorMessage);
      console.error("Error fetching visiones hierarchy:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Crea una nueva visión y refresca la jerarquía completa
   */
  const addVision = async (data: CreateVisionDTO): Promise<VisionHierarchy> => {
    try {
      const nuevaVision = await createVision(data);
      // Refrescar toda la jerarquía para obtener la estructura completa
      await fetchVisiones();
      // Buscar y retornar la visión recién creada con toda su jerarquía
      const visionConJerarquia = visiones.find((v) => v.id === nuevaVision.id);
      return visionConJerarquia || (nuevaVision as VisionHierarchy);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al crear visión";
      setError(errorMessage);
      throw err;
    }
  };

  /**
   * Actualiza una visión existente y refresca la jerarquía completa
   */
  const updateVision = async (data: UpdateVisionDTO): Promise<VisionHierarchy> => {
    try {
      await updateVisionService(data);
      // Refrescar toda la jerarquía para obtener los cambios
      await fetchVisiones();
      // Buscar y retornar la visión actualizada
      const visionActualizada = visiones.find((v) => v.id === data.id);
      if (!visionActualizada) {
        throw new Error("Visión no encontrada después de actualizar");
      }
      return visionActualizada;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al actualizar visión";
      setError(errorMessage);
      throw err;
    }
  };

  /**
   * Elimina una visión y actualiza el estado local
   */
  const removeVision = async (id: string): Promise<void> => {
    try {
      await deleteVision(id);
      // Remover del estado local
      setVisiones((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al eliminar visión";
      setError(errorMessage);
      throw err;
    }
  };

  /**
   * Obtiene una visión por ID desde el estado local
   */
  const getVisionById = (id: string): VisionHierarchy | undefined => {
    return visiones.find((v) => v.id === id);
  };

  /**
   * Refresca la lista de visiones con toda su jerarquía
   */
  const refreshVisiones = async () => {
    await fetchVisiones();
  };

  const value: VisionesContextType = {
    visiones,
    loading,
    error,
    pagination,
    fetchVisiones,
    addVision,
    updateVision,
    removeVision,
    getVisionById,
    refreshVisiones,
  };

  return (
    <VisionesContext.Provider value={value}>
      {children}
    </VisionesContext.Provider>
  );
};

/**
 * Hook para acceder al contexto de Visiones
 * @throws Error si se usa fuera del VisionesProvider
 */
export const useVisiones = () => {
  const context = useContext(VisionesContext);

  if (context === undefined) {
    throw new Error("useVisiones must be used within a VisionesProvider");
  }

  return context;
};
