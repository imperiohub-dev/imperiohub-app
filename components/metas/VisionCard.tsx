import React from "react";
import { View, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { ThemedText } from "@/components/themed-text";
import CollapsibleCard from "./CollapsibleCard";
import { Target, Flag, Plus } from "lucide-react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  Colors,
  Spacing,
  FontSizes,
  FontWeights,
  BrandColors,
  IconSizes,
} from "@/constants/theme";
import type { Vision, Meta } from "@/service/api";

interface VisionCardProps {
  vision: Vision;
  metas?: Meta[];
  loadingMetas?: boolean;
  onCreateMeta?: (visionId: string) => void;
  onMetaPress?: (meta: Meta) => void;
}

export default function VisionCard({
  vision,
  metas = [],
  loadingMetas = false,
  onCreateMeta,
  onMetaPress,
}: VisionCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <CollapsibleCard
      title={vision.titulo}
      icon={Target}
      iconColor={BrandColors.primary}
      description={vision.descripcion || undefined}
      defaultExpanded={false}
    >
      {/* Contenido expandido: Metas */}
      <View style={styles.metasContainer}>
        {/* Header de Metas */}
        <View style={styles.metasHeader}>
          <ThemedText style={styles.metasTitle}>
            Metas ({metas.length})
          </ThemedText>
          {onCreateMeta && (
            <Pressable
              style={styles.addMetaButton}
              onPress={() => onCreateMeta(vision.id)}
            >
              <Plus size={IconSizes.sm} color={BrandColors.primary} />
              <ThemedText
                style={[styles.addMetaText, { color: BrandColors.primary }]}
              >
                Nueva Meta
              </ThemedText>
            </Pressable>
          )}
        </View>

        {/* Loading */}
        {loadingMetas && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={BrandColors.primary} />
            <ThemedText
              style={[styles.loadingText, { color: colors.textMuted }]}
            >
              Cargando metas...
            </ThemedText>
          </View>
        )}

        {/* Lista de Metas */}
        {!loadingMetas && metas.length === 0 && (
          <ThemedText
            style={[styles.emptyText, { color: colors.textSecondary }]}
          >
            No hay metas aún. Crea tu primera meta!
          </ThemedText>
        )}

        {!loadingMetas &&
          metas.map((meta) => (
            <Pressable
              key={meta.id}
              style={({ pressed }) => [
                styles.metaItem,
                {
                  backgroundColor: colors.backgroundSecondary,
                },
                pressed && styles.metaItemPressed,
              ]}
              onPress={() => onMetaPress?.(meta)}
            >
              <View
                style={[
                  styles.metaIconContainer,
                  { backgroundColor: `${BrandColors.secondary}15` },
                ]}
              >
                <Flag
                  size={IconSizes.sm}
                  color={BrandColors.secondary}
                  strokeWidth={2}
                />
              </View>
              <View style={styles.metaContent}>
                <ThemedText style={styles.metaTitle}>{meta.titulo}</ThemedText>
                {meta.descripcion && (
                  <ThemedText
                    style={[
                      styles.metaDescription,
                      { color: colors.textSecondary },
                    ]}
                    numberOfLines={1}
                  >
                    {meta.descripcion}
                  </ThemedText>
                )}
              </View>
            </Pressable>
          ))}
      </View>
    </CollapsibleCard>
  );
}

const styles = StyleSheet.create({
  metasContainer: {
    paddingVertical: Spacing.xs,
  },
  metasHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  metasTitle: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
  },
  addMetaButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xxs,
  },
  addMetaText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  loadingText: {
    fontSize: FontSizes.sm,
  },
  emptyText: {
    fontSize: FontSizes.sm,
    textAlign: "center",
    padding: Spacing.md,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.sm,
    borderRadius: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  metaItemPressed: {
    opacity: 0.7,
  },
  metaIconContainer: {
    width: 32,
    height: 32,
    borderRadius: Spacing.sm,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.sm,
  },
  metaContent: {
    flex: 1,
  },
  metaTitle: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  metaDescription: {
    fontSize: FontSizes.xs,
    marginTop: Spacing.xxs,
  },
});
