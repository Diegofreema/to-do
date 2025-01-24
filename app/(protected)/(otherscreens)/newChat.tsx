import { NewChat } from "@/components/NewChat";
import { Wrapper } from "@/components/ui/Wrapper";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const NewChatScreen = () => {
  const { top } = useSafeAreaInsets();
  return (
    <Wrapper styles={{ marginTop: top }}>
      <NewChat />
    </Wrapper>
  );
};

export default NewChatScreen;
