import { View } from "react-native";
import { colors } from "@/constants";
import { IconSend } from "@tabler/icons-react-native";
import { IMessage, Send, SendProps } from "react-native-gifted-chat";
import React from "react";

type Props = SendProps<IMessage> & {
  text: string;
};
export const RenderSend = ({ text, ...props }: Props) => {
  return (
    <View
      style={{
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.lightblue,
        paddingHorizontal: 14,
        width: 40,
        borderRadius: 5,
        marginLeft: 10,
        marginBottom: 7,
      }}
    >
      {text === "" && (
        <IconSend color={colors.lightGray} style={{ opacity: 0.5 }} size={25} />
      )}

      {text !== "" && (
        <Send {...props} containerStyle={{ justifyContent: "center" }}>
          <IconSend color={colors.white} size={25} />
        </Send>
      )}
    </View>
  );
};
