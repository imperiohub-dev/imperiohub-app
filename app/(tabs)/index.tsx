import { StyleSheet, ScrollView } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { SafeAreaView } from "react-native-safe-area-context";
import CreateItemModal from "@/components/metas/CreateItemModal";
import { useHomeScreen } from "@/hooks/useHomeScreen";
import HeaderProfile from "@/components/home/HeaderProfile";
import EmptyStateView from "@/components/home/EmptyStateView";
import VisionsList from "@/components/home/VisionsList";

export default function HomeScreen() {
  const {
    userInfo,
    colors,
    visiones,
    loading,
    hasVisiones,
    modalState,
    handleCreate,
    handleModalClose,
    handleModalSubmit,
    handleToggleDone,
    renderMeta,
  } = useHomeScreen();

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
              renderMeta={renderMeta}
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
