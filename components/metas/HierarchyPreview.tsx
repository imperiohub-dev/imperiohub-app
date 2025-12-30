import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { CheckCircle, Circle, ChevronRight, type LucideIcon } from "lucide-react-native";
import {
  Colors,
  Spacing,
  FontSizes,
  FontWeights,
  BorderRadius,
  IconSizes,
  BrandColors,
} from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { HierarchyItem } from "./HierarchyCard";

interface HierarchyPreviewProps {
  item: HierarchyItem;
  icon: LucideIcon;
  iconColor: string;
  onPress: (item: HierarchyItem) => void;
}

/**
 * Componente compacto para mostrar un item de jerarquía sin recursión.
 * Se usa para mostrar hijos en una lista simple y navegable.
 */
export function HierarchyPreview({
  item,
  icon: Icon,
  iconColor,
  onPress,
}: HierarchyPreviewProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
        },
        pressed && styles.pressed,
        item.isDone && styles.done,
      ]}
      onPress={() => onPress(item)}
    >
      {/* Checkbox isDone */}
      <View style={styles.checkboxContainer}>
        {item.isDone ? (
          <CheckCircle
            size={IconSizes.sm}
            color={BrandColors.success}
            fill={BrandColors.success}
          />
        ) : (
          <Circle size={IconSizes.sm} color={colors.icon} />
        )}
      </View>

      {/* Icono del tipo */}
      <View style={styles.iconContainer}>
        <Icon
          size={IconSizes.sm}
          color={item.isDone ? colors.textMuted : iconColor}
          strokeWidth={2}
        />
      </View>

      {/* Contenido */}
      <View style={styles.content}>
        <ThemedText
          style={[
            styles.title,
            item.isDone && styles.doneText,
            item.isDone && { color: colors.textMuted },
          ]}
          numberOfLines={1}
        >
          {item.titulo}
        </ThemedText>
        {item.descripcion && (
          <ThemedText
            style={[
              styles.description,
              { color: colors.textSecondary },
              item.isDone && styles.doneText,
            ]}
            numberOfLines={1}
          >
            {item.descripcion}
          </ThemedText>
        )}
      </View>

      {/* Chevron para indicar navegación */}
      <ChevronRight size={IconSizes.sm} color={colors.icon} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.sm,
    gap: Spacing.xs,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.xs,
  },
  pressed: {
    opacity: 0.7,
  },
  done: {
    opacity: 0.6,
  },
  checkboxContainer: {
    padding: Spacing.xxs,
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  description: {
    fontSize: FontSizes.xs,
    marginTop: 2,
  },
  doneText: {
    textDecorationLine: "line-through",
  },
});
