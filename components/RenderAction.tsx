import React from "react";
import { Actions, ActionsProps } from "react-native-gifted-chat";

import { IconPaperclip } from "@tabler/icons-react-native";
import { colors } from "@/constants";
import { CustomPressable } from "@/components/ui/CustomPressable";

type Props = ActionsProps & {
  onPickDocument: () => void;
};

export const RenderActions = ({ onPickDocument, ...props }: Props) => {
  return (
    <Actions
      {...props}
      icon={() => (
        <CustomPressable onPress={onPickDocument}>
          <IconPaperclip size={24} color={colors.lightblue} />
        </CustomPressable>
      )}
      containerStyle={{
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 15,
      }}
    />
  );
};
