import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  getMetas,
  createMeta,
  updateMeta as updateMetaService,
  deleteMeta,
  type Meta,
  type CreateMetaDTO,
  type UpdateMetaDTO,
} from "@/service/api";

interface MetasContextType {
  // Estado
  metas: Meta[];
  loading: boolean;
  error: string | null;

  // Acciones CRUD
  fetchMetas: () => Promise<void>;
  addMeta: (data: CreateMetaDTO) => Promise<Meta>;
  updateMeta: (data: UpdateMetaDTO) => Promise<Meta>;
  removeMeta: (id: string) => Promise<void>;

  // Helpers
  getMetaById: (id: string) => Meta | undefined;
  getMetasByVisionId: (visionId: string) => Meta[];
  refreshMetas: () => Promise<void>;
}

const MetasContext = createContext<MetasContextType | undefined>(undefined);

interface MetasProviderProps {
  children: ReactNode;
}

export const MetasProvider = ({ children }: MetasProviderProps) => {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar metas al montar el componente
  useEffect(() => {
    fetchMetas();
  }, []);

  /**
   * Obtiene todas las metas del backend
   */
  const fetchMetas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMetas();
      setMetas(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar metas";
      setError(errorMessage);
      console.error("Error fetching metas:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Crea una nueva meta y actualiza el estado local
   */
  const addMeta = async (data: CreateMetaDTO): Promise<Meta> => {
    try {
      const nuevaMeta = await createMeta(data);
      // Agregar al inicio de la lista
      setMetas((prev) => [nuevaMeta, ...prev]);
      return nuevaMeta;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al crear meta";
      setError(errorMessage);
      throw err;
    }
  };

  /**
   * Actualiza una meta existente y actualiza el estado local
   */
  const updateMeta = async (data: UpdateMetaDTO): Promise<Meta> => {
    try {
      const metaActualizada = await updateMetaService(data);
      // Actualizar en el estado local
      setMetas((prev) =>
        prev.map((m) => (m.id === data.id ? metaActualizada : m))
      );
      return metaActualizada;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al actualizar meta";
      setError(errorMessage);
      throw err;
    }
  };

  /**
   * Elimina una meta y actualiza el estado local
   */
  const removeMeta = async (id: string): Promise<void> => {
    try {
      await deleteMeta(id);
      // Remover del estado local
      setMetas((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al eliminar meta";
      setError(errorMessage);
      throw err;
    }
  };

  /**
   * Obtiene una meta por ID desde el estado local
   */
  const getMetaById = (id: string): Meta | undefined => {
    return metas.find((m) => m.id === id);
  };

  /**
   * Obtiene todas las metas de una visión específica
   */
  const getMetasByVisionId = (visionId: string): Meta[] => {
    return metas.filter((m) => m.visionId === visionId);
  };

  /**
   * Refresca la lista de metas (alias de fetchMetas)
   */
  const refreshMetas = async () => {
    await fetchMetas();
  };

  const value: MetasContextType = {
    metas,
    loading,
    error,
    fetchMetas,
    addMeta,
    updateMeta,
    removeMeta,
    getMetaById,
    getMetasByVisionId,
    refreshMetas,
  };

  return (
    <MetasContext.Provider value={value}>{children}</MetasContext.Provider>
  );
};

/**
 * Hook para acceder al contexto de Metas
 * @throws Error si se usa fuera del MetasProvider
 */
export const useMetas = () => {
  const context = useContext(MetasContext);

  if (context === undefined) {
    throw new Error("useMetas must be used within a MetasProvider");
  }

  return context;
};
