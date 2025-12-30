import { useEffect } from "react";
import { GoogleAuthScreen } from "@/components/GoogleAuthScreen";
import { useAuth } from "@/contexts/AuthContext";
import { configureGoogleSignin } from "@/config/google-signin";

export default function AuthScreen() {
  useEffect(() => {
    configureGoogleSignin();
  }, []);

  const {
    userInfo,
    isSigningIn,
    signIn,
    signOut,
    revokeAccess,
    getCurrentUser,
  } = useAuth();

  return (
    <GoogleAuthScreen
      userInfo={userInfo}
      isSigningIn={isSigningIn}
      onSignIn={signIn}
      onSignOut={signOut}
      onRevokeAccess={revokeAccess}
      onGetCurrentUser={getCurrentUser}
    />
  );
}
