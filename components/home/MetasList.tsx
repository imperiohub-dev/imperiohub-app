import { View, StyleSheet, Pressable } from "react-native";
import { ThemedText } from "@/components/themed-text";
import HierarchyCard from "@/components/metas/HierarchyCard";
import { HIERARCHY_CONFIG, getChildLevel } from "@/constants/hierarchy";
import {
  Spacing,
  FontSizes,
  FontWeights,
  BrandColors,
} from "@/constants/theme";
import { type HierarchyItem } from "@/components/metas/HierarchyCard";

interface MetasListProps {
  metas: HierarchyItem[];
  onCreateMeta: () => void;
  onToggleDone: (id: string, isDone: boolean, level: "meta") => void;
  onCreateObjetivo: (metaId: string) => void;
  onObjetivoPress: (objetivo: HierarchyItem) => void;
}

export default function MetasList({
  metas,
  onCreateMeta,
  onToggleDone,
  onCreateObjetivo,
  onObjetivoPress,
}: MetasListProps) {
  const metaConfig = HIERARCHY_CONFIG.meta;
  const objetivoConfig = HIERARCHY_CONFIG.objetivo;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Mis Metas</ThemedText>
        <Pressable onPress={onCreateMeta}>
          <ThemedText
            style={[styles.addButton, { color: BrandColors.primary }]}
          >
            + Nueva
          </ThemedText>
        </Pressable>
      </View>

      {metas.map((meta) => (
        <HierarchyCard
          key={meta.id}
          item={meta}
          icon={metaConfig.icon}
          iconColor={metaConfig.iconColor}
          childrenKey={metaConfig.childrenKey}
          childrenLabel={metaConfig.childrenLabel}
          createButtonLabel={metaConfig.createButtonLabel}
          childIcon={objetivoConfig.icon}
          childIconColor={objetivoConfig.iconColor}
          onToggleDone={(id, isDone) => onToggleDone(id, isDone, "meta")}
          onCreateChild={onCreateObjetivo}
          onChildPress={onObjetivoPress}
          level={0}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
  },
  addButton: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
});
