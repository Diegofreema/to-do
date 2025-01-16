import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Audio } from "expo-av";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { Id } from "@/convex/_generated/dataModel";
import { useId } from "@/lib/zustand/useId";
import { useQuery as useTanstackQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@/convex/_generated/api";
import { useMutation, usePaginatedQuery } from "convex/react";
import { useMarkRead } from "@/hooks/useMarkRead";
import { Bubble, GiftedChat, SystemMessage } from "react-native-gifted-chat";
import { AvatarContent } from "@/components/ui/AvatarContent";
import { Spacer } from "@/components/ui/Divider";
import { colors } from "@/constants";
import { Wrapper } from "@/components/ui/Wrapper";
import { NavHeader } from "@/components/ui/NavHeader";
import Colors from "@/Colors";
import { RenderActions } from "@/components/RenderAction";
import { RenderComposer } from "@/components/RenderComposer";
import { RenderSend } from "@/components/RenderSend";
import { useGroupMessages } from "@/hooks/useGroupMessage";
import { ChatLoadingUi } from "@/components/ui/ChatLoadingUi";

const Chat = () => {
  const [text, setText] = useState("");
  const [sound, setSound] = useState<Audio.Sound>();
  async function playSoundOut() {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(
      require("@/assets/out.wav"),
    );
    setSound(sound);

    await sound.playAsync();
  }
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: Id<"conversations"> }>();
  const loggedInUserId = useId((state) => state.id!);
  const { data: conversationData, isPending } = useTanstackQuery(
    convexQuery(api.conversation.getGroupConversation, {
      loggedInUser: loggedInUserId,
      conversationId: id,
    }),
  );
  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.conversation.getGroupMessages,
    {
      conversationId: id,
    },
    { initialNumItems: 50 },
  );
  const { messages, setMessages } = useGroupMessages({
    results,
    loggedInUserId,
    creationTime: conversationData?._creationTime!,
    createdBy: conversationData?.createdBy!,
  });

  const noParticipants = !conversationData?.participants?.length;
  useMarkRead({
    results,
    noParticipants,
    loggedInUserId,
  });

  const createMessage = useMutation(api.conversation.createMessages);

  const onSend = useCallback(
    async (messages = []) => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages),
      );
      await playSoundOut();
      if (!conversationData?._id) return;
      await createMessage({
        content: text.trim(),
        senderId: loggedInUserId,
        recipient: conversationData?.otherUsers.map((m) => m?._id!),
        conversationId: conversationData?._id,
      });
    },
    [
      createMessage,
      loggedInUserId,
      text,
      conversationData,
      conversationData?._id,
    ],
  );

  const name = conversationData?.name || "";

  const images = conversationData?.otherUsers?.map((m) => m?.image!) || [];
  const MemoizedChild = useMemo(
    () => <AvatarContent chat color={"white"} name={name} image={images} />,
    [name, images],
  );
  if (isPending) {
    return (
      <>
        <Spacer space={insets.top} />
        <ChatLoadingUi />
      </>
    );
  }
  const loadEarlier = status === "CanLoadMore";
  const onLoadMore = () => {
    if (isLoading) return;
    loadMore(20);
  };
  return (
    <Wrapper
      styles={{
        marginTop: insets.top,
        marginBottom: insets.bottom,
        paddingHorizontal: 0,
        flex: 1,
      }}
    >
      <View style={{ backgroundColor: colors.lightblue }}>
        <NavHeader color={"white"} avatarContent={MemoizedChild} title="" />
      </View>
      <View style={{ flex: 1 }}>
        <GiftedChat
          messages={messages}
          alignTop={true}
          loadEarlier={loadEarlier}
          onLoadEarlier={onLoadMore}
          keyboardShouldPersistTaps={"always"}
          onSend={(messages: any) => onSend(messages)}
          onInputTextChanged={setText}
          user={{
            _id: loggedInUserId,
          }}
          renderSystemMessage={(props) => (
            <SystemMessage {...props} textStyle={{ color: Colors.gray }} />
          )}
          bottomOffset={insets.bottom}
          renderAvatar={null}
          maxComposerHeight={100}
          textInputProps={styles.composer}
          scrollToBottom={true}
          renderUsernameOnMessage={true}
          renderUsername={(user) => (
            <Text style={{ fontSize: 10, color: "white", paddingLeft: 7 }}>
              {user.name}
            </Text>
          )}
          renderBubble={(props) => {
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
          }}
          renderActions={(props) => (
            <RenderActions {...props} onPickDocument={() => {}} />
          )}
          renderComposer={(props) => (
            <RenderComposer {...props} onPickImage={() => {}} />
          )}
          renderSend={(props) => <RenderSend text={text} {...props} />}
        />
        {Platform.OS === "android" && (
          <KeyboardAvoidingView behavior="height" />
        )}
      </View>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  composer: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    height: 44,
    marginVertical: 10,
  },
});
export default Chat;
