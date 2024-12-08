import { Animated } from "react-native";
import { colors } from "@/constants";
import { IconArchive } from "@tabler/icons-react-native";
import React from "react";

export function LegacyRightAction(prog: any, drag: any, onPress: () => void) {
  const trans = Animated.add(drag, 50);

  return (
    <Animated.View
      style={[
        {
          backgroundColor: colors.lightblue,
          justifyContent: "center",
          alignItems: "center",
          width: 60,
        },
        {
          transform: [{ translateX: trans }],
        },
      ]}
    >
      <IconArchive color={colors.white} size={30} onPress={onPress} />
    </Animated.View>
  );
}
