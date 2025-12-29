import { useState, useEffect } from "react";
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { Alert } from "react-native";
import { authService, type User } from "../service/api";

export const useGoogleAuth = () => {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkIsSignedIn();
  }, []);

  /**
   * Verifica si hay un usuario autenticado
   * Primero chequea storage local, luego valida con backend
   */
  const checkIsSignedIn = async () => {
    try {
      setIsLoading(true);

      // 1. Intentar obtener usuario guardado localmente
      const storedUser = await authService.getStoredUser();
      if (storedUser) {
        setUserInfo(storedUser);
      }

      // 2. Validar con backend (esto también actualiza el storage)
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUserInfo(currentUser);
      } else {
        // No hay usuario autenticado
        setUserInfo(null);
      }
    } catch (error) {
      console.error("Error checking sign-in status:", error);
      setUserInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login con Google
   * Ahora integrado con el backend
   */
  const signIn = async () => {
    try {
      setIsSigningIn(true);

      // 1. Verificar Google Play Services (solo Android)
      await GoogleSignin.hasPlayServices();

      // 2. Iniciar sign-in con Google
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        const googleUser = response.data;

        // 3. Obtener el idToken para enviarlo al backend
        const tokens = await GoogleSignin.getTokens();

        // 4. Autenticar con nuestro backend
        const { user } = await authService.loginWithGoogle(
          googleUser,
          tokens.idToken
        );

        // 5. Actualizar estado local
        setUserInfo(user);

        Alert.alert("Success", `Welcome ${user.nombre}!`);
        return user;
      } else {
        Alert.alert("Cancelled", "Sign in was cancelled");
        return null;
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            Alert.alert("In Progress", "Sign in is already in progress");
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert("Error", "Play Services not available or outdated");
            break;
          case statusCodes.SIGN_IN_CANCELLED:
            Alert.alert("Cancelled", "User cancelled the sign in");
            break;
          default:
            Alert.alert("Error", `Something went wrong: ${error.message}`);
        }
      } else {
        Alert.alert(
          "Error",
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        );
      }
      return null;
    } finally {
      setIsSigningIn(false);
    }
  };

  /**
   * Sign out completo:
   * - Cierra sesión en Google
   * - Cierra sesión en nuestro backend
   * - Limpia storage local
   */
  const signOut = async () => {
    try {
      // 1. Sign out de Google
      await GoogleSignin.signOut();

      // 2. Logout en nuestro backend (limpia cookies y storage)
      await authService.logout();

      // 3. Limpiar estado local
      setUserInfo(null);

      Alert.alert("Success", "Signed out successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to sign out");
      console.error("Sign out error:", error);
    }
  };

  /**
   * Revoca acceso a Google y cierra sesión completa
   */
  const revokeAccess = async () => {
    try {
      // 1. Revocar acceso en Google
      await GoogleSignin.revokeAccess();

      // 2. Logout en nuestro backend
      await authService.logout();

      // 3. Limpiar estado local
      setUserInfo(null);

      Alert.alert("Success", "Access revoked successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to revoke access");
      console.error("Revoke access error:", error);
    }
  };

  /**
   * Obtiene el usuario actual desde el backend
   */
  const getCurrentUser = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        setUserInfo(user);
        Alert.alert("Current User", JSON.stringify(user, null, 2));
      } else {
        Alert.alert("Info", "No user is currently signed in");
      }
      return user;
    } catch (error) {
      Alert.alert("Error", "Failed to get current user");
      console.error("Get current user error:", error);
      return null;
    }
  };

  return {
    userInfo,
    isSigningIn,
    isLoading,
    isAuthenticated: !!userInfo,
    signIn,
    signOut,
    revokeAccess,
    getCurrentUser,
    refreshUser: checkIsSignedIn,
  };
};
