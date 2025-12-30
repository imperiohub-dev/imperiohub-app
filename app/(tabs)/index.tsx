import { View, StyleSheet, Image, Pressable, ScrollView, Alert } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/contexts/AuthContext";
import { useVisiones } from "@/contexts/VisionesContext";
import { Target } from "lucide-react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  Colors,
  Spacing,
  FontSizes,
  FontWeights,
  BorderRadius,
  IconSizes,
  BrandColors,
} from "@/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import CreateItemModal, { type ItemType } from "@/components/metas/CreateItemModal";
import HierarchyCard, { type HierarchyItem } from "@/components/metas/HierarchyCard";
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

export default function HomeScreen() {
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
  // Renderizado recursivo de jerarquía
  // ============================================

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

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ThemedView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header con foto de perfil */}
          <View style={styles.header}>
            {userInfo?.picture ? (
              <Image
                source={{ uri: userInfo.picture }}
                style={styles.avatar}
                accessibilityLabel="Foto de perfil"
              />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <ThemedText style={styles.avatarText}>
                  {userInfo?.nombre?.charAt(0).toUpperCase() || "U"}
                </ThemedText>
              </View>
            )}
            <View style={styles.greetingContainer}>
              <ThemedText style={styles.greeting}>
                Hola, {userInfo?.nombre || "Usuario"}!
              </ThemedText>
              <ThemedText
                style={[styles.subGreeting, { color: colors.textSecondary }]}
              >
                Bienvenido a tu espacio de metas
              </ThemedText>
            </View>
          </View>

          {/* Empty State - Usuario sin visiones */}
          {!hasVisiones && !loading && (
            <View style={styles.emptyStateContainer}>
              {/* Ícono grande */}
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: colors.backgroundSecondary },
                ]}
              >
                <Target
                  size={IconSizes.xxl}
                  color={BrandColors.primary}
                  strokeWidth={1.5}
                />
              </View>

              {/* Título */}
              <ThemedText style={styles.emptyTitle}>
                Comienza tu viaje hacia tus metas
              </ThemedText>

              {/* Descripción */}
              <ThemedText
                style={[
                  styles.emptyDescription,
                  { color: colors.textSecondary },
                ]}
              >
                Crea tu primera Visión para organizar tus objetivos y alcanzar
                tus sueños
              </ThemedText>

              {/* Botón principal */}
              <Pressable
                style={({ pressed }) => [
                  styles.primaryButton,
                  { backgroundColor: BrandColors.primary },
                  pressed && styles.buttonPressed,
                ]}
                onPress={() => handleCreate("vision")}
              >
                <ThemedText style={styles.buttonText}>
                  Crear mi primera Visión
                </ThemedText>
              </Pressable>
            </View>
          )}

          {/* Lista de Visiones con jerarquía completa */}
          {hasVisiones && (
            <View style={styles.visionesContainer}>
              <View style={styles.visionesHeader}>
                <ThemedText style={styles.visionesTitle}>
                  Mis Visiones
                </ThemedText>
                <Pressable onPress={() => handleCreate("vision")}>
                  <ThemedText
                    style={[styles.addButton, { color: BrandColors.primary }]}
                  >
                    + Nueva
                  </ThemedText>
                </Pressable>
              </View>

              {/* Renderizado recursivo de toda la jerarquía */}
              {visiones.map((vision) => {
                const config = HIERARCHY_CONFIG.vision;
                return (
                  <HierarchyCard
                    key={vision.id}
                    item={vision}
                    icon={config.icon}
                    iconColor={config.iconColor}
                    childrenKey={config.childrenKey}
                    childrenLabel={config.childrenLabel}
                    createButtonLabel={config.createButtonLabel}
                    onToggleDone={(id, isDone) => handleToggleDone(id, isDone, "vision")}
                    onCreateChild={(parentId) => handleCreate("meta", parentId)}
                    renderChild={renderMeta}
                    level={0}
                  />
                );
              })}
            </View>
          )}
        </ScrollView>
      </ThemedView>

      {/* Modal universal para crear cualquier item */}
      <CreateItemModal
        visible={modalState.visible}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        itemType={modalState.type}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
  },
  avatarPlaceholder: {
    backgroundColor: BrandColors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: "#fff",
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.xxs,
  },
  subGreeting: {
    fontSize: FontSizes.sm,
  },

  // Empty State
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxxl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  emptyTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    textAlign: "center",
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  emptyDescription: {
    fontSize: FontSizes.md,
    textAlign: "center",
    marginBottom: Spacing.xxl,
    lineHeight: FontSizes.md * 1.5,
    paddingHorizontal: Spacing.lg,
  },

  // Botón
  primaryButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    minWidth: 200,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: "#fff",
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },

  // Lista de Visiones
  visionesContainer: {
    padding: Spacing.lg,
  },
  visionesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  visionesTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
  },
  addButton: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
});
