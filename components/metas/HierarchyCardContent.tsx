import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { ThemedText } from "@/components/themed-text";
import {
  Colors,
  Spacing,
  FontSizes,
  FontWeights,
  BorderRadius,
  BrandColors,
} from "@/constants/theme";
import type { HierarchyItem } from "./HierarchyCard";

interface HierarchyCardContentProps {
  childrenLabel: string;
  createButtonLabel: string;
  childrenItems: HierarchyItem[];
  colors: (typeof Colors)["light"];
  loadingChildren: boolean;
  onCreateChild?: (parentId: string) => void;
  renderChild?: (child: HierarchyItem) => React.ReactNode;
}

export function HierarchyCardContent({
  childrenLabel,
  createButtonLabel,
  childrenItems,
  colors,
  loadingChildren,
  onCreateChild,
  renderChild,
}: HierarchyCardContentProps) {
  return (
    <View style={styles.expandedContent}>
      {/* Header de hijos con botón crear */}
      <View style={styles.childrenHeader}>
        <ThemedText style={[styles.childrenLabel, { color: colors.text }]}>
          {childrenLabel} ({childrenItems.length})
        </ThemedText>
        {onCreateChild && (
          <Pressable onPress={onCreateChild}>
            <ThemedText
              style={[styles.createButton, { color: BrandColors.primary }]}
            >
              {createButtonLabel}
            </ThemedText>
          </Pressable>
        )}
      </View>

      {/* Lista de hijos */}
      {loadingChildren ? (
        <View style={styles.loadingContainer}>
          <ThemedText style={{ color: colors.textMuted }}>
            Cargando...
          </ThemedText>
        </View>
      ) : childrenItems.length === 0 ? (
        <View
          style={[
            styles.emptyState,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
            },
          ]}
        >
          <ThemedText style={[styles.emptyText, { color: colors.textMuted }]}>
            No hay {childrenLabel.toLowerCase()} aún
          </ThemedText>
        </View>
      ) : (
        <View style={styles.childrenList}>
          {childrenItems.map((child) => (
            <View key={child.id}>
              {renderChild ? renderChild(child) : null}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  expandedContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  childrenHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  childrenLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
  },
  createButton: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
  },
  loadingContainer: {
    padding: Spacing.lg,
    alignItems: "center",
  },
  emptyState: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderStyle: "dashed",
    alignItems: "center",
  },
  emptyText: {
    fontSize: FontSizes.sm,
  },
  childrenList: {
    gap: Spacing.xs,
  },
});
