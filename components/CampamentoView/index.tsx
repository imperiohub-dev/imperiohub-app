import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import Card from "./Card";
import Breadcrumbs from "./Breadcrumbs";
import CurrentCardDisplay from "./CurrentCardDisplay";
import CardActions from "./CardActions";
import useCampamentoView, {
  CampamentoType,
  CampamentoCardType,
} from "./useCampamentoView";

interface CampamentoViewProps {
  campamentoType?: CampamentoType;
}

interface RenderCardsProps {
  cards: CampamentoCardType[];
  onCardPress: (card: CampamentoCardType) => void;
}

const renderCards = ({ cards, onCardPress }: RenderCardsProps) => {
  if (cards.length === 0) {
    return <Text>No hay elementos para mostrar.</Text>;
  }

  return (
    <>
      {cards.map((card) => (
        <Card key={card.id} card={card} handeltCampamentoView={onCardPress} />
      ))}
    </>
  );
};

export default function CampamentoView({
  campamentoType = CampamentoType.VISION,
}: CampamentoViewProps) {
  const {
    currentCard,
    currentChildren,
    navigationStack,
    navigateForward,
    navigateBack,
    navigateToIndex,
    fetchVisiones,
    loading,
    error,
  } = useCampamentoView();

  const showBackButton = navigationStack.length > 0;

  // Mostrar loading state
  if (loading && currentChildren.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  // Mostrar error state
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchVisiones}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      {/* Breadcrumbs para navegación rápida */}
      <Breadcrumbs
        navigationStack={navigationStack}
        onNavigateToIndex={navigateToIndex}
      />

      {/* Botón de retroceso */}
      {showBackButton && (
        <TouchableOpacity style={styles.backButton} onPress={navigateBack}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
      )}

      {/* Mostrar tarjeta actual si existe */}
      {currentCard && (
        <>
          <CurrentCardDisplay currentCard={currentCard} />
          <CardActions currentCard={currentCard} onRefresh={fetchVisiones} />
        </>
      )}

      {/* Tarjetas del nivel actual */}
      {renderCards({ cards: currentChildren, onCardPress: navigateForward })}
    </>
  );
}

const styles = StyleSheet.create({
  backButton: {
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#FF3B30",
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
