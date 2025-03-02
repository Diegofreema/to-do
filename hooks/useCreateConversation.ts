import { useEffect } from 'react';
import { Id } from '@/convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

type Conversation = {
  loggedInUserId: Id<'users'>;
  id: Id<'users'>;
  setLoading: (value: React.SetStateAction<boolean>) => void;
  isConversationIsNull: boolean;
};
export const useCreateConversation = ({
  loggedInUserId,
  id,
  setLoading,
  isConversationIsNull,
}: Conversation) => {
  const createSingleConversation = useMutation(
    api.conversation.createSingleConversation
  );

  useEffect(() => {
    if (isConversationIsNull) {
      const createConvo = async () => {
        setLoading(true);
        try {
          await createSingleConversation({ loggedInUserId, otherUserId: id });
        } catch (e) {
          console.log(e);
          throw Error('Something went wrong');
        } finally {
          setLoading(false);
        }
      };

      createConvo();
    }
  }, [
    isConversationIsNull,
    createSingleConversation,
    loggedInUserId,
    id,
    setLoading,
  ]);
};
