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

interface VisionsListProps {
  visiones: HierarchyItem[];
  onCreateVision: () => void;
  onToggleDone: (id: string, isDone: boolean, level: "vision") => void;
  onCreateMeta: (visionId: string) => void;
  onMetaPress: (meta: HierarchyItem) => void;
}

export default function VisionsList({
  visiones,
  onCreateVision,
  onToggleDone,
  onCreateMeta,
  onMetaPress,
}: VisionsListProps) {
  const visionConfig = HIERARCHY_CONFIG.vision;
  const metaConfig = HIERARCHY_CONFIG.meta;

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

      {visiones.map((vision) => (
        <HierarchyCard
          key={vision.id}
          item={vision}
          icon={visionConfig.icon}
          iconColor={visionConfig.iconColor}
          childrenKey={visionConfig.childrenKey}
          childrenLabel={visionConfig.childrenLabel}
          createButtonLabel={visionConfig.createButtonLabel}
          childIcon={metaConfig.icon}
          childIconColor={metaConfig.iconColor}
          onToggleDone={(id, isDone) => onToggleDone(id, isDone, "vision")}
          onCreateChild={onCreateMeta}
          onChildPress={onMetaPress}
          level={0}
        />
      ))}
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
