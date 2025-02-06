import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GiftedChat, SystemMessage, Time } from "react-native-gifted-chat";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/Colors";
import { RenderActions } from "@/components/RenderAction";
import { RenderBubble } from "@/components/RenderBubble";
import { RenderComposer } from "@/components/RenderComposer";
import { RenderImage } from "@/components/RenderImage";
import { RenderSend } from "@/components/RenderSend";
import { ChatSkeletonUI } from "@/components/Skeletons/ChatSkeleton";
import { AvatarContent } from "@/components/ui/AvatarContent";
import { Spacer } from "@/components/ui/Divider";
import { ErrorComponent } from "@/components/ui/ErrorComponent";
import { NavHeader } from "@/components/ui/NavHeader";
import { Wrapper } from "@/components/ui/Wrapper";
import { colors } from "@/constants";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { uploadProfilePicture } from "@/helper";
import { useCreateConversation } from "@/hooks/useCreateConversation";
import { useMarkRead } from "@/hooks/useMarkRead";
import { useMessages } from "@/hooks/useMessages";
import { useGetImage } from "@/lib/zustand/useGetImage";
import { useId } from "@/lib/zustand/useId";
import { useShowToast } from "@/lib/zustand/useShowToast";
import { convexQuery } from "@convex-dev/react-query";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { useQuery as useTanstackQuery } from "@tanstack/react-query";
import { useMutation, usePaginatedQuery } from "convex/react";
import * as Clipboard from "expo-clipboard";
import { Image } from "expo-image";
import {
  ErrorBoundaryProps,
  router,
  useLocalSearchParams,
  usePathname,
} from "expo-router";
import { ScrollView } from "moti";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { sendPushNotification } from "@/utils/sendPushNotification";
import { useAuth } from "@/lib/zustand/useAuth";

export function ErrorBoundary({ retry }: ErrorBoundaryProps) {
  return <ErrorComponent retry={retry} />;
}

