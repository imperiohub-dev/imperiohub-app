import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  getVisiones,
  createVision,
  updateVision as updateVisionService,
  deleteVision,
  type Vision,
  type CreateVisionDTO,
  type UpdateVisionDTO,
} from "@/service/api";

interface VisionesContextType {
  // Estado
  visiones: Vision[];
  loading: boolean;
  error: string | null;

  // Acciones CRUD
  fetchVisiones: () => Promise<void>;
  addVision: (data: CreateVisionDTO) => Promise<Vision>;
  updateVision: (data: UpdateVisionDTO) => Promise<Vision>;
  removeVision: (id: string) => Promise<void>;

  // Helpers
  getVisionById: (id: string) => Vision | undefined;
  refreshVisiones: () => Promise<void>;
}

const VisionesContext = createContext<VisionesContextType | undefined>(
  undefined
);

interface VisionesProviderProps {
  children: ReactNode;
}

export const VisionesProvider = ({ children }: VisionesProviderProps) => {
  const [visiones, setVisiones] = useState<Vision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar visiones al montar el componente
  useEffect(() => {
    fetchVisiones();
  }, []);

  /**
   * Obtiene todas las visiones del backend
   */
  const fetchVisiones = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getVisiones();
      setVisiones(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar visiones";
      setError(errorMessage);
      console.error("Error fetching visiones:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Crea una nueva visión y actualiza el estado local
   */
  const addVision = async (data: CreateVisionDTO): Promise<Vision> => {
    try {
      const nuevaVision = await createVision(data);
      // Agregar al inicio de la lista
      setVisiones((prev) => [nuevaVision, ...prev]);
      return nuevaVision;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al crear visión";
      setError(errorMessage);
      throw err;
    }
  };

  /**
   * Actualiza una visión existente y actualiza el estado local
   */
  const updateVision = async (data: UpdateVisionDTO): Promise<Vision> => {
    try {
      const visionActualizada = await updateVisionService(data);
      // Actualizar en el estado local
      setVisiones((prev) =>
        prev.map((v) => (v.id === data.id ? visionActualizada : v))
      );
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
  const getVisionById = (id: string): Vision | undefined => {
    return visiones.find((v) => v.id === id);
  };

  /**
   * Refresca la lista de visiones (alias de fetchVisiones)
   */
  const refreshVisiones = async () => {
    await fetchVisiones();
  };

  const value: VisionesContextType = {
    visiones,
    loading,
    error,
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
