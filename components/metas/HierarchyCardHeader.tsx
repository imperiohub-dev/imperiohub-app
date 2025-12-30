import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { ThemedText } from "@/components/themed-text";
import {
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Circle,
  type LucideIcon,
} from "lucide-react-native";
import {
  Colors,
  Spacing,
  FontSizes,
  FontWeights,
  IconSizes,
  BrandColors,
} from "@/constants/theme";
import type { HierarchyItem } from "./HierarchyCard";

interface HierarchyCardHeaderProps {
  item: HierarchyItem;
  icon: LucideIcon;
  iconColor: string;
  colors: (typeof Colors)["light"];
  isExpanded: boolean;
  canHaveChildren: boolean;
  onHeaderPress: () => void;
  onToggleDone: (e: any) => void;
}

export function HierarchyCardHeader({
  item,
  icon: Icon,
  iconColor,
  colors,
  isExpanded,
  canHaveChildren,
  onHeaderPress,
  onToggleDone,
}: HierarchyCardHeaderProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.header,
        pressed && styles.headerPressed,
        item.isDone && styles.doneHeader,
      ]}
      onPress={onHeaderPress}
    >
      {/* Checkbox isDone */}
      <Pressable onPress={onToggleDone} style={styles.checkboxContainer}>
        {item.isDone ? (
          <CheckCircle
            size={IconSizes.md}
            color={BrandColors.success}
            fill={BrandColors.success}
          />
        ) : (
          <Circle size={IconSizes.md} color={colors.icon} />
        )}
      </Pressable>

      {/* Icono del tipo */}
      <View style={styles.iconContainer}>
        <Icon
          size={IconSizes.md}
          color={item.isDone ? colors.textMuted : iconColor}
          strokeWidth={2}
        />
      </View>

      {/* Contenido */}
      <View style={styles.content}>
        <ThemedText
          style={[
            styles.titulo,
            item.isDone && styles.doneText,
            item.isDone && { color: colors.textMuted },
          ]}
        >
          {item.titulo}
        </ThemedText>
        {item.descripcion && (
          <ThemedText
            style={[
              styles.descripcion,
              { color: colors.textSecondary },
              item.isDone && styles.doneText,
            ]}
            numberOfLines={2}
          >
            {item.descripcion}
          </ThemedText>
        )}
      </View>

      {/* Chevron (solo si puede tener hijos) */}
      {canHaveChildren && (
        <View style={styles.chevronContainer}>
          {isExpanded ? (
            <ChevronDown size={IconSizes.sm} color={colors.icon} />
          ) : (
            <ChevronRight size={IconSizes.sm} color={colors.icon} />
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  headerPressed: {
    opacity: 0.7,
  },
  doneHeader: {
    opacity: 0.6,
  },
  checkboxContainer: {
    padding: Spacing.xxs,
  },
  iconContainer: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  titulo: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.xxs,
  },
  descripcion: {
    fontSize: FontSizes.sm,
    lineHeight: FontSizes.sm * 1.4,
  },
  doneText: {
    textDecorationLine: "line-through",
  },
  chevronContainer: {
    padding: Spacing.xs,
  },
});
