import { convexQuery } from '@convex-dev/react-query';
import { useQuery as useTanstackQuery } from '@tanstack/react-query';
import { Audio } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import {
  Redirect,
  router,
  useLocalSearchParams,
  usePathname,
} from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { GiftedChat, SystemMessage, Time } from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/Colors';
import { GroupChatMenu } from '@/components/GroupChatMenu';
import { InChatFileTransfer } from '@/components/InChatFileTransfer';
import { RenderActions } from '@/components/RenderAction';
import { RenderBubble } from '@/components/RenderBubble';
import { RenderComposer } from '@/components/RenderComposer';
import { RenderImage } from '@/components/RenderImage';
import { RenderSend } from '@/components/RenderSend';
import { AvatarContent } from '@/components/ui/AvatarContent';
import { ChatLoadingUi } from '@/components/ui/ChatLoadingUi';
import { Spacer } from '@/components/ui/Divider';
import { NavHeader } from '@/components/ui/NavHeader';
import { Wrapper } from '@/components/ui/Wrapper';
import { colors } from '@/constants';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { uploadProfilePicture } from '@/helper';
import { useGroupMessages } from '@/hooks/useGroupMessage';
import { useMarkRead } from '@/hooks/useMarkRead';
import { useAuth } from '@/lib/zustand/useAuth';
import { useGetImage } from '@/lib/zustand/useGetImage';
import { useId } from '@/lib/zustand/useId';
import { useShowToast } from '@/lib/zustand/useShowToast';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { IconChevronDown } from '@tabler/icons-react-native';
import { useMutation, usePaginatedQuery } from 'convex/react';
import * as Clipboard from 'expo-clipboard';
import { Image } from 'expo-image';
import { ScrollView } from 'moti';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const Chat = () => {
  const [text, setText] = useState(' ');
  const [sound, setSound] = useState<Audio.Sound>();
  const { showActionSheetWithOptions } = useActionSheet();
  const [messageId, setMessageId] = useState<Id<'messages'> | null>(null);
  const [isAttachImage, setIsAttachImage] = useState(false);
  // const [isAttachFile, setIsAttachFile] = useState(false);
  const [imagePaths, setImagePaths] = useState<string[]>([]);
  const [filePath, setFilePath] = useState('');
  const height = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    height: withSpring(height.value, {
      damping: 80,
      stiffness: 200,
    }),
  }));
  async function playSoundOut() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(
      require('@/assets/out.wav')
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
  const { id } = useLocalSearchParams<{ id: Id<'conversations'> }>();
  const loggedInUserId = useId((state) => state.id!);
  const { fname, lname } = useAuth((state) => state.user);
  const [sending, setSending] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const img = useGetImage((state) => state.image);
  const removeImage = useGetImage((state) => state.removeImage);
  const [hasTriedSending, setHasTriedSending] = useState(false);
  const generateUploadUrl = useMutation(api.chat.generateUploadUrl);
  const deleteMessage = useMutation(api.message.deleteMessage);
  const editText = useMutation(api.message.editMessage);
  const fullName = `${fname} ${lname}`;

  const { data: conversationData, isPending } = useTanstackQuery(
    convexQuery(api.conversation.getGroupConversation, {
      loggedInUser: loggedInUserId,
      conversationId: id,
    })
  );

  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.conversation.getGroupMessages,
    {
      conversationId: id,
    },
    { initialNumItems: 50 }
  );
  const isCreator =
    fullName.toLowerCase() === conversationData?.createdBy?.toLowerCase();
  const { messages, setMessages } = useGroupMessages({
    // @ts-expect-error
    results,
    loggedInUserId,
    creationTime: conversationData?._creationTime!,
    createdBy: conversationData?.createdBy!,
    isCreator,
  });
  const onShowToast = useShowToast((state) => state.onShow);
  const noParticipants = !conversationData?.participants?.length;
  useMarkRead({
    // @ts-expect-error
    results,
    noParticipants,
    loggedInUserId,
  });
  const conversationId = conversationData?._id;
  const recipients: Id<'users'>[] = useMemo(
    () => conversationData?.otherUsers.map((m) => m?._id!) || [],
    [conversationData?.otherUsers]
  );
  const createMessage = useMutation(api.conversation.createMessages);
  useEffect(() => {
    if (imagePaths.length) {
      height.value = 90;
    } else {
      height.value = 0;
    }
  }, [imagePaths, height]);
  const onDelete = (messageId: Id<'messages'>) => {
    const storageId = results.find((r) => r._id === messageId)?.storageId;

    Alert.alert('This is irreversible', 'Delete this message for everyone?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => deleteMessage({ messageId, storage: storageId }),
        style: 'destructive',
      },
    ]);
  };

  // const onPickDocument = async () => {
  //   const result = await DocumentPicker.getDocumentAsync({
  //     multiple: true,
  //     type: ["application/*"],
  //   });
  //   if (!result.canceled) {
  //     const { storageId, uploadUrl } = await uploadDoc(
  //       result,
  //       generateUploadUrl,
  //     );
  //     if (!conversationId) return;
  //     try {
  //       await createMessage({
  //         content: storageId,
  //         senderId: loggedInUserId,
  //         recipient: recipients,
  //         conversationId,
  //         contentType: "pdf",
  //         uploadUrl,
  //       });
  //     } catch (e) {
  //       console.log(e);
  //       onShowToast({
  //         description: "Something went wrong, Please try again",
  //         type: "error",
  //         message: "Failed to send",
  //       });
  //     }
  //   }
  // };
  const onPickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.5,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      console.log(result.assets);
      setImagePaths(result.assets.map((r) => r.uri));
      setIsAttachImage(true);

      // if (!storageId || !conversationId) return;
    }
  };
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
          {filePath.length > 0 && (
            <View style={styles.chatFooter}>
              <InChatFileTransfer filePath={filePath} />
              <TouchableOpacity
                onPress={() => setFilePath('')}
                style={styles.buttonFooterChat}
              >
                <Text style={styles.textFooterChat}>X</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </Animated.View>
    );
  }, [animatedStyle, filePath, imagePaths]);
  const pathname = usePathname();
  const onOpenCamera = () => {
    router.push(`/camera?path=${pathname}`);
    setHasTriedSending(false);
  };
  const onSendImage = useCallback(async () => {
    if (!img) return;
    if (!conversationId) {
      return;
    }

    setSending(true);
    try {
      const { storageId, uploadUrl } = await uploadProfilePicture(
        img,
        generateUploadUrl
      );

      if (!storageId || !uploadUrl) {
        throw new Error('Failed to upload image');
      }

      await createMessage({
        image: storageId,
        senderId: loggedInUserId,
        recipient: recipients,
        conversationId,
        contentType: 'image',
        uploadUrl,
      });

      removeImage();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Image send error:', errorMessage);

      onShowToast({
        description: 'Failed to send image. Please try again',
        type: 'error',
        message: 'Send Failed',
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
    recipients,
    removeImage,
  ]);
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
  }, [hasTriedSending, onSendImage]);
  const onSend = useCallback(
    async (messages = []) => {
      await playSoundOut();
      if (!conversationData?._id || !conversationId) return;
      setSending(true);
      if (isEditing) {
        if (!messageId) return;
        try {
          await editText({ content: text, messageId });
        } catch (e) {
          console.log(e);

          onShowToast({
            description: 'Something went wrong, Please try again',
            type: 'error',
            message: 'Failed to edit',
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
                generateUploadUrl
              );
              console.log({ uploadUrl });
              try {
                await createMessage({
                  image: storageId,
                  senderId: loggedInUserId,
                  recipient: recipients,
                  conversationId,
                  contentType: 'image',
                  uploadUrl,
                });
              } catch (e) {
                console.log(e);
                onShowToast({
                  description: 'Something went wrong, Please try again',
                  type: 'error',
                  message: 'Failed to send',
                });
              } finally {
                setImagePaths([]);
                setIsAttachImage(false);
                setSending(false);
              }
            })
          );
          if (text.trim() === '') return;
          try {
            await createMessage({
              content: text.trim(),
              senderId: loggedInUserId,
              recipient: recipients,
              conversationId,
              contentType: 'text',
            });
          } catch (e) {
            console.log(e);
            onShowToast({
              type: 'error',
              description: 'Failed to send text',
              message: 'Error',
            });
          }
        } else {
          setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, messages)
          );
          try {
            await createMessage({
              content: text.trim(),
              senderId: loggedInUserId,
              recipient: recipients,
              conversationId,
              contentType: 'text',
            });
          } catch (e) {
            console.log(e);
            onShowToast({
              description: 'Something went wrong, Please try again',
              type: 'error',
              message: 'Failed to send',
            });
          } finally {
            setSending(false);
          }
        }
      }
    },
    [
      conversationData?._id,
      conversationId,
      isEditing,
      messageId,
      editText,
      text,
      onShowToast,
      isAttachImage,

      imagePaths,
      generateUploadUrl,
      createMessage,
      loggedInUserId,
      recipients,
      setMessages,
    ]
  );

  const copyToClipboard = async (textToCopy: string) => {
    const copied = await Clipboard.setStringAsync(textToCopy);
    if (copied) {
      onShowToast({
        message: 'Copied to clipboard',
        type: 'success',
        description: '',
      });
    }
  };
  const onEdit = async ({
    textToEdit,
    messageId,
  }: {
    textToEdit: string;
    messageId: Id<'messages'>;
  }) => {
    setIsEditing(true);
    setMessageId(messageId);
    setText(textToEdit);
  };
  const name = conversationData?.name || '';
  const images = useMemo(
    () => conversationData?.otherUsers?.map((m) => m?.image!) || [],
    [conversationData?.otherUsers]
  );
  const MemoizedChild = useMemo(
    () => (
      <AvatarContent
        chat
        color={'white'}
        name={name}
        image={images}
        hideOnlineStatus
      />
    ),
    [name, images]
  );
  if (isPending) {
    return (
      <>
        <Spacer space={insets.top} />
        <ChatLoadingUi />
      </>
    );
  }
  const isInGroup = conversationData?.participants.includes(loggedInUserId);
  if (!isInGroup) {
    return <Redirect href={'/chat'} />;
  }
  const loadEarlier = status === 'CanLoadMore';
  const disabled =
    (imagePaths.length < 1 && text.trim() === '' && !filePath) || sending;
  const onLoadMore = () => {
    if (isLoading) return;
    loadMore(20);
  };

  const placeholder = isAttachImage ? 'Add a caption...' : 'type a message...';
  const loggedInUserIsChief = conversationData?.creatorId === loggedInUserId;
  return (
    <Wrapper
      styles={{
        marginTop: insets.top,
        marginBottom: insets.bottom,
        paddingHorizontal: 0,
        flex: 1,
      }}
    >
      <View
        style={{
          backgroundColor: colors.lightblue,
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <NavHeader color={'white'} avatarContent={MemoizedChild} title="" />
        <GroupChatMenu
          conversationId={conversationId!}
          loggedInUserIsChief={loggedInUserIsChief}
        />
      </View>
      <View style={{ flex: 1 }}>
        <GiftedChat
          messages={messages}
          renderMessageImage={(props) => (
            <RenderImage
              {...props}
              showActionSheetWithOptions={showActionSheetWithOptions}
              onDelete={onDelete}
            />
          )}
          loadEarlier={loadEarlier}
          onLoadEarlier={onLoadMore}
          keyboardShouldPersistTaps={'always'}
          placeholder={placeholder}
          onSend={(messages: any) => onSend(messages)}
          onInputTextChanged={setText}
          text={text}
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
          scrollToBottomComponent={() => (
            <IconChevronDown color={colors.lightblue} size={20} />
          )}
          alwaysShowSend={true}
          renderUsernameOnMessage={true}
          renderUsername={(user) => (
            <Text style={{ fontSize: 10, color: 'white', paddingLeft: 7 }}>
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
        />
        {Platform.OS === 'android' && (
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
    transform: [{ rotateY: '180deg' }],
  },
  sendButton: { marginBottom: 10, marginRight: 10 },
  sendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    color: 'gray',
    marginLeft: 2,
  },
  buttonFooterChat: {
    width: 20,
    height: 20,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    borderColor: 'black',
    right: 3,
    top: -2,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 2,
  },
  buttonFooterChatImg: {
    width: 25,
    height: 25,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    borderColor: 'black',
    left: 55,
    top: -4,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 5,
  },
  textFooterChat: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'gray',
  },
  chatFooter: {
    shadowColor: '#1F2687',
    flexGrow: 1,
    shadowOpacity: 0.37,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    flexDirection: 'row',
    padding: 5,
    backgroundColor: colors.lightblue,
    gap: 10,
  },
  container: {},
});
export default Chat;
