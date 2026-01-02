import { View, Text, StyleSheet } from "react-native";
import React from "react";
import type { CampamentoCardType } from "./useCampamentoView";

interface CurrentCardDisplayProps {
  currentCard: CampamentoCardType;
}

export default function CurrentCardDisplay({
  currentCard,
}: CurrentCardDisplayProps) {
  return (
    <View style={styles.container}>
      {/* Título */}
      <Text style={styles.title}>{currentCard.titulo}</Text>

      {/* Descripción */}
      {currentCard.descripcion && (
        <Text style={styles.description}>{currentCard.descripcion}</Text>
      )}

      {/* Metadatos */}
      <View style={styles.metadataContainer}>
        {/* ID */}
        <View style={styles.metadataRow}>
          <Text style={styles.metadataLabel}>ID:</Text>
          <Text style={styles.metadataValue}>{currentCard.id}</Text>
        </View>

        {/* Estado isDone */}
        <View style={styles.metadataRow}>
          <Text style={styles.metadataLabel}>Completado:</Text>
          <Text style={[
            styles.metadataValue,
            currentCard.isDone ? styles.statusDone : styles.statusPending
          ]}>
            {currentCard.isDone ? "✓ Sí" : "○ No"}
          </Text>
        </View>

        {/* Fecha de creación */}
        <View style={styles.metadataRow}>
          <Text style={styles.metadataLabel}>Creado:</Text>
          <Text style={styles.metadataValue}>
            {new Date(currentCard.createdAt).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </Text>
        </View>

        {/* Fecha de actualización */}
        <View style={styles.metadataRow}>
          <Text style={styles.metadataLabel}>Actualizado:</Text>
          <Text style={styles.metadataValue}>
            {new Date(currentCard.updatedAt).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </Text>
        </View>

        {/* IDs de relaciones */}
        {"usuarioId" in currentCard && (
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Usuario ID:</Text>
            <Text style={styles.metadataValue}>{currentCard.usuarioId}</Text>
          </View>
        )}

        {"visionId" in currentCard && (
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Visión ID:</Text>
            <Text style={styles.metadataValue}>{currentCard.visionId}</Text>
          </View>
        )}

        {"metaId" in currentCard && (
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Meta ID:</Text>
            <Text style={styles.metadataValue}>{currentCard.metaId}</Text>
          </View>
        )}

        {"objetivoId" in currentCard && (
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Objetivo ID:</Text>
            <Text style={styles.metadataValue}>{currentCard.objetivoId}</Text>
          </View>
        )}

        {"misionId" in currentCard && (
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Misión ID:</Text>
            <Text style={styles.metadataValue}>{currentCard.misionId}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginVertical: 12,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#1a1a1a",
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    lineHeight: 22,
  },
  metadataContainer: {
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    paddingTop: 16,
  },
  metadataRow: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
  },
  metadataLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    width: 120,
  },
  metadataValue: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  statusDone: {
    color: "#34C759",
    fontWeight: "600",
  },
  statusPending: {
    color: "#FF9500",
    fontWeight: "600",
  },
});
