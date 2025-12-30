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
import { ChevronLeft, Flag } from "lucide-react-native";

interface MetaDetailViewProps {
  meta: HierarchyItem;
  onBack: () => void;
  onToggleDone: (id: string, isDone: boolean, level: "objetivo") => void;
  onCreateObjetivo: (metaId: string) => void;
  onObjetivoPress: (objetivo: HierarchyItem) => void;
}

/**
 * Vista de detalle de una Meta, muestra sus Objetivos
 */
export default function MetaDetailView({
  meta,
  onBack,
  onToggleDone,
  onCreateObjetivo,
  onObjetivoPress,
}: MetaDetailViewProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const objetivoConfig = HIERARCHY_CONFIG.objetivo;
  const misionConfig = HIERARCHY_CONFIG.mision;

  const objetivos = (meta.objetivos as HierarchyItem[]) || [];

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
        {/* Información de la Meta */}
        <View style={styles.metaInfo}>
          <View style={styles.metaHeader}>
            <Flag size={32} color={HIERARCHY_CONFIG.meta.iconColor} />
            <ThemedText style={styles.metaTitle}>{meta.titulo}</ThemedText>
          </View>
          {meta.descripcion && (
            <ThemedText
              style={[styles.metaDescription, { color: colors.textSecondary }]}
            >
              {meta.descripcion}
            </ThemedText>
          )}
        </View>

        {/* Botón crear objetivo */}
        <View style={styles.objetivosHeader}>
          <ThemedText style={styles.objetivosTitle}>
            Objetivos ({objetivos.length})
          </ThemedText>
          <Pressable onPress={() => onCreateObjetivo(meta.id)}>
            <ThemedText
              style={[styles.addButton, { color: BrandColors.primary }]}
            >
              + Nuevo Objetivo
            </ThemedText>
          </Pressable>
        </View>

        {/* Lista de Objetivos */}
        <View style={styles.objetivosList}>
          {objetivos.length === 0 ? (
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
                No hay objetivos aún. ¡Crea el primero!
              </ThemedText>
            </View>
          ) : (
            objetivos.map((objetivo) => (
              <HierarchyCard
                key={objetivo.id}
                item={objetivo}
                icon={objetivoConfig.icon}
                iconColor={objetivoConfig.iconColor}
                childrenKey={objetivoConfig.childrenKey}
                childrenLabel={objetivoConfig.childrenLabel}
                createButtonLabel={objetivoConfig.createButtonLabel}
                childIcon={misionConfig.icon}
                childIconColor={misionConfig.iconColor}
                onToggleDone={(id, isDone) => onToggleDone(id, isDone, "objetivo")}
                onChildPress={onObjetivoPress}
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
  metaInfo: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  metaHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  metaTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    flex: 1,
  },
  metaDescription: {
    fontSize: FontSizes.md,
    lineHeight: FontSizes.md * 1.5,
  },
  objetivosHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  objetivosTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
  },
  addButton: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
  objetivosList: {
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
