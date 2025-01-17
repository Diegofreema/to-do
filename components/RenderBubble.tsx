import React from "react";
import { Bubble, BubbleProps, IMessage } from "react-native-gifted-chat";

import { colors } from "@/constants";
import { ActionSheetOptions } from "@expo/react-native-action-sheet";
import { Id } from "@/convex/_generated/dataModel";

type Props = BubbleProps<IMessage> & {
  onCopy: (text: string) => void;
  showActionSheetWithOptions(
    options: ActionSheetOptions,
    callback: (i?: number) => void | Promise<void>,
  ): void;
  onEdit: ({
    textToEdit,
    messageId,
  }: {
    textToEdit: string;
    messageId: Id<"messages">;
  }) => void;
  onDelete: (messageId: Id<"messages">) => void;
};

export const RenderBubble = ({
  onCopy,
  showActionSheetWithOptions,
  onEdit,
  onDelete,
  ...props
}: Props) => {
  const onPress = () => {
    const options = ["Delete", "Copy text", "Edit", "Cancel"];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 3;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (selectedIndex?: number) => {
        console.log(selectedIndex);
        switch (selectedIndex) {
          case 1:
            onCopy(props.currentMessage.text);
            break;
          case 2:
            onEdit({
              textToEdit: props.currentMessage.text,
              messageId: props.currentMessage._id as Id<"messages">,
            });
            break;
          case destructiveButtonIndex:
            onDelete(props.currentMessage._id as Id<"messages">);
            break;

          case cancelButtonIndex:
          // Canceled
        }
      },
    );
  };
  return (
    <Bubble
      {...props}
      onLongPress={onPress}
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
