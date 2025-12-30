import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import {
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Circle,
  type LucideIcon,
} from "lucide-react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  Colors,
  Spacing,
  FontSizes,
  FontWeights,
  BorderRadius,
  IconSizes,
  BrandColors,
} from "@/constants/theme";

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
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Obtener hijos del item si existe la key
  const childrenItems: HierarchyItem[] =
    (childrenKey && item[childrenKey]) || [];
  const hasChildren = childrenItems.length > 0;
  const canHaveChildren = !!childrenKey;

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  const handleHeaderPress = () => {
    if (canHaveChildren) {
      toggleExpanded();
    }
    onItemPress?.(item);
  };

  const handleToggleDone = (e: any) => {
    e.stopPropagation();
    onToggleDone?.(item.id, !item.isDone);
  };

  const handleCreateChild = () => {
    onCreateChild?.(item.id);
  };

  // Calcular indentación basada en el nivel
  const indentation = level * Spacing.md;

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
      {/* Header */}
      <Pressable
        style={({ pressed }) => [
          styles.header,
          pressed && styles.headerPressed,
          item.isDone && styles.doneHeader,
        ]}
        onPress={handleHeaderPress}
      >
        {/* Checkbox isDone */}
        <Pressable onPress={handleToggleDone} style={styles.checkboxContainer}>
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

      {/* Contenido expandido */}
      {canHaveChildren && isExpanded && (
        <View style={styles.expandedContent}>
          {/* Header de hijos con botón crear */}
          <View style={styles.childrenHeader}>
            <ThemedText style={[styles.childrenLabel, { color: colors.text }]}>
              {childrenLabel} ({childrenItems.length})
            </ThemedText>
            {onCreateChild && (
              <Pressable onPress={handleCreateChild}>
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

  // Header
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

  // Contenido expandido
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

  // Estados especiales
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

  // Lista de hijos
  childrenList: {
    gap: Spacing.xs,
  },
});
