import React, { useState, ReactNode } from "react";
import { View, StyleSheet, Pressable, LayoutAnimation, Platform, UIManager } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ChevronDown, ChevronRight, LucideIcon } from "lucide-react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  Colors,
  Spacing,
  FontSizes,
  FontWeights,
  BorderRadius,
  IconSizes,
} from "@/constants/theme";

// Habilitar LayoutAnimation en Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface CollapsibleCardProps {
  title: string;
  icon: LucideIcon;
  iconColor?: string;
  description?: string;
  children?: ReactNode;
  defaultExpanded?: boolean;
  onPress?: () => void;
  showChevron?: boolean;
  rightElement?: ReactNode;
}

export default function CollapsibleCard({
  title,
  icon: Icon,
  iconColor,
  description,
  children,
  defaultExpanded = false,
  onPress,
  showChevron = true,
  rightElement,
}: CollapsibleCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    // Animación suave al expandir/colapsar
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (children) {
      handleToggle();
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      {/* Header (siempre visible) */}
      <Pressable
        style={({ pressed }) => [
          styles.header,
          pressed && styles.headerPressed,
        ]}
        onPress={handlePress}
      >
        {/* Ícono */}
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: iconColor
                ? `${iconColor}15`
                : colors.backgroundSecondary,
            },
          ]}
        >
          <Icon
            size={IconSizes.md}
            color={iconColor || colors.icon}
            strokeWidth={2}
          />
        </View>

        {/* Contenido */}
        <View style={styles.content}>
          <ThemedText style={styles.title}>{title}</ThemedText>
          {description && (
            <ThemedText
              style={[styles.description, { color: colors.textSecondary }]}
              numberOfLines={isExpanded ? undefined : 1}
            >
              {description}
            </ThemedText>
          )}
        </View>

        {/* Elemento derecho (chevron o custom) */}
        {rightElement ? (
          <View style={styles.rightElement}>{rightElement}</View>
        ) : (
          showChevron &&
          children && (
            <View style={styles.chevron}>
              {isExpanded ? (
                <ChevronDown size={IconSizes.md} color={colors.textMuted} />
              ) : (
                <ChevronRight size={IconSizes.md} color={colors.textMuted} />
              )}
            </View>
          )
        )}
      </Pressable>

      {/* Contenido colapsable */}
      {isExpanded && children && (
        <View
          style={[
            styles.expandedContent,
            { borderTopColor: colors.border },
          ]}
        >
          {children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
  },
  headerPressed: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.xxs,
  },
  description: {
    fontSize: FontSizes.sm,
    lineHeight: FontSizes.sm * 1.3,
  },
  chevron: {
    marginLeft: Spacing.sm,
  },
  rightElement: {
    marginLeft: Spacing.sm,
  },
  expandedContent: {
    borderTopWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
});
