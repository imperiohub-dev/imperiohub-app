/**
 * EJEMPLO DE PANTALLA DE LOGIN
 *
 * Este archivo es un EJEMPLO COMPLETO que muestra cómo implementar
 * una pantalla de login usando todo lo que hemos creado.
 *
 * 📚 ESTRUCTURA DE UNA PANTALLA EN REACT NATIVE:
 *
 * 1. Imports: Importar componentes, hooks, etc.
 * 2. Componente principal: Función que retorna JSX
 * 3. Estilos: StyleSheet.create() al final
 *
 * 📚 COMPONENTES DE REACT NATIVE QUE USAMOS:
 *
 * - View: Como un <div> en web, contenedor básico
 * - Text: Para mostrar texto
 * - TouchableOpacity: Botón con efecto de opacidad
 * - ActivityIndicator: Spinner de carga
 * - StyleSheet: Para crear estilos
 *
 * 📝 NO BORRES ESTE ARCHIVO, úsalo como referencia
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { useAuth } from "./hooks/useAuth";

/**
 * Pantalla de Login
 *
 * Esta pantalla muestra:
 * - Un mensaje de bienvenida si el usuario está autenticado
 * - Un botón de login si no está autenticado
 * - Un spinner mientras carga
 */
const LoginScreen: React.FC = () => {
  // Usar el hook de autenticación
  const { user, isLoading, isAuthenticated, login, logout } = useAuth();

  /**
   * Maneja el click en el botón de login
   */
  const handleLogin = async () => {
    const result = await login();

    if (result.success) {
      Alert.alert("¡Bienvenido!", "Has iniciado sesión correctamente");
    } else {
      Alert.alert("Error", result.error || "No se pudo iniciar sesión");
    }
  };

  /**
   * Maneja el click en el botón de logout
   */
  const handleLogout = async () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro que quieres cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, cerrar sesión",
          style: "destructive",
          onPress: async () => {
            await logout();
            Alert.alert("Sesión cerrada", "Has cerrado sesión correctamente");
          },
        },
      ]
    );
  };

  /**
   * Renderizar spinner mientras carga
   */
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4285F4" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  /**
   * Renderizar pantalla principal
   */
  return (
    <View style={styles.container}>
      {/* Logo o título de tu app */}
      <View style={styles.header}>
        <Text style={styles.title}>ImperioHub</Text>
        <Text style={styles.subtitle}>Gestiona tus visiones y metas</Text>
      </View>

      {/* Contenido principal */}
      <View style={styles.content}>
        {isAuthenticated && user ? (
          // Usuario autenticado: Mostrar mensaje de bienvenida
          <>
            <Text style={styles.welcomeText}>¡Hola, {user.nombre}!</Text>
            <Text style={styles.emailText}>{user.email}</Text>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
            </TouchableOpacity>
          </>
        ) : (
          // Usuario NO autenticado: Mostrar botón de login
          <>
            <Text style={styles.loginPrompt}>
              Inicia sesión para comenzar
            </Text>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>
                Iniciar sesión con Google
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>v1.0.0</Text>
      </View>
    </View>
  );
};

/**
 * Estilos
 *
 * 📚 DIFERENCIAS CON CSS:
 *
 * - No hay unidades (px, rem, etc.), todos los valores son números
 * - Flexbox es el layout por defecto
 * - camelCase en vez de kebab-case (backgroundColor en vez de background-color)
 * - No todos los estilos de CSS están disponibles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa toda la pantalla
    backgroundColor: "#fff",
    justifyContent: "space-between", // Espacio entre header, content y footer
  },
  header: {
    paddingTop: 80,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  content: {
    flex: 1, // Ocupa el espacio disponible
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  emailText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 32,
  },
  loginPrompt: {
    fontSize: 18,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
  },
  loginButton: {
    backgroundColor: "#4285F4", // Color de Google
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    minWidth: 250,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#f44336", // Rojo para logout
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    minWidth: 250,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#999",
  },
});

export default LoginScreen;
