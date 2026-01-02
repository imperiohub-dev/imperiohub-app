import { useEffect, useState, useCallback } from "react";
import { getVisionesHierarchy, type VisionHierarchy } from "@/service/api";
import type { Vision } from "@/service/api/types/vision.types";
import type { Meta } from "@/service/api/types/meta.types";
import type { Objetivo } from "@/service/api/types/objetivo.types";
import type { Mision } from "@/service/api/types/mision.types";
import type { Tarea } from "@/service/api/types/tarea.types";

export enum CampamentoType {
  VISION = "vision",
  META = "meta",
  OBJETIVO = "objetivo",
  MISION = "mision",
  TAREA = "tarea",
}

export type CampamentoCardType = Vision | Meta | Objetivo | Mision | Tarea;

export default function useCampamentoView() {
  const [visiones, setVisiones] = useState<VisionHierarchy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stack de navegación: array de tarjetas visitadas
  const [navigationStack, setNavigationStack] = useState<CampamentoCardType[]>([]);

  // Función para cargar/refrescar visiones
  const fetchVisiones = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getVisionesHierarchy();
      setVisiones(response.visiones);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar visiones";
      setError(errorMessage);
      console.error("Error fetching visiones hierarchy:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar visiones al montar el componente
  useEffect(() => {
    fetchVisiones();
  }, [fetchVisiones]);

  // La tarjeta actual es la última en el stack (o null si está vacío)
  const currentCard = navigationStack.length > 0
    ? navigationStack[navigationStack.length - 1]
    : null;

  const [currentChildren, setCurrentChildren] = useState<CampamentoCardType[]>(
    []
  );

  // Obtener los hijos de una tarjeta
  const getChildren = useCallback(
    (card: CampamentoCardType | null): CampamentoCardType[] => {
      if (!card) return visiones;

      if ("metas" in card) return card.metas || [];
      if ("visionId" in card && "objetivos" in card) return card.objetivos || [];
      if ("metaId" in card && "misiones" in card) return card.misiones || [];
      if ("objetivoId" in card && "tareas" in card) return card.tareas || [];
      if ("misionId" in card) return [];

      return [];
    },
    [visiones]
  );

  // Obtener el tipo de campamento de una tarjeta
  const getCampamentoType = (card: CampamentoCardType | null): CampamentoType => {
    if (!card) return CampamentoType.VISION;
    if ("metas" in card) return CampamentoType.VISION;
    if ("visionId" in card && "objetivos" in card) return CampamentoType.META;
    if ("metaId" in card && "misiones" in card) return CampamentoType.OBJETIVO;
    if ("objetivoId" in card && "tareas" in card) return CampamentoType.MISION;
    if ("misionId" in card) return CampamentoType.TAREA;
    return CampamentoType.VISION;
  };

  // Navegar hacia adelante: agregar tarjeta al stack
  const navigateForward = (card: CampamentoCardType) => {
    setNavigationStack((prev) => [...prev, card]);
  };

  // Navegar hacia atrás: remover la última tarjeta del stack
  const navigateBack = () => {
    setNavigationStack((prev) => prev.slice(0, -1));
  };

  // Navegar a un índice específico del stack (para breadcrumbs)
  const navigateToIndex = (index: number) => {
    setNavigationStack((prev) => prev.slice(0, index + 1));
  };

  // Resetear completamente la navegación
  const resetNavigation = () => {
    setNavigationStack([]);
  };

  // Actualizar currentChildren cuando cambia el stack
  useEffect(() => {
    const children = getChildren(currentCard);
    setCurrentChildren(children);
  }, [currentCard, getChildren]);

  return {
    visiones,
    setVisiones,
    loading,
    error,
    fetchVisiones,
    currentCard,
    currentChildren,
    navigationStack,
    navigateForward,
    navigateBack,
    navigateToIndex,
    resetNavigation,
    getCampamentoType,
  };
}