const Chat = () => {
  const [text, setText] = useState("");
  const [hasTriedSending, setHasTriedSending] = useState(false);
  const [isAttachImage, setIsAttachImage] = useState(false);

  const [imagePaths, setImagePaths] = useState<string[]>([]);

  const { showActionSheetWithOptions } = useActionSheet();
  const [sending, setSending] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [messageId, setMessageId] = useState<Id<"messages"> | null>(null);
  const editText = useMutation(api.message.editMessage);
  const generateUploadUrl = useMutation(api.chat.generateUploadUrl);
  const pathname = usePathname();
  const onOpenCamera = () => {
    router.push(`/camera?path=${pathname}`);
    setHasTriedSending(false);
  };
  const insets = useSafeAreaInsets();

  const { id } = useLocalSearchParams<{ id: Id<"users"> }>();
  const loggedInUserId = useId((state) => state.id!);
  const senderName = useAuth((state) => state.user.fname);
  const img = useGetImage((state) => state.image);
  const removeImage = useGetImage((state) => state.removeImage);
  const [loading, setLoading] = useState(false);
  const deleteMessage = useMutation(api.message.deleteMessage);
  const { data: conversationData, isPending } = useTanstackQuery(
    convexQuery(api.conversation.getSingleConversationWithMessages, {
      loggedInUserId,
      otherUserId: id,
    }),
  );
  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.conversation.getMessages,
    {
      conversationId: conversationData?.conversation?._id!,
    },
    { initialNumItems: 50 },
  );
  const pushToken = conversationData?.otherUser?.pushToken!;
  const { messages, setMessages } = useMessages({
    // @ts-ignore
    results,
    otherUserName: conversationData?.otherUser?.name!,
    loggedInUserId,
    creationTime: conversationData?.conversation._creationTime!,
  });

  const noParticipants = !conversationData?.conversation?.participants?.length;
  useMarkRead({
    // @ts-ignore
    results,
    noParticipants,
    loggedInUserId,
  });
  const onShowToast = useShowToast((state) => state.onShow);
  const recipient = conversationData?.otherUser?._id!;
  const height = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    height: withSpring(height.value, {
      damping: 80,
      stiffness: 200,
    }),
  }));
  const createMessage = useMutation(api.conversation.createMessages);
  useCreateConversation({
    isConversationIsNull: conversationData === null,
    setLoading,
    id,
    loggedInUserId,
  });
  const conversationId = conversationData?.conversation?._id;
  useEffect(() => {
    if (imagePaths.length) {
      height.value = 90;
    } else {
      height.value = 0;
    }
  }, [imagePaths, height]);
  // Early return if no image
  console.log({ conversationId, hasTriedSending });

  const onSendImage = useCallback(async () => {
    if (!img) return;
    if (!conversationId) {
      return;
    }

    setSending(true);
    try {
      const { storageId, uploadUrl } = await uploadProfilePicture(
        img,
        generateUploadUrl,
      );

      if (!storageId || !uploadUrl) {
        new Error("Failed to upload image");
      }

      await createMessage({
        image: storageId,
        senderId: loggedInUserId,
        recipient,
        conversationId,
        contentType: "image",
        uploadUrl,
      });
      await sendPushNotification(
        pushToken,
        senderName,
        "Sent you a image",
        conversationId,
      );
      removeImage();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Image send error:", errorMessage);

      onShowToast({
        description: "Failed to send image. Please try again",
        type: "error",
        message: "Send Failed",
      });
    } finally {
      setSending(false);
    }
  }, [
    conversationId,
    createMessage,
    generateUploadUrl,
    img,
    loggedInUserId,
    onShowToast,
    recipient,
    removeImage,
  ]);
  console.log({ img });

  useEffect(() => {
    if (!hasTriedSending) {
      onSendImage();
      setHasTriedSending(true);
    }
    return () => {
      if (hasTriedSending) {
        setHasTriedSending(false);
      }
    };
  }, [hasTriedSending, onSendImage]); // Reduced dependency array to essential items

  const onSend = useCallback(
    async (messages = []) => {
      if (!conversationId) return;
      setSending(true);
      if (isEditing) {
        if (!messageId) return;
        try {
          await editText({ content: text, messageId });
        } catch (e) {
          console.log(e);
          onShowToast({
            description: "Something went wrong, Please try again",
            type: "error",
            message: "Failed to edit",
          });
        } finally {
          setMessageId(null);
          setIsEditing(false);
          setSending(false);
        }
      } else {
        if (isAttachImage) {
          await Promise.all(
            imagePaths.map(async (image) => {
              const { storageId, uploadUrl } = await uploadProfilePicture(
                image,
                generateUploadUrl,
              );
              try {
                await createMessage({
                  image: storageId,
                  senderId: loggedInUserId,
                  recipient: recipient,
                  conversationId,
                  contentType: "image",
                  uploadUrl,
                });
                await sendPushNotification(
                  pushToken,
                  senderName,
                  "Sent you a image",
                  conversationId,
                );

                if (text.trim() === "") return;
                try {
                  await createMessage({
                    content: text.trim(),
                    senderId: loggedInUserId,
                    recipient,
                    conversationId,
                    contentType: "text",
                  });
                  await sendPushNotification(
                    pushToken,
                    senderName,
                    text.trim(),
                    conversationId,
                  );
                } catch (e) {
                  console.log(e);
                  onShowToast({
                    type: "error",
                    description: "Failed to send text",
                    message: "Error",
                  });
                }
              } catch (e) {
                console.log(e);
                onShowToast({
                  description: "Something went wrong, Please try again",
                  type: "error",
                  message: "Failed to send",
                });
              } finally {
                setImagePaths([]);
                setIsAttachImage(false);
                setSending(false);
              }
            }),
          );
        } else {
          setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, messages),
          );
          try {
            await createMessage({
              content: text.trim(),
              senderId: loggedInUserId,
              recipient: conversationData?.otherUser?._id!,
              conversationId,
              contentType: "text",
            });
            await sendPushNotification(
              pushToken,
              senderName,
              text.trim(),
              conversationId,
            );
          } catch (e) {
            console.log(e);
            onShowToast({
              description: "Something went wrong, Please try again",
              type: "error",
              message: "Failed to send",
            });
          } finally {
            setSending(false);
          }
        }
      }
    },
    [
      createMessage,
      loggedInUserId,
      text,
      conversationData,
      conversationId,
      isAttachImage,

      imagePaths,
      messageId,
      isEditing,
      editText,

      generateUploadUrl,
      onShowToast,
      recipient,
      setMessages,
    ],
  );

  // const _pickDocument = async () => {
  //   try {
  //     const result = await AllDocumentPicker.pick({
  //       type: [AllDocumentPicker.types.pdf],
  //       copyTo: "documentDirectory",
  //       mode: "import",
  //       allowMultiSelection: true,
  //     });
  //
  //     const fileUri = result.map((r) => r.fileCopyUri!);
  //     if (!fileUri.length) {
  //       console.log("File URI is undefined or null");
  //       return;
  //     }
  //     setFilePath(fileUri);
  //     setIsAttachFile(true);
  //   } catch (err) {
  //     if (AllDocumentPicker.isCancel(err)) {
  //       console.log("User cancelled file picker");
  //     } else {
  //       console.log("DocumentPicker err => ", err);
  //       throw err;
  //     }
  //   }
  // };

  const disabled = (imagePaths.length < 1 && text.trim() === "") || sending;
  const onDelete = (messageId: Id<"messages">) => {
    const storageId = results.find((r) => r._id === messageId)?.storageId;
    Alert.alert("This is irreversible", "Delete this message for everyone?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => deleteMessage({ messageId, storage: storageId }),
        style: "destructive",
      },
    ]);
  };
  const copyToClipboard = async (textToCopy: string) => {
    const copied = await Clipboard.setStringAsync(textToCopy);
    if (copied) {
      onShowToast({
        message: "Copied to clipboard",
        type: "success",
        description: "",
      });
    }
  };
  const onEdit = async ({
    textToEdit,
    messageId,
  }: {
    textToEdit: string;
    messageId: Id<"messages">;
  }) => {
    setIsEditing(true);
    setMessageId(messageId);
    setText(textToEdit);
  };
  const onPickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      console.log(result.assets);
      setImagePaths(result.assets.map((r) => r.uri));
      setIsAttachImage(true);
    }
  };
  const name = conversationData?.otherUser?.name || "";
  const isOnline = conversationData?.otherUser?.isOnline || false;
  const image = conversationData?.otherUser?.image || "";
  const renderChatFooter = useCallback(() => {
    return (
      <Animated.View style={animatedStyle}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chatFooter}
        >
          {imagePaths.length > 0 &&
            imagePaths.map((image, i) => (
              <View key={i}>
                <Image
                  source={{ uri: image }}
                  style={{ height: 75, width: 75 }}
                />
                <TouchableOpacity
                  onPress={() => {
                    if (imagePaths.length === 1) {
                      setIsAttachImage(false);
                    }
                    setImagePaths(imagePaths.filter((_, index) => i !== index));
                  }}
                  style={styles.buttonFooterChatImg}
                >
                  <Text style={styles.textFooterChat}>X</Text>
                </TouchableOpacity>
              </View>
            ))}
        </ScrollView>
      </Animated.View>
    );
  }, [imagePaths, animatedStyle]);
  const MemoizedChild = useMemo(
    () => (
      <AvatarContent
        chat
        isOnline={isOnline}
        color={"white"}
        name={name}
        image={image}
      />
    ),
    [name, image, isOnline],
  );
  if (loading || isPending) {
    return (
      <>
        <Spacer space={insets.top} />
        {Platform.OS === "ios" ? (
          <ChatSkeletonUI />
        ) : (
          <View
            style={{
              flex: 0.8,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color={colors.lightblue} />
          </View>
        )}
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
          renderMessageImage={(props) => (
            <RenderImage
              {...props}
              showActionSheetWithOptions={showActionSheetWithOptions}
              onDelete={onDelete}
            />
          )}
          renderUsername={(user) => (
            <Text style={{ fontSize: 10, color: "white", paddingLeft: 7 }}>
              {user.name}
            </Text>
          )}
          renderBubble={(props) => (
            <RenderBubble
              {...props}
              onCopy={copyToClipboard}
              showActionSheetWithOptions={showActionSheetWithOptions}
              onEdit={onEdit}
              onDelete={onDelete}
              loggedInUserId={loggedInUserId}
            />
          )}
          renderActions={(props) => (
            <RenderActions
              disable={imagePaths.length > 0}
              {...props}
              onPickDocument={onPickImage}
            />
          )}
          renderTime={(props) => (
            <Time
              {...props}
              timeTextStyle={{
                right: {
                  color: colors.lightblue,
                },
                left: {
                  color: colors.white,
                },
              }}
            />
          )}
          renderComposer={(props) => (
            <RenderComposer {...props} onPickImage={onOpenCamera} />
          )}
          renderFooter={renderChatFooter}
          renderSend={(props) => (
            <RenderSend
              disabled={disabled}
              image={isAttachImage}
              {...props}
              sending={sending}
            />
          )}
          alwaysShowSend
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
  paperClip: {
    marginTop: 8,
    marginHorizontal: 5,
    transform: [{ rotateY: "180deg" }],
  },
  sendButton: { marginBottom: 10, marginRight: 10 },
  sendContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  fileContainer: {
    flex: 1,
    maxWidth: 300,
    marginVertical: 2,
    borderRadius: 15,
  },
  fileText: {
    marginVertical: 5,
    fontSize: 16,
    lineHeight: 20,
    marginLeft: 10,
    marginRight: 5,
  },
  textTime: {
    fontSize: 10,
    color: "gray",
    marginLeft: 2,
  },
  buttonFooterChat: {
    width: 20,
    height: 20,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    borderColor: "black",
    right: 3,
    top: -2,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    zIndex: 2,
  },
  buttonFooterChatImg: {
    width: 25,
    height: 25,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    borderColor: "black",
    left: 55,
    top: -4,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    padding: 5,
  },
  textFooterChat: {
    fontSize: 15,
    fontWeight: "bold",
    color: "gray",
  },
  chatFooter: {
    shadowColor: "#1F2687",
    flexGrow: 1,
    shadowOpacity: 0.37,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
    flexDirection: "row",
    padding: 5,
    backgroundColor: colors.lightblue,
    gap: 10,
  },
});
export default Chat;
