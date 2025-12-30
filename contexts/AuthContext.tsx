import React, { createContext, useContext, ReactNode } from "react";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import type { User } from "@/service/api";

interface AuthContextType {
  userInfo: User | null;
  isSigningIn: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: () => Promise<User | null>;
  signOut: () => Promise<void>;
  revokeAccess: () => Promise<void>;
  getCurrentUser: () => Promise<User | null>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const auth = useGoogleAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

/**
 * Hook para acceder al contexto de autenticación
 * @throws Error si se usa fuera del AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
