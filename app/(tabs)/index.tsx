import { useEffect } from "react";
import { GoogleAuthScreen } from "@/components/GoogleAuthScreen";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { configureGoogleSignin } from "@/config/google-signin";

export default function HomeScreen() {
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
  } = useGoogleAuth();

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
