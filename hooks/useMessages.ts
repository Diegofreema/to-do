import { useEffect, useState } from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";

type Props = {
  _id: number | Id<"messages">;
  system?: boolean;
  text: string;
  createdAt: Date;
  user: {
    _id: number | Id<"users">;
    name?: string;
  };
};

type MessageType = {
  results: Doc<"messages">[];
  loggedInUserId: Id<"users">;
  creationTime: number;
  otherUserName: string;
};
export const useMessages = ({
  results,
  loggedInUserId,
  creationTime,
  otherUserName,
}: MessageType) => {
  const [messages, setMessages] = useState<Props[]>([]);
  useEffect(() => {
    if (!results) return;
    setMessages([
      ...results?.map((message) => {
        return {
          _id: message?._id,
          text: message?.content,
          createdAt: new Date(message?._creationTime),
          user: {
            _id: message?.senderId,
            name:
              message.senderId === loggedInUserId
                ? "You"
                : otherUserName.split(" ")[0],
          },
        };
      }),
      {
        _id: 0,
        system: true,
        text: "",
        createdAt: new Date(creationTime),
        user: {
          _id: 0,
          name: "Bot",
        },
      },
    ]);
  }, [results, loggedInUserId, otherUserName, creationTime]);
  return { messages, setMessages };
};
