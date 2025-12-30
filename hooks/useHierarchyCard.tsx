import { useState } from "react";
import { LayoutAnimation } from "react-native";
import type { HierarchyItem } from "@/components/metas/HierarchyCard";

interface UseHierarchyCardProps {
  item: HierarchyItem;
  childrenKey?: string;
  defaultExpanded?: boolean;
  level?: number;
  onToggleDone?: (itemId: string, isDone: boolean) => void;
  onCreateChild?: (parentId: string) => void;
  onItemPress?: (item: HierarchyItem) => void;
}

export function useHierarchyCard({
  item,
  childrenKey,
  defaultExpanded = false,
  level = 0,
  onToggleDone,
  onCreateChild,
  onItemPress,
}: UseHierarchyCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Obtener hijos del item si existe la key
  const childrenItems: HierarchyItem[] =
    (childrenKey && item[childrenKey]) || [];
  const hasChildren = childrenItems.length > 0;
  const canHaveChildren = !!childrenKey;

  // Calcular indentación basada en el nivel
  const indentation = level * 16; // Spacing.md

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

  return {
    // Estado
    isExpanded,
    childrenItems,
    hasChildren,
    canHaveChildren,
    indentation,

    // Handlers
    handleHeaderPress,
    handleToggleDone,
    handleCreateChild,
    toggleExpanded,
  };
}
