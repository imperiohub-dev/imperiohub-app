import { useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { useVisiones } from "@/contexts/VisionesContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { type ItemType } from "@/components/metas/CreateItemModal";
import { type HierarchyItem } from "@/components/metas/HierarchyCard";
import {
  createMeta,
  createObjetivo,
  createMision,
  createTarea,
  updateVision,
  updateMeta,
  updateObjetivo,
  updateMision,
  updateTarea,
} from "@/service/api";

type ViewType = "vision" | "meta" | "objetivo" | "mision";

export const useHomeScreen = () => {
  const { userInfo } = useAuth();
  const { visiones, loading, addVision, refreshVisiones } = useVisiones();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  // Determinar si tiene visiones
  const hasVisiones = visiones.length > 0;

  // Estado para navegación entre vistas
  const [currentView, setCurrentView] = useState<ViewType>("vision");
  const [selectedMeta, setSelectedMeta] = useState<HierarchyItem | null>(null);
  const [selectedObjetivo, setSelectedObjetivo] = useState<HierarchyItem | null>(null);
  const [selectedMision, setSelectedMision] = useState<HierarchyItem | null>(null);

  // Estado para controlar modales
  const [modalState, setModalState] = useState<{
    visible: boolean;
    type: ItemType;
    parentId: string | null;
  }>({
    visible: false,
    type: "vision",
    parentId: null,
  });

  // ============================================
  // Funciones auxiliares
  // ============================================

  /**
   * Actualiza los items seleccionados con la data fresca de visiones
   * Esto es necesario después de crear/actualizar items para que los hijos se muestren
   */
  const updateSelectedItems = () => {
    // Actualizar meta seleccionada si existe
    if (selectedMeta) {
      const updatedMeta = visiones
        .flatMap((v) => v.metas || [])
        .find((m) => m.id === selectedMeta.id);
      if (updatedMeta) {
        setSelectedMeta(updatedMeta as HierarchyItem);
      }
    }

    // Actualizar objetivo seleccionado si existe
    if (selectedObjetivo) {
      const updatedObjetivo = visiones
        .flatMap((v) => v.metas || [])
        .flatMap((m) => m.objetivos || [])
        .find((o) => o.id === selectedObjetivo.id);
      if (updatedObjetivo) {
        setSelectedObjetivo(updatedObjetivo as HierarchyItem);
      }
    }

    // Actualizar misión seleccionada si existe
    if (selectedMision) {
      const updatedMision = visiones
        .flatMap((v) => v.metas || [])
        .flatMap((m) => m.objetivos || [])
        .flatMap((o) => o.misiones || [])
        .find((mi) => mi.id === selectedMision.id);
      if (updatedMision) {
        setSelectedMision(updatedMision as HierarchyItem);
      }
    }
  };

  // ============================================
  // Funciones de creación genéricas
  // ============================================

  const handleCreate = (type: ItemType, parentId: string | null = null) => {
    setModalState({ visible: true, type, parentId });
  };

  const handleModalClose = () => {
    setModalState({ visible: false, type: "vision", parentId: null });
  };

  const handleModalSubmit = async (data: { titulo: string; descripcion: string }) => {
    const { type, parentId } = modalState;

    try {
      let result;

      switch (type) {
        case "vision":
          result = await addVision(data);
          break;
        case "meta":
          if (!parentId) throw new Error("Parent ID requerido para Meta");
          result = await createMeta({ ...data, visionId: parentId });
          break;
        case "objetivo":
          if (!parentId) throw new Error("Parent ID requerido para Objetivo");
          result = await createObjetivo({ ...data, metaId: parentId });
          break;
        case "mision":
          if (!parentId) throw new Error("Parent ID requerido para Misión");
          result = await createMision({ ...data, objetivoId: parentId });
          break;
        case "tarea":
          if (!parentId) throw new Error("Parent ID requerido para Tarea");
          result = await createTarea({ ...data, misionId: parentId });
          break;
      }

      console.log(`${type} creado exitosamente:`, result);
      Alert.alert("Éxito", `Tu ${type} ha sido creado exitosamente`);

      // Refrescar para obtener datos actualizados
      await refreshVisiones();

      // Actualizar items seleccionados con data fresca
      updateSelectedItems();
    } catch (error) {
      console.error(`Error al crear ${type}:`, error);
      Alert.alert("Error", `No se pudo crear el ${type}. Intenta nuevamente.`);
    }
  };

  // ============================================
  // Funciones de toggle isDone
  // ============================================

  const handleToggleDone = async (
    itemId: string,
    isDone: boolean,
    level: "vision" | "meta" | "objetivo" | "mision" | "tarea"
  ) => {
    try {
      switch (level) {
        case "vision":
          await updateVision({ id: itemId, isDone });
          break;
        case "meta":
          await updateMeta({ id: itemId, isDone });
          break;
        case "objetivo":
          await updateObjetivo({ id: itemId, isDone });
          break;
        case "mision":
          await updateMision({ id: itemId, isDone });
          break;
        case "tarea":
          await updateTarea({ id: itemId, isDone });
          break;
      }

      console.log(`${level} marcado como ${isDone ? "hecho" : "pendiente"}`);

      // Refrescar para obtener datos actualizados
      await refreshVisiones();

      // Actualizar items seleccionados con data fresca
      updateSelectedItems();
    } catch (error) {
      console.error(`Error al actualizar ${level}:`, error);
      Alert.alert("Error", `No se pudo actualizar el estado.`);
    }
  };

  // ============================================
  // Funciones de navegación
  // ============================================

  const handleMetaPress = (meta: HierarchyItem) => {
    setSelectedMeta(meta);
    setCurrentView("meta");
  };

  const handleObjetivoPress = (objetivo: HierarchyItem) => {
    setSelectedObjetivo(objetivo);
    setCurrentView("objetivo");
  };

  const handleMisionPress = (mision: HierarchyItem) => {
    setSelectedMision(mision);
    setCurrentView("mision");
  };

  const handleBackToVisiones = () => {
    setCurrentView("vision");
    setSelectedMeta(null);
    setSelectedObjetivo(null);
    setSelectedMision(null);
  };

  const handleBackToMeta = () => {
    setCurrentView("meta");
    setSelectedObjetivo(null);
    setSelectedMision(null);
  };

  const handleBackToObjetivo = () => {
    setCurrentView("objetivo");
    setSelectedMision(null);
  };

  return {
    // User info
    userInfo,
    colors,

    // Visiones state
    visiones,
    loading,
    hasVisiones,

    // Navigation state
    currentView,
    selectedMeta,
    selectedObjetivo,
    selectedMision,

    // Modal state
    modalState,

    // Handlers
    handleCreate,
    handleModalClose,
    handleModalSubmit,
    handleToggleDone,

    // Navigation handlers
    handleMetaPress,
    handleObjetivoPress,
    handleMisionPress,
    handleBackToVisiones,
    handleBackToMeta,
    handleBackToObjetivo,
  };
};
