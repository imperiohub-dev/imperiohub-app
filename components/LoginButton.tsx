/**
 * Componente de botón de login con Google
 *
 * Este es un ejemplo de cómo usar el servicio de autenticación.
 *
 * 📚 CONCEPTOS DE REACT NATIVE:
 *
 * 1. useState: Para manejar el estado del componente
 *    - Similar a React web, pero es un hook de React
 *
 * 2. TouchableOpacity: El "botón" de React Native
 *    - Similar a <button> en web
 *    - Tiene efecto de opacidad al presionarlo
 *
 * 3. ActivityIndicator: El "spinner" de carga
 *    - Similar a un loading spinner en web
 *
 * 4. Alert: Para mostrar alertas nativas
 *    - Similar a window.alert() pero con mejor UI
 */

import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { loginWithGoogle } from "../services/auth";

export const LoginButton: React.FC = () => {
  // Estado para saber si está cargando
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Maneja el click en el botón de login
   */
  const handleLogin = async () => {
    // 1. Activar estado de carga
    setIsLoading(true);

    try {
      // 2. Intentar hacer login
      const result = await loginWithGoogle();

      // 3. Procesar resultado
      if (result.success) {
        // Login exitoso
        Alert.alert(
          "¡Bienvenido!",
          "Has iniciado sesión correctamente",
          [{ text: "OK" }]
        );
        // Aquí podrías navegar a otra pantalla
        // Ejemplo: router.push('/home')
      } else {
        // Login falló
        Alert.alert(
          "Error",
          result.error || "No se pudo iniciar sesión",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      // Error inesperado
      console.error("Error en handleLogin:", error);
      Alert.alert(
        "Error",
        "Ocurrió un error inesperado",
        [{ text: "OK" }]
      );
    } finally {
      // 4. Desactivar estado de carga (siempre se ejecuta)
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handleLogin}
      disabled={isLoading} // Deshabilitar mientras carga
      activeOpacity={0.7} // Opacidad al presionar
    >
      {isLoading ? (
        // Mostrar spinner si está cargando
        <ActivityIndicator color="#fff" />
      ) : (
        // Mostrar texto si no está cargando
        <Text style={styles.buttonText}>Iniciar sesión con Google</Text>
      )}
    </TouchableOpacity>
  );
};

/**
 * Estilos del componente
 *
 * En React Native NO usas CSS, usas StyleSheet.create()
 * Los estilos son objetos de JavaScript, similares a CSS-in-JS
 */
const styles = StyleSheet.create({
  button: {
    backgroundColor: "#4285F4", // Color de Google
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48, // Para que no cambie de tamaño con el spinner
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
