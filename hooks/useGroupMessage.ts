import { useEffect, useState } from 'react';
import { Id } from '@/convex/_generated/dataModel';
import { GroupMessageType } from '@/types';

type Props = {
  _id: number | Id<'messages'>;
  system?: boolean;
  text: string;
  createdAt: Date;
  user: {
    _id: number | Id<'users'>;
    name?: string;
  };
  image?: string;
};

type MessageType = {
  results: GroupMessageType[];
  loggedInUserId: Id<'users'>;
  creationTime: number;
  createdBy: string;
  isCreator: boolean;
};
export const useGroupMessages = ({
  results,
  loggedInUserId,
  creationTime,
  createdBy,
  isCreator,
}: MessageType) => {
  const [messages, setMessages] = useState<Props[]>([]);

  useEffect(() => {
    if (!results) return;
    setMessages([
      ...results?.map((message) => {
        return {
          _id: message?._id,
          text: message.content,
          createdAt: new Date(message?._creationTime),
          image: message.image,
          user: {
            _id: message?.senderId,
            name:
              message.senderId === loggedInUserId ? 'You' : message.senderName,
          },
        };
      }),
      {
        _id: 0,
        system: true,
        text: `Create by ${isCreator ? 'You' : createdBy}`,
        createdAt: new Date(creationTime),
        user: {
          _id: 0,
          name: 'Bot',
        },
      },
    ]);
  }, [results, loggedInUserId, creationTime, isCreator, createdBy]);
  return { messages, setMessages };
};
