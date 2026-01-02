import { StyleSheet, ScrollView } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { SafeAreaView } from "react-native-safe-area-context";
import CreateItemModal from "@/components/CampamentoView/CreateItemModal";
import { useHomeScreen } from "@/hooks/useHomeScreen";
import HeaderProfile from "@/components/home/HeaderProfile";
import EmptyStateView from "@/components/home/EmptyStateView";
import VisionsList from "@/components/home/VisionsList";
import {
  MetaDetailView,
  ObjetivoDetailView,
  MisionDetailView,
} from "@/components/metas";

export default function HomeScreen() {
  const {
    userInfo,
    colors,
    visiones,
    loading,
    hasVisiones,
    currentView,
    selectedMeta,
    selectedObjetivo,
    selectedMision,
    modalState,
    handleCreate,
    handleModalClose,
    handleModalSubmit,
    handleToggleDone,
    handleMetaPress,
    handleObjetivoPress,
    handleMisionPress,
    handleBackToVisiones,
    handleBackToMeta,
    handleBackToObjetivo,
  } = useHomeScreen();

  // Renderizar vista de Visiones
  if (currentView === "vision") {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ThemedView style={styles.container}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <HeaderProfile
              userInfo={userInfo}
              textSecondaryColor={colors.textSecondary}
            />

            {!hasVisiones && !loading && (
              <EmptyStateView
                backgroundSecondaryColor={colors.backgroundSecondary}
                textSecondaryColor={colors.textSecondary}
                onCreateVision={() => handleCreate("vision")}
              />
            )}

            {hasVisiones && (
              <VisionsList
                visiones={visiones}
                onCreateVision={() => handleCreate("vision")}
                onToggleDone={handleToggleDone}
                onCreateMeta={(visionId) => handleCreate("meta", visionId)}
                onMetaPress={handleMetaPress}
              />
            )}
          </ScrollView>
        </ThemedView>

        <CreateItemModal
          visible={modalState.visible}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
          itemType={modalState.type}
        />
      </SafeAreaView>
    );
  }

  // Renderizar vista de Meta
  if (currentView === "meta" && selectedMeta) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ThemedView style={styles.container}>
          <MetaDetailView
            meta={selectedMeta}
            onBack={handleBackToVisiones}
            onToggleDone={handleToggleDone}
            onCreateObjetivo={(metaId) => handleCreate("objetivo", metaId)}
            onObjetivoPress={handleObjetivoPress}
          />
        </ThemedView>

        <CreateItemModal
          visible={modalState.visible}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
          itemType={modalState.type}
        />
      </SafeAreaView>
    );
  }

  // Renderizar vista de Objetivo
  if (currentView === "objetivo" && selectedObjetivo) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ThemedView style={styles.container}>
          <ObjetivoDetailView
            objetivo={selectedObjetivo}
            onBack={handleBackToMeta}
            onToggleDone={handleToggleDone}
            onCreateMision={(objetivoId) => handleCreate("mision", objetivoId)}
            onMisionPress={handleMisionPress}
          />
        </ThemedView>

        <CreateItemModal
          visible={modalState.visible}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
          itemType={modalState.type}
        />
      </SafeAreaView>
    );
  }

  // Renderizar vista de Misión
  if (currentView === "mision" && selectedMision) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ThemedView style={styles.container}>
          <MisionDetailView
            mision={selectedMision}
            onBack={handleBackToObjetivo}
            onToggleDone={handleToggleDone}
            onCreateTarea={(misionId) => handleCreate("tarea", misionId)}
          />
        </ThemedView>

        <CreateItemModal
          visible={modalState.visible}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
          itemType={modalState.type}
        />
      </SafeAreaView>
    );
  }

  // Fallback a vista de visiones
  return null;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
