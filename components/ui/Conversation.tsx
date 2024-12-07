import { StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { Swipeable } from "react-native-gesture-handler";
import { LegacyRightAction } from "@/components/RightAction";
import { Avatar } from "@/components/ui/Avatar";
import { Title } from "@/components/typography/Title";
import { colors } from "@/constants";
import React, { useRef } from "react";
import { ConversationType } from "@/types";

type Props = {
  conversation: ConversationType;
};
export const Conversation = ({ conversation }: Props) => {
  const legacyRef = useRef<Swipeable>(null);
  console.log(conversation);
  const onPress = () => {
    if (legacyRef.current) {
      legacyRef.current.close();
    }
  };
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => router.push("/singleChat/1")}
    >
      <Swipeable
        ref={legacyRef}
        friction={2}
        enableTrackpadTwoFingerGesture
        rightThreshold={40}
        renderRightActions={(progress, dragX) =>
          LegacyRightAction(progress, dragX, onPress)
        }
        containerStyle={styles.swipeable}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Avatar />
          <Title text={"name"} textStyle={{ color: colors.black }} />
        </View>
      </Swipeable>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  separator: {
    width: "100%",
    borderTopWidth: 1,
  },
  swipeable: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    elevation: 3,

    borderRadius: 8,
    marginTop: 20,
    paddingLeft: 10,
    paddingVertical: 15,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
});
