import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import React, { useState, useCallback, useMemo } from "react";
import type { CampamentoCardType } from "./useCampamentoView";
import CreateItemModal from "@/components/CampamentoView/CreateItemModal";
import { useCampamentoCRUD } from "./useCampamentoCRUD";

interface CardActionsProps {
  currentCard: CampamentoCardType;
  onRefresh: () => Promise<void>;
}

export default function CardActions({ currentCard, onRefresh }: CardActionsProps) {
  const { getCardType, getChildType, createItem, updateItem, deleteItem, loading } =
    useCampamentoCRUD({
      onRefresh,
    });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  const childType = getChildType(currentCard);
  const currentType = getCardType(currentCard);

  const handleEdit = () => {
    setModalMode("edit");
    setModalVisible(true);
  };

  const handleCreate = () => {
    setModalMode("create");
    setModalVisible(true);
  };

  const handleDelete = async () => {
    // Confirmar antes de eliminar
    const itemTypeName =
      currentType === "vision"
        ? "visión"
        : currentType === "meta"
        ? "meta"
        : currentType === "objetivo"
        ? "objetivo"
        : currentType === "mision"
        ? "misión"
        : "tarea";

    Alert.alert(
      "Confirmar eliminación",
      `¿Estás seguro de que quieres eliminar esta ${itemTypeName}? Esta acción no se puede deshacer.`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteItem(currentCard);
            } catch (error) {
              console.error("Error al eliminar:", error);
              Alert.alert(
                "Error",
                "No se pudo eliminar el elemento. Por favor, intenta de nuevo."
              );
            }
          },
        },
      ]
    );
  };

  const handleSubmit = useCallback(
    async (data: { titulo: string; descripcion: string }) => {
      try {
        if (modalMode === "create") {
          // Crear hijo usando el hook
          await createItem(currentCard, data);
        } else {
          // Editar la tarjeta actual usando el hook
          await updateItem(currentCard, data);
        }
      } catch (error) {
        console.error("Error en handleSubmit:", error);
        throw error;
      }
    },
    [modalMode, createItem, updateItem, currentCard]
  );

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const initialData = useMemo(
    () =>
      modalMode === "edit"
        ? {
            titulo: currentCard.titulo,
            descripcion: currentCard.descripcion || "",
          }
        : undefined,
    [modalMode, currentCard.titulo, currentCard.descripcion]
  );

  const buttons = [
    {
      key: "delete",
      label: "Eliminar",
      style: styles.deleteButton,
      onPress: handleDelete,
    },
    {
      key: "edit",
      label: "Editar",
      style: styles.editButton,
      onPress: handleEdit,
    },

    {
      key: "create",
      label: `Crear ${childType}`,
      style: styles.createButton,
      onPress: handleCreate,
    },
  ];

  return (
    <>
      <View style={styles.container}>
        {buttons.map((button) => (
          <TouchableOpacity
            key={button.key}
            style={[styles.button, button.style]}
            onPress={button.onPress}
          >
            <Text style={styles.buttonText}>{button.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <CreateItemModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        itemType={modalMode === "create" ? childType : currentType}
        initialData={initialData}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  editButton: {
    backgroundColor: "#007AFF",
  },
  createButton: {
    backgroundColor: "#34C759",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
