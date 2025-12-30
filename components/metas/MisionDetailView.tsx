import React from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { HierarchyPreview } from "./HierarchyPreview";
import { HIERARCHY_CONFIG } from "@/constants/hierarchy";
import {
  Colors,
  Spacing,
  FontSizes,
  FontWeights,
  BorderRadius,
  BrandColors,
} from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { type HierarchyItem } from "./HierarchyCard";
import { ChevronLeft, Rocket } from "lucide-react-native";

interface MisionDetailViewProps {
  mision: HierarchyItem;
  onBack: () => void;
  onToggleDone: (id: string, isDone: boolean, level: "tarea") => void;
  onCreateTarea: (misionId: string) => void;
  onTareaPress?: (tarea: HierarchyItem) => void;
}

/**
 * Vista de detalle de una Misión, muestra sus Tareas
 * Las tareas son el nivel final, por lo que solo se muestran en preview simple
 */
export default function MisionDetailView({
  mision,
  onBack,
  onToggleDone,
  onCreateTarea,
  onTareaPress,
}: MisionDetailViewProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const tareaConfig = HIERARCHY_CONFIG.tarea;

  const tareas = (mision.tareas as HierarchyItem[]) || [];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header con botón de volver */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.text} />
          <ThemedText style={styles.backText}>Volver</ThemedText>
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Información de la Misión */}
        <View style={styles.misionInfo}>
          <View style={styles.misionHeader}>
            <Rocket size={32} color={HIERARCHY_CONFIG.mision.iconColor} />
            <ThemedText style={styles.misionTitle}>{mision.titulo}</ThemedText>
          </View>
          {mision.descripcion && (
            <ThemedText
              style={[
                styles.misionDescription,
                { color: colors.textSecondary },
              ]}
            >
              {mision.descripcion}
            </ThemedText>
          )}
        </View>

        {/* Botón crear tarea */}
        <View style={styles.tareasHeader}>
          <ThemedText style={styles.tareasTitle}>
            Tareas ({tareas.length})
          </ThemedText>
          <Pressable onPress={() => onCreateTarea(mision.id)}>
            <ThemedText
              style={[styles.addButton, { color: BrandColors.primary }]}
            >
              + Nueva Tarea
            </ThemedText>
          </Pressable>
        </View>

        {/* Lista de Tareas */}
        <View style={styles.tareasList}>
          {tareas.length === 0 ? (
            <View
              style={[
                styles.emptyState,
                {
                  backgroundColor: colors.backgroundSecondary,
                  borderColor: colors.border,
                },
              ]}
            >
              <ThemedText style={{ color: colors.textMuted }}>
                No hay tareas aún. ¡Crea la primera!
              </ThemedText>
            </View>
          ) : (
            tareas.map((tarea) => (
              <HierarchyPreview
                key={tarea.id}
                item={tarea}
                icon={tareaConfig.icon}
                iconColor={tareaConfig.iconColor}
                onPress={onTareaPress || (() => {})}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  backText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },
  scrollView: {
    flex: 1,
  },
  misionInfo: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  misionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  misionTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    flex: 1,
  },
  misionDescription: {
    fontSize: FontSizes.md,
    lineHeight: FontSizes.md * 1.5,
  },
  tareasHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  tareasTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
  },
  addButton: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
  tareasList: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  emptyState: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderStyle: "dashed",
    alignItems: "center",
  },
});
