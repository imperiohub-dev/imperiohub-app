import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { AuthProvider } from "@/contexts/AuthContext";
import { VisionesProvider } from "@/contexts/VisionesContext";
import { MetasProvider } from "@/contexts/MetasContext";
import { AuthGuard } from "@/components/AuthGuard";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    /* Provee el estado de auth */
    <AuthProvider>
      {/* Verifica y protege rutas */}
      <AuthGuard>
        {/* Provee el estado de visiones (solo para usuarios autenticados) */}
        <VisionesProvider>
          {/* Provee el estado de metas */}
          <MetasProvider>
            {/* Tu tema existente */}
            <ThemeProvider
              value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
              {/* Tus pantallas */}
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="modal"
                  options={{ presentation: "modal", title: "Modal" }}
                />
              </Stack>
              <StatusBar style="auto" />
            </ThemeProvider>
          </MetasProvider>
        </VisionesProvider>
      </AuthGuard>
    </AuthProvider>
  );
}
