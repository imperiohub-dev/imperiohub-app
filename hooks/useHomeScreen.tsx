import { useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { useVisiones } from "@/contexts/VisionesContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { type ItemType } from "@/components/metas/CreateItemModal";
import { type HierarchyItem } from "@/components/metas/HierarchyCard";
import HierarchyCard from "@/components/metas/HierarchyCard";
import { HIERARCHY_CONFIG } from "@/constants/hierarchy";
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

export const useHomeScreen = () => {
  const { userInfo } = useAuth();
  const { visiones, loading, addVision, refreshVisiones } = useVisiones();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  // Determinar si tiene visiones
  const hasVisiones = visiones.length > 0;

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
    } catch (error) {
      console.error(`Error al actualizar ${level}:`, error);
      Alert.alert("Error", `No se pudo actualizar el estado.`);
    }
  };

  // ============================================
  // Funciones de renderizado recursivo
  // ============================================

  const renderTarea = (tarea: HierarchyItem) => {
    const config = HIERARCHY_CONFIG.tarea;
    return (
      <HierarchyCard
        key={tarea.id}
        item={tarea}
        icon={config.icon}
        iconColor={config.iconColor}
        onToggleDone={(id, isDone) => handleToggleDone(id, isDone, "tarea")}
        level={4}
      />
    );
  };

  const renderMision = (mision: HierarchyItem) => {
    const config = HIERARCHY_CONFIG.mision;
    return (
      <HierarchyCard
        key={mision.id}
        item={mision}
        icon={config.icon}
        iconColor={config.iconColor}
        childrenKey={config.childrenKey}
        childrenLabel={config.childrenLabel}
        createButtonLabel={config.createButtonLabel}
        onToggleDone={(id, isDone) => handleToggleDone(id, isDone, "mision")}
        onCreateChild={(parentId) => handleCreate("tarea", parentId)}
        renderChild={renderTarea}
        level={3}
      />
    );
  };

  const renderObjetivo = (objetivo: HierarchyItem) => {
    const config = HIERARCHY_CONFIG.objetivo;
    return (
      <HierarchyCard
        key={objetivo.id}
        item={objetivo}
        icon={config.icon}
        iconColor={config.iconColor}
        childrenKey={config.childrenKey}
        childrenLabel={config.childrenLabel}
        createButtonLabel={config.createButtonLabel}
        onToggleDone={(id, isDone) => handleToggleDone(id, isDone, "objetivo")}
        onCreateChild={(parentId) => handleCreate("mision", parentId)}
        renderChild={renderMision}
        level={2}
      />
    );
  };

  const renderMeta = (meta: HierarchyItem) => {
    const config = HIERARCHY_CONFIG.meta;
    return (
      <HierarchyCard
        key={meta.id}
        item={meta}
        icon={config.icon}
        iconColor={config.iconColor}
        childrenKey={config.childrenKey}
        childrenLabel={config.childrenLabel}
        createButtonLabel={config.createButtonLabel}
        onToggleDone={(id, isDone) => handleToggleDone(id, isDone, "meta")}
        onCreateChild={(parentId) => handleCreate("objetivo", parentId)}
        renderChild={renderObjetivo}
        level={1}
      />
    );
  };

  return {
    // User info
    userInfo,
    colors,

    // Visiones state
    visiones,
    loading,
    hasVisiones,

    // Modal state
    modalState,

    // Handlers
    handleCreate,
    handleModalClose,
    handleModalSubmit,
    handleToggleDone,

    // Render functions
    renderMeta,
  };
};
