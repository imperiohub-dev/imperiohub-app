import React from "react";
import { View, StyleSheet, Platform, UIManager } from "react-native";
import { type LucideIcon } from "lucide-react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useHierarchyCard } from "@/hooks/useHierarchyCard";
import { HierarchyCardHeader } from "./HierarchyCardHeader";
import { HierarchyCardContent } from "./HierarchyCardContent";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";

// Habilitar animaciones en Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Tipo base para cualquier item de la jerarquía
export interface HierarchyItem {
  id: string;
  titulo: string;
  descripcion?: string | null;
  isDone?: boolean;
  [key: string]: any; // Para relaciones opcionales (metas, objetivos, etc.)
}

interface HierarchyCardProps {
  // Datos del item actual
  item: HierarchyItem;

  // Configuración visual
  icon: LucideIcon;
  iconColor: string;

  // Configuración de hijos
  childrenKey?: string; // 'metas', 'objetivos', 'misiones', 'tareas'
  childrenLabel?: string; // 'Metas', 'Objetivos', etc.
  createButtonLabel?: string; // '+ Nueva Meta', etc.

  // Callbacks
  onToggleDone?: (itemId: string, isDone: boolean) => void;
  onCreateChild?: (parentId: string) => void;
  onItemPress?: (item: HierarchyItem) => void;

  // Renderizado recursivo de hijos
  renderChild?: (child: HierarchyItem) => React.ReactNode;

  // Comportamiento
  defaultExpanded?: boolean;
  level?: number; // Nivel de profundidad (0=Vision, 1=Meta, etc.) para indentación

  // Estado de carga
  loadingChildren?: boolean;
}

export default function HierarchyCard({
  item,
  icon: Icon,
  iconColor,
  childrenKey,
  childrenLabel = "Items",
  createButtonLabel = "+ Nuevo",
  onToggleDone,
  onCreateChild,
  onItemPress,
  renderChild,
  defaultExpanded = false,
  level = 0,
  loadingChildren = false,
}: HierarchyCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const {
    isExpanded,
    childrenItems,
    canHaveChildren,
    indentation,
    handleHeaderPress,
    handleToggleDone,
    handleCreateChild,
  } = useHierarchyCard({
    item,
    childrenKey,
    defaultExpanded,
    level,
    onToggleDone,
    onCreateChild,
    onItemPress,
  });

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.backgroundSecondary,
          borderColor: colors.border,
        },
        { marginLeft: indentation },
      ]}
    >
      <HierarchyCardHeader
        item={item}
        icon={Icon}
        iconColor={iconColor}
        colors={colors}
        isExpanded={isExpanded}
        canHaveChildren={canHaveChildren}
        onHeaderPress={handleHeaderPress}
        onToggleDone={handleToggleDone}
      />

      {canHaveChildren && isExpanded && (
        <HierarchyCardContent
          childrenLabel={childrenLabel}
          createButtonLabel={createButtonLabel}
          childrenItems={childrenItems}
          colors={colors}
          loadingChildren={loadingChildren}
          onCreateChild={onCreateChild ? handleCreateChild : undefined}
          renderChild={renderChild}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
    overflow: "hidden",
  },
});
