import { View, Text, StyleSheet } from "react-native";
import React from "react";
import type { CampamentoCardType } from "./useCampamentoView";

interface CardProps {
  card: CampamentoCardType;
  handeltCampamentoView?: (card: CampamentoCardType) => void;
}

export default function VisionCard({ card, handeltCampamentoView }: CardProps) {
  return (
    <View
      style={styles.card}
      onTouchEnd={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handeltCampamentoView?.(card);
        // tenemos que mostrar la card que se clico compleramente
        // mostrar sus hijos
      }}
    >
      <Text style={styles.title}>{card.titulo}</Text>
      <Text style={styles.description}>{card.descripcion}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
});
