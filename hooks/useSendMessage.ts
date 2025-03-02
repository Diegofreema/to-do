import { useCallback, useState } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { useShowToast } from '@/lib/zustand/useShowToast';
import { uploadProfilePicture } from '@/helper';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

interface Message {
  _id: string;
  text: string;
  createdAt: Date;
  user: {
    _id: string;
  };
  image?: string;
}

export const useMessageSender = (
  conversationId: Id<'conversations'>,
  loggedInUserId: Id<'users'>,
  recipients: Id<'users'>[],
  playSoundOut: () => Promise<void>
) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [imagePaths, setImagePaths] = useState<string[]>([]);
  const [isAttachImage, setIsAttachImage] = useState(false);
  const onShowToast = useShowToast((state) => state.onShow);
  const generateUploadUrl = useMutation(api.chat.generateUploadUrl);
  const createMessage = useMutation(api.conversation.createMessages);
  // Helper function to update UI messages
  const appendLocalMessage = useCallback((newMessages: Message[]) => {
    setMessages((prev) => GiftedChat.append(prev, newMessages));
  }, []);

  // Helper function to handle errors
  const handleError = useCallback(
    (error: Error) => {
      console.error('Message send error:', error);
      onShowToast({
        description: 'Something went wrong, Please try again',
        type: 'error',
        message: 'Failed to send',
      });
    },
    [onShowToast]
  );

  // Handle image message creation
  const handleImageMessage = useCallback(
    async (image: string) => {
      try {
        const { storageId, uploadUrl } = await uploadProfilePicture(
          image,
          generateUploadUrl
        );

        await createMessage({
          content: storageId,
          senderId: loggedInUserId,
          recipient: recipients,
          conversationId,
          contentType: 'image',
          uploadUrl,
        });
      } catch (error) {
        handleError(error as Error);
        throw error; // Re-throw to handle in the parent
      }
    },
    [
      conversationId,
      loggedInUserId,
      recipients,
      handleError,
      createMessage,
      generateUploadUrl,
    ]
  );

  // Handle text message creation
  const handleTextMessage = useCallback(
    async (text: string) => {
      try {
        await createMessage({
          content: text.trim(),
          senderId: loggedInUserId,
          recipient: recipients,
          conversationId,
          contentType: 'text',
        });
      } catch (error) {
        handleError(error as Error);
        throw error;
      }
    },
    [conversationId, loggedInUserId, recipients, handleError, createMessage]
  );

  const onSend = useCallback(
    async (messages: Message[] = []) => {
      if (!conversationId) {
        handleError(new Error('No conversation ID provided'));
        return;
      }

      try {
        await playSoundOut();

        if (isAttachImage && imagePaths.length > 0) {
          // Create local messages for images
          imagePaths.forEach((image, index) => {
            const newMessage: Message = {
              _id: `${messages[0]._id}-${index}-${Date.now()}`,
              text: '',
              createdAt: new Date(),
              user: { _id: loggedInUserId },
              image,
            };
            appendLocalMessage([newMessage]);
          });

          // Upload and send all images
          await Promise.all(imagePaths.map(handleImageMessage));

          // Reset image state
          setImagePaths([]);
          setIsAttachImage(false);
        } else {
          // Handle text message
          appendLocalMessage(messages);
          await handleTextMessage(messages[0].text);
        }
      } catch (error) {
        handleError(error as Error);
      }
    },
    [
      conversationId,
      loggedInUserId,
      isAttachImage,
      imagePaths,
      appendLocalMessage,
      handleImageMessage,
      handleTextMessage,
      handleError,
      playSoundOut,
    ]
  );

  return { onSend, messages };
};
