import { useState } from "react";
import {
  createVision,
  updateVision as updateVisionService,
  deleteVision,
  createMeta,
  updateMeta,
  deleteMeta,
  createObjetivo,
  updateObjetivo,
  deleteObjetivo,
  createMision,
  updateMision,
  deleteMision,
  createTarea,
  updateTarea,
  deleteTarea,
  type CreateVisionDTO,
  type UpdateVisionDTO,
  type CreateMetaDTO,
  type UpdateMetaDTO,
  type CreateObjetivoDTO,
  type UpdateObjetivoDTO,
  type CreateMisionDTO,
  type UpdateMisionDTO,
  type CreateTareaDTO,
  type UpdateTareaDTO,
  type VisionHierarchy,
} from "@/service/api";
import type { CampamentoCardType } from "./useCampamentoView";
import type { Vision } from "@/service/api/types/vision.types";
import type { Meta } from "@/service/api/types/meta.types";
import type { Objetivo } from "@/service/api/types/objetivo.types";
import type { Mision } from "@/service/api/types/mision.types";
import type { Tarea } from "@/service/api/types/tarea.types";

export type ItemType = "vision" | "meta" | "objetivo" | "mision" | "tarea";

interface UseCampamentoCRUDProps {
  onRefresh: () => Promise<void>;
}

export function useCampamentoCRUD({ onRefresh }: UseCampamentoCRUDProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Determina el tipo de elemento basado en la estructura de la tarjeta
   */
  const getCardType = (card: CampamentoCardType): ItemType => {
    if ("metas" in card) return "vision";
    if ("visionId" in card && "objetivos" in card) return "meta";
    if ("metaId" in card && "misiones" in card) return "objetivo";
    if ("objetivoId" in card && "tareas" in card) return "mision";
    return "tarea";
  };

  /**
   * Determina el tipo de hijo que puede crear una tarjeta
   */
  const getChildType = (card: CampamentoCardType): ItemType => {
    if ("metas" in card) return "meta";
    if ("visionId" in card && "objetivos" in card) return "objetivo";
    if ("metaId" in card && "misiones" in card) return "mision";
    if ("objetivoId" in card && "tareas" in card) return "tarea";
    return "tarea";
  };

  /**
   * Crea un nuevo elemento hijo basado en el tipo de tarjeta actual
   */
  const createItem = async (
    parentCard: CampamentoCardType,
    data: { titulo: string; descripcion: string }
  ): Promise<Vision | Meta | Objetivo | Mision | Tarea> => {
    setLoading(true);
    setError(null);

    try {
      let result: Vision | Meta | Objetivo | Mision | Tarea;

      if ("metas" in parentCard) {
        // Crear Meta
        const metaData: CreateMetaDTO = {
          titulo: data.titulo,
          descripcion: data.descripcion,
          visionId: parentCard.id,
        };
        result = await createMeta(metaData);
      } else if ("visionId" in parentCard && "objetivos" in parentCard) {
        // Crear Objetivo
        const objetivoData: CreateObjetivoDTO = {
          titulo: data.titulo,
          descripcion: data.descripcion,
          metaId: parentCard.id,
        };
        result = await createObjetivo(objetivoData);
      } else if ("metaId" in parentCard && "misiones" in parentCard) {
        // Crear Misión
        const misionData: CreateMisionDTO = {
          titulo: data.titulo,
          descripcion: data.descripcion,
          objetivoId: parentCard.id,
        };
        result = await createMision(misionData);
      } else if ("objetivoId" in parentCard && "tareas" in parentCard) {
        // Crear Tarea
        const tareaData: CreateTareaDTO = {
          titulo: data.titulo,
          descripcion: data.descripcion,
          misionId: parentCard.id,
        };
        result = await createTarea(tareaData);
      } else {
        throw new Error("Tipo de tarjeta no válido para crear hijo");
      }

      // Refrescar la jerarquía completa
      await onRefresh();

      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al crear elemento";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualiza un elemento existente basado en su tipo
   */
  const updateItem = async (
    card: CampamentoCardType,
    data: { titulo: string; descripcion: string }
  ): Promise<Vision | Meta | Objetivo | Mision | Tarea> => {
    setLoading(true);
    setError(null);

    try {
      let result: Vision | Meta | Objetivo | Mision | Tarea;

      if ("metas" in card) {
        // Actualizar Visión
        const visionData: UpdateVisionDTO = {
          id: card.id,
          titulo: data.titulo,
          descripcion: data.descripcion,
        };
        result = await updateVisionService(visionData);
      } else if ("visionId" in card && "objetivos" in card) {
        // Actualizar Meta
        const metaData: UpdateMetaDTO = {
          id: card.id,
          titulo: data.titulo,
          descripcion: data.descripcion,
        };
        result = await updateMeta(metaData);
      } else if ("metaId" in card && "misiones" in card) {
        // Actualizar Objetivo
        const objetivoData: UpdateObjetivoDTO = {
          id: card.id,
          titulo: data.titulo,
          descripcion: data.descripcion,
        };
        result = await updateObjetivo(objetivoData);
      } else if ("objetivoId" in card && "tareas" in card) {
        // Actualizar Misión
        const misionData: UpdateMisionDTO = {
          id: card.id,
          titulo: data.titulo,
          descripcion: data.descripcion,
        };
        result = await updateMision(misionData);
      } else {
        // Actualizar Tarea
        const tareaData: UpdateTareaDTO = {
          id: card.id,
          titulo: data.titulo,
          descripcion: data.descripcion,
        };
        result = await updateTarea(tareaData);
      }

      // Refrescar la jerarquía completa
      await onRefresh();

      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al actualizar elemento";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Elimina un elemento basado en su tipo
   */
  const deleteItem = async (card: CampamentoCardType): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      if ("metas" in card) {
        // Eliminar Visión
        await deleteVision(card.id);
      } else if ("visionId" in card && "objetivos" in card) {
        // Eliminar Meta
        await deleteMeta(card.id);
      } else if ("metaId" in card && "misiones" in card) {
        // Eliminar Objetivo
        await deleteObjetivo(card.id);
      } else if ("objetivoId" in card && "tareas" in card) {
        // Eliminar Misión
        await deleteMision(card.id);
      } else {
        // Eliminar Tarea
        await deleteTarea(card.id);
      }

      // Refrescar la jerarquía completa
      await onRefresh();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al eliminar elemento";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getCardType,
    getChildType,
    createItem,
    updateItem,
    deleteItem,
  };
}
