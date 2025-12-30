import { View, StyleSheet, Image, Pressable, ScrollView, Alert } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/contexts/AuthContext";
import { useVisiones } from "@/contexts/VisionesContext";
import { Target } from "lucide-react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  Colors,
  Spacing,
  FontSizes,
  FontWeights,
  BorderRadius,
  IconSizes,
  BrandColors,
} from "@/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import CreateItemModal from "@/components/metas/CreateItemModal";

export default function HomeScreen() {
  const { userInfo } = useAuth();
  const { visiones, loading, addVision } = useVisiones();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  // Determinar si tiene visiones
  const hasVisiones = visiones.length > 0;

  // Estado para controlar el modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleCreateVision = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleModalSubmit = async (data: {
    titulo: string;
    descripcion: string;
  }) => {
    try {
      const nuevaVision = await addVision(data);
      console.log("Visión creada exitosamente:", nuevaVision);
      Alert.alert("Éxito", "Tu visión ha sido creada exitosamente");
      // El estado se actualiza automáticamente gracias al Context
    } catch (error) {
      console.error("Error al crear visión:", error);
      Alert.alert("Error", "No se pudo crear la visión. Intenta nuevamente.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ThemedView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header con foto de perfil */}
          <View style={styles.header}>
            {userInfo?.picture ? (
              <Image
                source={{ uri: userInfo.picture }}
                style={styles.avatar}
                accessibilityLabel="Foto de perfil"
              />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <ThemedText style={styles.avatarText}>
                  {userInfo?.nombre?.charAt(0).toUpperCase() || "U"}
                </ThemedText>
              </View>
            )}
            <View style={styles.greetingContainer}>
              <ThemedText style={styles.greeting}>
                Hola, {userInfo?.nombre || "Usuario"}!
              </ThemedText>
              <ThemedText
                style={[styles.subGreeting, { color: colors.textSecondary }]}
              >
                Bienvenido a tu espacio de metas
              </ThemedText>
            </View>
          </View>

          {/* Empty State - Usuario sin visiones */}
          {!hasVisiones && !loading && (
            <View style={styles.emptyStateContainer}>
              {/* Ícono grande */}
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: colors.backgroundSecondary },
                ]}
              >
                <Target
                  size={IconSizes.xxl}
                  color={BrandColors.primary}
                  strokeWidth={1.5}
                />
              </View>

              {/* Título */}
              <ThemedText style={styles.emptyTitle}>
                Comienza tu viaje hacia tus metas
              </ThemedText>

              {/* Descripción */}
              <ThemedText
                style={[
                  styles.emptyDescription,
                  { color: colors.textSecondary },
                ]}
              >
                Crea tu primera Visión para organizar tus objetivos y alcanzar
                tus sueños
              </ThemedText>

              {/* Botón principal */}
              <Pressable
                style={({ pressed }) => [
                  styles.primaryButton,
                  { backgroundColor: BrandColors.primary },
                  pressed && styles.buttonPressed,
                ]}
                onPress={handleCreateVision}
              >
                <ThemedText style={styles.buttonText}>
                  Crear mi primera Visión
                </ThemedText>
              </Pressable>
            </View>
          )}

          {/* Lista de Visiones */}
          {hasVisiones && (
            <View style={styles.visionesContainer}>
              <View style={styles.visionesHeader}>
                <ThemedText style={styles.visionesTitle}>
                  Mis Visiones
                </ThemedText>
                <Pressable onPress={handleCreateVision}>
                  <ThemedText
                    style={[styles.addButton, { color: BrandColors.primary }]}
                  >
                    + Nueva
                  </ThemedText>
                </Pressable>
              </View>

              {visiones.map((vision) => (
                <Pressable
                  key={vision.id}
                  style={({ pressed }) => [
                    styles.visionCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                    pressed && styles.cardPressed,
                  ]}
                  onPress={() => console.log("Ver detalles de:", vision.id)}
                >
                  <ThemedText style={styles.visionCardTitle}>
                    {vision.titulo}
                  </ThemedText>
                  {vision.descripcion && (
                    <ThemedText
                      style={[
                        styles.visionCardDescription,
                        { color: colors.textSecondary },
                      ]}
                      numberOfLines={2}
                    >
                      {vision.descripcion}
                    </ThemedText>
                  )}
                  <ThemedText
                    style={[styles.visionCardDate, { color: colors.textMuted }]}
                  >
                    Creada el{" "}
                    {new Date(vision.createdAt).toLocaleDateString("es-ES")}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          )}
        </ScrollView>
      </ThemedView>

      {/* Modal para crear visión */}
      <CreateItemModal
        visible={isModalVisible}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        itemType="vision"
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

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
  },
  avatarPlaceholder: {
    backgroundColor: BrandColors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: "#fff",
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.xxs,
  },
  subGreeting: {
    fontSize: FontSizes.sm,
  },

  // Empty State
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxxl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  emptyTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    textAlign: "center",
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  emptyDescription: {
    fontSize: FontSizes.md,
    textAlign: "center",
    marginBottom: Spacing.xxl,
    lineHeight: FontSizes.md * 1.5,
    paddingHorizontal: Spacing.lg,
  },

  // Botón
  primaryButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    minWidth: 200,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: "#fff",
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },

  // Lista de Visiones
  visionesContainer: {
    padding: Spacing.lg,
  },
  visionesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  visionesTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
  },
  addButton: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },

  // Cards de Visiones
  visionCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.99 }],
  },
  visionCardTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.xs,
  },
  visionCardDescription: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.sm,
    lineHeight: FontSizes.sm * 1.4,
  },
  visionCardDate: {
    fontSize: FontSizes.xs,
  },
});
