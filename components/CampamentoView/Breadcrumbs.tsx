import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import type { CampamentoCardType } from "./useCampamentoView";

interface BreadcrumbsProps {
  navigationStack: CampamentoCardType[];
  onNavigateToIndex: (index: number) => void;
}

export default function Breadcrumbs({
  navigationStack,
  onNavigateToIndex,
}: BreadcrumbsProps) {
  if (navigationStack.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Botón para volver al inicio (visiones) */}
      <TouchableOpacity onPress={() => onNavigateToIndex(-1)}>
        <Text style={styles.breadcrumb}>Inicio</Text>
      </TouchableOpacity>

      {/* Breadcrumbs de cada nivel */}
      {navigationStack.map((card, index) => (
        <View key={card.id} style={styles.breadcrumbItem}>
          <Text style={styles.separator}> › </Text>
          <TouchableOpacity onPress={() => onNavigateToIndex(index)}>
            <Text
              style={[
                styles.breadcrumb,
                index === navigationStack.length - 1 && styles.currentBreadcrumb,
              ]}
            >
              {card.titulo}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f5f5f5",
    flexWrap: "wrap",
  },
  breadcrumbItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  breadcrumb: {
    fontSize: 14,
    color: "#007AFF",
  },
  currentBreadcrumb: {
    color: "#333",
    fontWeight: "600",
  },
  separator: {
    fontSize: 14,
    color: "#999",
  },
});
