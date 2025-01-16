import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";

import { ActionIcon } from "@/components/ui/ActionIcon";
import { Icon } from "@tabler/icons-react-native";
import { colors } from "@/constants";

type Props = {
  icon: Icon;
  onPress: () => void;
  loading?: boolean;
};
export const AbsoluteAction = ({ onPress, icon: Icon, loading }: Props) => {
  return (
    <Animated.View entering={ZoomIn} exiting={ZoomOut} style={styles.abs}>
      {loading ? (
        <ActivityIndicator size="small" color={colors.lightblue} />
      ) : (
        <ActionIcon icon={Icon} onPress={onPress} />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  abs: {
    position: "absolute",
    right: 10,
    bottom: 50,
  },
});
