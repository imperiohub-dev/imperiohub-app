import React from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { ThemedText } from "@/components/themed-text";
import HierarchyCard from "./HierarchyCard";
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
import { ChevronLeft, Compass } from "lucide-react-native";

interface ObjetivoDetailViewProps {
  objetivo: HierarchyItem;
  onBack: () => void;
  onToggleDone: (id: string, isDone: boolean, level: "mision") => void;
  onCreateMision: (objetivoId: string) => void;
  onMisionPress: (mision: HierarchyItem) => void;
}

/**
 * Vista de detalle de un Objetivo, muestra sus Misiones
 */
export default function ObjetivoDetailView({
  objetivo,
  onBack,
  onToggleDone,
  onCreateMision,
  onMisionPress,
}: ObjetivoDetailViewProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const misionConfig = HIERARCHY_CONFIG.mision;
  const tareaConfig = HIERARCHY_CONFIG.tarea;

  const misiones = (objetivo.misiones as HierarchyItem[]) || [];

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
        {/* Información del Objetivo */}
        <View style={styles.objetivoInfo}>
          <View style={styles.objetivoHeader}>
            <Compass size={32} color={HIERARCHY_CONFIG.objetivo.iconColor} />
            <ThemedText style={styles.objetivoTitle}>
              {objetivo.titulo}
            </ThemedText>
          </View>
          {objetivo.descripcion && (
            <ThemedText
              style={[
                styles.objetivoDescription,
                { color: colors.textSecondary },
              ]}
            >
              {objetivo.descripcion}
            </ThemedText>
          )}
        </View>

        {/* Botón crear misión */}
        <View style={styles.misionesHeader}>
          <ThemedText style={styles.misionesTitle}>
            Misiones ({misiones.length})
          </ThemedText>
          <Pressable onPress={() => onCreateMision(objetivo.id)}>
            <ThemedText
              style={[styles.addButton, { color: BrandColors.primary }]}
            >
              + Nueva Misión
            </ThemedText>
          </Pressable>
        </View>

        {/* Lista de Misiones */}
        <View style={styles.misionesList}>
          {misiones.length === 0 ? (
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
                No hay misiones aún. ¡Crea la primera!
              </ThemedText>
            </View>
          ) : (
            misiones.map((mision) => (
              <HierarchyCard
                key={mision.id}
                item={mision}
                icon={misionConfig.icon}
                iconColor={misionConfig.iconColor}
                childrenKey={misionConfig.childrenKey}
                childrenLabel={misionConfig.childrenLabel}
                createButtonLabel={misionConfig.createButtonLabel}
                childIcon={tareaConfig.icon}
                childIconColor={tareaConfig.iconColor}
                onToggleDone={(id, isDone) => onToggleDone(id, isDone, "mision")}
                onChildPress={onMisionPress}
                level={0}
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
  objetivoInfo: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  objetivoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  objetivoTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    flex: 1,
  },
  objetivoDescription: {
    fontSize: FontSizes.md,
    lineHeight: FontSizes.md * 1.5,
  },
  misionesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  misionesTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
  },
  addButton: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
  misionesList: {
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
