import { View, StyleSheet, Pressable } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Target } from "lucide-react-native";
import {
  Spacing,
  FontSizes,
  FontWeights,
  BorderRadius,
  IconSizes,
  BrandColors,
} from "@/constants/theme";

interface EmptyStateViewProps {
  backgroundSecondaryColor: string;
  textSecondaryColor: string;
  onCreateVision: () => void;
}

export default function EmptyStateView({
  backgroundSecondaryColor,
  textSecondaryColor,
  onCreateVision,
}: EmptyStateViewProps) {
  return (
    <View style={styles.emptyStateContainer}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: backgroundSecondaryColor },
        ]}
      >
        <Target
          size={IconSizes.xxl}
          color={BrandColors.primary}
          strokeWidth={1.5}
        />
      </View>

      <ThemedText style={styles.emptyTitle}>
        Comienza tu viaje hacia tus metas
      </ThemedText>

      <ThemedText
        style={[styles.emptyDescription, { color: textSecondaryColor }]}
      >
        Crea tu primera Visión para organizar tus objetivos y alcanzar tus
        sueños
      </ThemedText>

      <Pressable
        style={({ pressed }) => [
          styles.primaryButton,
          { backgroundColor: BrandColors.primary },
          pressed && styles.buttonPressed,
        ]}
        onPress={onCreateVision}
      >
        <ThemedText style={styles.buttonText}>
          Crear mi primera Visión
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
