import { Bubble, BubbleProps, IMessage } from "react-native-gifted-chat";
import { colors } from "@/constants";
import React from "react";

type Props = BubbleProps<IMessage> & {};

export const RenderBubble = ({ ...props }: Props) => {
  return (
    <Bubble
      {...props}
      textStyle={{
        right: {
          color: "#000",
        },
        left: {
          color: "#fff",
        },
      }}
      wrapperStyle={{
        left: {
          backgroundColor: colors.lightblue,
        },
        right: {
          backgroundColor: colors.lightGray,
        },
      }}
    />
  );
};
