import { useEffect, useState, useCallback } from "react";
import {
  getOrganizacionesHierarchy,
  type OrganizacionHierarchy,
} from "@/service/api";
import type { Organizacion } from "@/service/api/types/organizacion.types";
import type {
  Vision,
  VisionHierarchy,
  MetaHierarchy,
  ObjetivoHierarchy,
  MisionHierarchy,
} from "@/service/api/types/vision.types";
import type { Meta } from "@/service/api/types/meta.types";
import type { Objetivo } from "@/service/api/types/objetivo.types";
import type { Mision } from "@/service/api/types/mision.types";
import type { Tarea } from "@/service/api/types/tarea.types";

export enum CampamentoType {
  ROOT = "root",
  ORGANIZACION = "organizacion",
  VISION = "vision",
  META = "meta",
  OBJETIVO = "objetivo",
  MISION = "mision",
  TAREA = "tarea",
}

// Nodo raíz virtual que representa al usuario
export interface RootNode {
  id: string;
  type: "root";
  titulo: string;
  descripcion: string;
  createdAt: Date;
  updatedAt: Date;
  isDone: boolean;
}

export type CampamentoCardType =
  | RootNode
  | Organizacion
  | Vision
  | Meta
  | Objetivo
  | Mision
  | Tarea;

// Función para crear el nodo raíz virtual
const createRootNode = (): RootNode => ({
  id: "root-user",
  type: "root",
  titulo: "Mis Organizaciones",
  descripcion:
    "Aquí puedes gestionar todas tus organizaciones, visiones y objetivos",
  createdAt: new Date(),
  updatedAt: new Date(),
  isDone: false,
});

// Type guards para verificar tipos de jerarquía
const isOrganizacionHierarchy = (card: CampamentoCardType): card is OrganizacionHierarchy =>
  "visiones" in card;

const isVisionHierarchy = (card: CampamentoCardType): card is VisionHierarchy =>
  "metas" in card && !("visiones" in card);

const isMetaHierarchy = (card: CampamentoCardType): card is MetaHierarchy =>
  "visionId" in card && "objetivos" in card;

const isObjetivoHierarchy = (card: CampamentoCardType): card is ObjetivoHierarchy =>
  "metaId" in card && "misiones" in card;

const isMisionHierarchy = (card: CampamentoCardType): card is MisionHierarchy =>
  "objetivoId" in card && "tareas" in card;

