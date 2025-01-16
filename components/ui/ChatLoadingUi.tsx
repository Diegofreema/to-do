import { ActivityIndicator, Platform, StyleSheet, View } from "react-native";
import { ChatSkeletonUI } from "@/components/Skeletons/ChatSkeleton";
import { colors } from "@/constants";
import React from "react";

export const ChatLoadingUi = () => {
  return Platform.select({
    ios: <ChatSkeletonUI />,
    android: (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.lightblue} />
      </View>
    ),
  });
};

const styles = StyleSheet.create({
  container: { flex: 0.8, justifyContent: "center", alignItems: "center" },
});
