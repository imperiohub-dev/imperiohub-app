import { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter, useSegments } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Componente que protege rutas y maneja la navegación basada en autenticación
 * - Si el usuario no está autenticado, redirige a /auth
 * - Si está autenticado, muestra el contenido protegido
 * - Muestra un loading mientras verifica el estado de autenticación
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(tabs)";
    const inAuthScreen = segments[0] === "auth";

    if (!isAuthenticated && inAuthGroup) {
      // Usuario no autenticado intentando acceder a rutas protegidas
      // Redirige a la pantalla de autenticación
      router.replace("/auth");
    } else if (isAuthenticated && inAuthScreen) {
      // Usuario autenticado en pantalla de auth
      // Redirige a la app principal
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isLoading, segments, router]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4285F4" />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
