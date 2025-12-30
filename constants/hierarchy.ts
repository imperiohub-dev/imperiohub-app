/**
 * Configuración de la jerarquía de objetivos
 * Vision → Meta → Objetivo → Mision → Tarea
 */

import {
  Target,
  Flag,
  Compass,
  Rocket,
  CheckSquare,
  type LucideIcon,
} from "lucide-react-native";
import { BrandColors } from "./theme";

export type HierarchyLevel = "vision" | "meta" | "objetivo" | "mision" | "tarea";

export interface HierarchyLevelConfig {
  // Visual
  icon: LucideIcon;
  iconColor: string;

  // Relaciones
  childrenKey?: string; // Nombre de la propiedad de hijos en el item
  childrenLabel?: string; // Label para mostrar (ej: "Metas")
  createButtonLabel?: string; // Label del botón crear (ej: "+ Nueva Meta")

  // Metadata
  singularName: string; // "Visión", "Meta", etc.
  pluralName: string; // "Visiones", "Metas", etc.
  parentKey?: string; // Nombre de la FK parent (visionId, metaId, etc.)
}

/**
 * Configuración completa de cada nivel de la jerarquía
 */
export const HIERARCHY_CONFIG: Record<HierarchyLevel, HierarchyLevelConfig> = {
  vision: {
    icon: Target,
    iconColor: BrandColors.primary,
    childrenKey: "metas",
    childrenLabel: "Metas",
    createButtonLabel: "+ Nueva Meta",
    singularName: "Visión",
    pluralName: "Visiones",
    // No tiene parent (es el nivel superior)
  },
  meta: {
    icon: Flag,
    iconColor: "#F59E0B", // Amber
    childrenKey: "objetivos",
    childrenLabel: "Objetivos",
    createButtonLabel: "+ Nuevo Objetivo",
    singularName: "Meta",
    pluralName: "Metas",
    parentKey: "visionId",
  },
  objetivo: {
    icon: Compass,
    iconColor: "#8B5CF6", // Violet
    childrenKey: "misiones",
    childrenLabel: "Misiones",
    createButtonLabel: "+ Nueva Misión",
    singularName: "Objetivo",
    pluralName: "Objetivos",
    parentKey: "metaId",
  },
  mision: {
    icon: Rocket,
    iconColor: "#EC4899", // Pink
    childrenKey: "tareas",
    childrenLabel: "Tareas",
    createButtonLabel: "+ Nueva Tarea",
    singularName: "Misión",
    pluralName: "Misiones",
    parentKey: "objetivoId",
  },
  tarea: {
    icon: CheckSquare,
    iconColor: "#10B981", // Green
    // No tiene hijos (es el nivel final)
    singularName: "Tarea",
    pluralName: "Tareas",
    parentKey: "misionId",
  },
};

/**
 * Orden de la jerarquía (de mayor a menor nivel)
 */
export const HIERARCHY_ORDER: HierarchyLevel[] = [
  "vision",
  "meta",
  "objetivo",
  "mision",
  "tarea",
];

/**
 * Obtiene la configuración de un nivel
 */
export function getHierarchyConfig(level: HierarchyLevel): HierarchyLevelConfig {
  return HIERARCHY_CONFIG[level];
}

/**
 * Obtiene el nivel hijo de un nivel dado
 */
export function getChildLevel(level: HierarchyLevel): HierarchyLevel | null {
  const currentIndex = HIERARCHY_ORDER.indexOf(level);
  if (currentIndex === -1 || currentIndex === HIERARCHY_ORDER.length - 1) {
    return null;
  }
  return HIERARCHY_ORDER[currentIndex + 1];
}

/**
 * Obtiene el nivel padre de un nivel dado
 */
export function getParentLevel(level: HierarchyLevel): HierarchyLevel | null {
  const currentIndex = HIERARCHY_ORDER.indexOf(level);
  if (currentIndex <= 0) {
    return null;
  }
  return HIERARCHY_ORDER[currentIndex - 1];
}

/**
 * Verifica si un nivel tiene hijos
 */
export function hasChildren(level: HierarchyLevel): boolean {
  return !!HIERARCHY_CONFIG[level].childrenKey;
}

/**
 * Obtiene el índice de profundidad de un nivel (0 = Vision, 4 = Tarea)
 */
export function getLevelDepth(level: HierarchyLevel): number {
  return HIERARCHY_ORDER.indexOf(level);
}
