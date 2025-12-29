import { Button, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import type { User } from "@/service/api";

interface GoogleAuthScreenProps {
  userInfo: User | null;
  isSigningIn: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
  onRevokeAccess: () => void;
  onGetCurrentUser: () => void;
}

export const GoogleAuthScreen = ({
  userInfo,
  isSigningIn,
  onSignIn,
  onSignOut,
  onRevokeAccess,
  onGetCurrentUser,
}: GoogleAuthScreenProps) => {
  return (
    <View style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Google Sign-In
        </ThemedText>

        {!userInfo ? (
          <View style={styles.signInContainer}>
            <GoogleSigninButton
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={onSignIn}
              disabled={isSigningIn}
            />
            <ThemedText style={styles.helpText}>
              Sign in with your Google account to continue
            </ThemedText>
          </View>
        ) : (
          <View style={styles.userInfoContainer}>
            {userInfo.picture && (
              <Image
                source={{ uri: userInfo.picture }}
                style={styles.avatar}
                contentFit="cover"
              />
            )}

            <ThemedView style={styles.infoCard}>
              <ThemedText type="subtitle">User Information</ThemedText>

              <View style={styles.infoRow}>
                <ThemedText type="defaultSemiBold">Name:</ThemedText>
                <ThemedText>{userInfo.nombre}</ThemedText>
              </View>

              <View style={styles.infoRow}>
                <ThemedText type="defaultSemiBold">Email:</ThemedText>
                <ThemedText>{userInfo.email}</ThemedText>
              </View>

              {userInfo.id && (
                <View style={styles.infoRow}>
                  <ThemedText type="defaultSemiBold">ID:</ThemedText>
                  <ThemedText numberOfLines={1}>{userInfo.id}</ThemedText>
                </View>
              )}
            </ThemedView>

            <View style={styles.buttonContainer}>
              <Button
                title="Get Current User Info"
                onPress={onGetCurrentUser}
              />
              <Button title="Sign Out" onPress={onSignOut} color="#FF6B6B" />
              <Button
                title="Revoke Access"
                onPress={onRevokeAccess}
                color="#FF3838"
              />
            </View>
          </View>
        )}
      </ThemedView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 30,
  },
  signInContainer: {
    alignItems: "center",
    gap: 20,
  },
  helpText: {
    textAlign: "center",
    opacity: 0.7,
  },
  userInfoContainer: {
    gap: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
  },
  infoCard: {
    padding: 20,
    borderRadius: 10,
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  buttonContainer: {
    gap: 10,
    marginTop: 10,
  },
});
