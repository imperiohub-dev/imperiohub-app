import { View, StyleSheet, Image } from "react-native";
import { ThemedText } from "@/components/themed-text";
import {
  Spacing,
  FontSizes,
  FontWeights,
  BorderRadius,
  BrandColors,
} from "@/constants/theme";
import { UserInfo } from "@/types/user";

interface HeaderProfileProps {
  userInfo: UserInfo | null;
  textSecondaryColor: string;
}

export default function HeaderProfile({
  userInfo,
  textSecondaryColor,
}: HeaderProfileProps) {
  return (
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
          style={[styles.subGreeting, { color: textSecondaryColor }]}
        >
          Bienvenido a tu espacio de metas
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
