import { View, StyleSheet, Pressable } from "react-native";
import { ThemedText } from "@/components/themed-text";
import HierarchyCard from "@/components/metas/HierarchyCard";
import { HIERARCHY_CONFIG } from "@/constants/hierarchy";
import {
  Spacing,
  FontSizes,
  FontWeights,
  BrandColors,
} from "@/constants/theme";
import { type HierarchyItem } from "@/components/metas/HierarchyCard";
import { JSX } from "react";

interface VisionsListProps {
  visiones: HierarchyItem[];
  onCreateVision: () => void;
  onToggleDone: (id: string, isDone: boolean, level: "vision") => void;
  onCreateMeta: (visionId: string) => void;
  renderMeta: (meta: HierarchyItem) => JSX.Element;
}

export default function VisionsList({
  visiones,
  onCreateVision,
  onToggleDone,
  onCreateMeta,
  renderMeta,
}: VisionsListProps) {
  return (
    <View style={styles.visionesContainer}>
      <View style={styles.visionesHeader}>
        <ThemedText style={styles.visionesTitle}>Mis Visiones</ThemedText>
        <Pressable onPress={onCreateVision}>
          <ThemedText
            style={[styles.addButton, { color: BrandColors.primary }]}
          >
            + Nueva
          </ThemedText>
        </Pressable>
      </View>

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
            onToggleDone={(id, isDone) => onToggleDone(id, isDone, "vision")}
            onCreateChild={onCreateMeta}
            renderChild={renderMeta}
            level={0}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
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