export default function useCampamentoView() {
  const [organizaciones, setOrganizaciones] = useState<OrganizacionHierarchy[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stack de navegación: array de tarjetas visitadas
  const [navigationStack, setNavigationStack] = useState<CampamentoCardType[]>(
    []
  );

  // Función para cargar/refrescar organizaciones
  const fetchOrganizaciones = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getOrganizacionesHierarchy();
      setOrganizaciones(response.organizaciones);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar organizaciones";
      setError(errorMessage);
      console.error("Error fetching organizaciones hierarchy:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar organizaciones al montar el componente
  useEffect(() => {
    fetchOrganizaciones();
  }, [fetchOrganizaciones]);

  // La tarjeta actual es la última en el stack, o el nodo raíz si está vacío
  const currentCard =
    navigationStack.length > 0
      ? navigationStack[navigationStack.length - 1]
      : createRootNode();

  const [currentChildren, setCurrentChildren] = useState<CampamentoCardType[]>(
    []
  );

  // Obtener los hijos de una tarjeta
  const getChildren = useCallback(
    (card: CampamentoCardType): CampamentoCardType[] => {
      // Si es el nodo raíz, los hijos son las organizaciones
      if ("type" in card && card.type === "root") return organizaciones;
      if (isOrganizacionHierarchy(card)) return card.visiones || [];
      if (isVisionHierarchy(card)) return card.metas || [];
      if (isMetaHierarchy(card)) return card.objetivos || [];
      if (isObjetivoHierarchy(card)) return card.misiones || [];
      if (isMisionHierarchy(card)) return card.tareas || [];
      if ("misionId" in card) return [];

      return [];
    },
    [organizaciones]
  );

  // Obtener el tipo de campamento de una tarjeta
  const getCampamentoType = (card: CampamentoCardType): CampamentoType => {
    if ("type" in card && card.type === "root") return CampamentoType.ROOT;
    if ("visiones" in card) return CampamentoType.ORGANIZACION;
    if ("metas" in card) return CampamentoType.VISION;
    if ("visionId" in card && "objetivos" in card) return CampamentoType.META;
    if ("metaId" in card && "misiones" in card) return CampamentoType.OBJETIVO;
    if ("objetivoId" in card && "tareas" in card) return CampamentoType.MISION;
    if ("misionId" in card) return CampamentoType.TAREA;
    return CampamentoType.ORGANIZACION;
  };

  // Navegar hacia adelante: agregar tarjeta al stack
  const navigateForward = (card: CampamentoCardType) => {
    setNavigationStack((prev) => [...prev, card]);
  };

  // Navegar hacia atrás: remover la última tarjeta del stack
  const navigateBack = () => {
    setNavigationStack((prev) => prev.slice(0, -1));
  };

  // Navegar a un índice específico del stack (para breadcrumbs)
  const navigateToIndex = (index: number) => {
    setNavigationStack((prev) => prev.slice(0, index + 1));
  };

  // Resetear completamente la navegación
  const resetNavigation = () => {
    setNavigationStack([]);
  };

  // Sincronizar el navigationStack cuando se actualizan las organizaciones
  useEffect(() => {
    if (navigationStack.length > 0 && organizaciones.length > 0) {
      const updatedStack: CampamentoCardType[] = [];

      for (const card of navigationStack) {
        let foundCard: CampamentoCardType | null = null;

        // Buscar en organizaciones
        for (const organizacion of organizaciones) {
          if (organizacion.id === card.id) {
            foundCard = organizacion as CampamentoCardType;
            break;
          }

          // Buscar en visiones dentro de la organización
          if (organizacion.visiones) {
            for (const vision of organizacion.visiones) {
              if (vision.id === card.id) {
                foundCard = vision as CampamentoCardType;
                break;
              }

              // Buscar en metas
              if (vision.metas) {
                for (const meta of vision.metas) {
                  if (meta.id === card.id) {
                    foundCard = meta as CampamentoCardType;
                    break;
                  }

                  // Buscar en objetivos
                  if (meta.objetivos) {
                    for (const objetivo of meta.objetivos) {
                      if (objetivo.id === card.id) {
                        foundCard = objetivo as CampamentoCardType;
                        break;
                      }

                      // Buscar en misiones
                      if (objetivo.misiones) {
                        for (const mision of objetivo.misiones) {
                          if (mision.id === card.id) {
                            foundCard = mision as CampamentoCardType;
                            break;
                          }

                          // Buscar en tareas
                          if (mision.tareas) {
                            for (const tarea of mision.tareas) {
                              if (tarea.id === card.id) {
                                foundCard = tarea as CampamentoCardType;
                                break;
                              }
                            }
                          }
                        }
                      }
                      if (foundCard) break;
                    }
                  }
                  if (foundCard) break;
                }
              }
              if (foundCard) break;
            }
          }
          if (foundCard) break;
        }

        if (foundCard) {
          updatedStack.push(foundCard);
        }
      }

      // Solo actualizar si encontramos todas las tarjetas y hay cambios reales en los datos
      if (updatedStack.length === navigationStack.length) {
        // Comparar si hay cambios reales en titulo, descripcion o en los hijos
        const hasChanges = updatedStack.some((updatedCard, index) => {
          const currentCard = navigationStack[index];

          // Verificar cambios en propiedades básicas
          if (
            updatedCard.titulo !== currentCard.titulo ||
            updatedCard.descripcion !== currentCard.descripcion
          ) {
            return true;
          }

          // Verificar cambios en los arrays de hijos (por longitud)
          if (isOrganizacionHierarchy(updatedCard) && isOrganizacionHierarchy(currentCard)) {
            return updatedCard.visiones.length !== currentCard.visiones.length;
          }
          if (isVisionHierarchy(updatedCard) && isVisionHierarchy(currentCard)) {
            return updatedCard.metas.length !== currentCard.metas.length;
          }
          if (isMetaHierarchy(updatedCard) && isMetaHierarchy(currentCard)) {
            return updatedCard.objetivos.length !== currentCard.objetivos.length;
          }
          if (isObjetivoHierarchy(updatedCard) && isObjetivoHierarchy(currentCard)) {
            return updatedCard.misiones.length !== currentCard.misiones.length;
          }
          if (isMisionHierarchy(updatedCard) && isMisionHierarchy(currentCard)) {
            return updatedCard.tareas.length !== currentCard.tareas.length;
          }

          return false;
        });

        if (hasChanges) {
          setNavigationStack(updatedStack);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizaciones]);

  // Actualizar currentChildren cuando cambia el stack
  useEffect(() => {
    const children = getChildren(currentCard);
    setCurrentChildren(children);
  }, [currentCard, getChildren]);

  // Función para actualizar un elemento en la jerarquía
  const updateItemInHierarchy = useCallback(
    (itemId: string, updates: { titulo: string; descripcion: string }) => {
      setOrganizaciones((prevOrganizaciones) => {
        return prevOrganizaciones.map((organizacion) => {
          // Actualizar organización
          if (organizacion.id === itemId) {
            return { ...organizacion, ...updates };
          }

          // Actualizar en visiones
          if (organizacion.visiones) {
            const updatedVisiones = organizacion.visiones.map((vision) => {
              // Actualizar visión
              if (vision.id === itemId) {
                return { ...vision, ...updates };
              }

              // Actualizar en metas
              if (vision.metas) {
                const updatedMetas = vision.metas.map((meta) => {
                  if (meta.id === itemId) {
                    return { ...meta, ...updates };
                  }

                  // Actualizar en objetivos
                  if (meta.objetivos) {
                    const updatedObjetivos = meta.objetivos.map((objetivo) => {
                      if (objetivo.id === itemId) {
                        return { ...objetivo, ...updates };
                      }

                      // Actualizar en misiones
                      if (objetivo.misiones) {
                        const updatedMisiones = objetivo.misiones.map(
                          (mision) => {
                            if (mision.id === itemId) {
                              return { ...mision, ...updates };
                            }

                            // Actualizar en tareas
                            if (mision.tareas) {
                              const updatedTareas = mision.tareas.map((tarea) =>
                                tarea.id === itemId
                                  ? { ...tarea, ...updates }
                                  : tarea
                              );
                              return { ...mision, tareas: updatedTareas };
                            }

                            return mision;
                          }
                        );
                        return { ...objetivo, misiones: updatedMisiones };
                      }

                      return objetivo;
                    });
                    return { ...meta, objetivos: updatedObjetivos };
                  }

                  return meta;
                });
                return { ...vision, metas: updatedMetas };
              }

              return vision;
            });
            return { ...organizacion, visiones: updatedVisiones };
          }

          return organizacion;
        });
      });
    },
    []
  );

  // Función para eliminar un elemento de la jerarquía
  const deleteItemFromHierarchy = useCallback((itemId: string) => {
    setOrganizaciones((prevOrganizaciones) => {
      return prevOrganizaciones
        .filter((organizacion) => organizacion.id !== itemId)
        .map((organizacion) => {
          if (organizacion.visiones) {
            const filteredVisiones = organizacion.visiones
              .filter((vision) => vision.id !== itemId)
              .map((vision) => {
                if (vision.metas) {
                  const filteredMetas = vision.metas
                    .filter((meta) => meta.id !== itemId)
                    .map((meta) => {
                      if (meta.objetivos) {
                        const filteredObjetivos = meta.objetivos
                          .filter((objetivo) => objetivo.id !== itemId)
                          .map((objetivo) => {
                            if (objetivo.misiones) {
                              const filteredMisiones = objetivo.misiones
                                .filter((mision) => mision.id !== itemId)
                                .map((mision) => {
                                  if (mision.tareas) {
                                    return {
                                      ...mision,
                                      tareas: mision.tareas.filter(
                                        (tarea) => tarea.id !== itemId
                                      ),
                                    };
                                  }
                                  return mision;
                                });
                              return {
                                ...objetivo,
                                misiones: filteredMisiones,
                              };
                            }
                            return objetivo;
                          });
                        return { ...meta, objetivos: filteredObjetivos };
                      }
                      return meta;
                    });
                  return { ...vision, metas: filteredMetas };
                }
                return vision;
              });
            return { ...organizacion, visiones: filteredVisiones };
          }
          return organizacion;
        });
    });
  }, []);

  // Función para agregar un elemento a la jerarquía
  const addItemToHierarchy = useCallback(
    (
      parentId: string | null,
      newItem: Organizacion | Vision | Meta | Objetivo | Mision | Tarea
    ) => {
      setOrganizaciones((prevOrganizaciones) => {
        // Si no hay parentId, es una nueva organización
        if (!parentId) {
          const newOrganizacion = newItem as Organizacion;
          return [
            ...prevOrganizaciones,
            { ...newOrganizacion, visiones: [] } as OrganizacionHierarchy,
          ];
        }

        return prevOrganizaciones.map((organizacion) => {
          // Agregar visión a organización
          if (organizacion.id === parentId) {
            const newVision = newItem as Vision;
            return {
              ...organizacion,
              visiones: [
                ...(organizacion.visiones || []),
                { ...newVision, metas: [] } as VisionHierarchy,
              ],
            };
          }

          // Agregar en visiones
          if (organizacion.visiones) {
            const updatedVisiones = organizacion.visiones.map((vision) => {
              // Agregar meta a visión
              if (vision.id === parentId) {
                const newMeta = newItem as Meta;
                return {
                  ...vision,
                  metas: [
                    ...(vision.metas || []),
                    {
                      ...newMeta,
                      objetivos: [],
                    } as import("@/service/api/types/vision.types").MetaHierarchy,
                  ],
                };
              }

              // Agregar en metas
              if (vision.metas) {
                const updatedMetas = vision.metas.map((meta) => {
                  // Agregar objetivo a meta
                  if (meta.id === parentId) {
                    const newObjetivo = newItem as Objetivo;
                    return {
                      ...meta,
                      objetivos: [
                        ...(meta.objetivos || []),
                        {
                          ...newObjetivo,
                          misiones: [],
                        } as import("@/service/api/types/vision.types").ObjetivoHierarchy,
                      ],
                    };
                  }

                  // Agregar en objetivos
                  if (meta.objetivos) {
                    const updatedObjetivos = meta.objetivos.map((objetivo) => {
                      // Agregar misión a objetivo
                      if (objetivo.id === parentId) {
                        const newMision = newItem as Mision;
                        return {
                          ...objetivo,
                          misiones: [
                            ...(objetivo.misiones || []),
                            {
                              ...newMision,
                              tareas: [],
                            } as import("@/service/api/types/vision.types").MisionHierarchy,
                          ],
                        };
                      }

                      // Agregar en misiones
                      if (objetivo.misiones) {
                        const updatedMisiones = objetivo.misiones.map(
                          (mision) => {
                            // Agregar tarea a misión
                            if (mision.id === parentId) {
                              const newTarea = newItem as Tarea;
                              return {
                                ...mision,
                                tareas: [...(mision.tareas || []), newTarea],
                              };
                            }
                            return mision;
                          }
                        );
                        return { ...objetivo, misiones: updatedMisiones };
                      }

                      return objetivo;
                    });
                    return { ...meta, objetivos: updatedObjetivos };
                  }

                  return meta;
                });
                return { ...vision, metas: updatedMetas };
              }

              return vision;
            });
            return { ...organizacion, visiones: updatedVisiones };
          }

          return organizacion;
        });
      });
    },
    []
  );

  return {
    organizaciones,
    setOrganizaciones,
    loading,
    error,
    fetchOrganizaciones,
    currentCard,
    currentChildren,
    navigationStack,
    navigateForward,
    navigateBack,
    navigateToIndex,
    resetNavigation,
    getCampamentoType,
    // Nuevas funciones para manipulación optimista del estado
    updateItemInHierarchy,
    deleteItemFromHierarchy,
    addItemToHierarchy,
  };
}
