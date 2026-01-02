import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/themed-view";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import CampamentoView from "@/components/CampamentoView";
import { CampamentoType } from "@/components/CampamentoView/useCampamentoView";

export default function CampamentoScreen() {
  const { campamentoType } = useLocalSearchParams<{
    campamentoType: CampamentoType;
  }>();

  return (
    <SafeAreaView>
      <ThemedView>
        <CampamentoView campamentoType={campamentoType} />
      </ThemedView>
    </SafeAreaView>
  );
}
