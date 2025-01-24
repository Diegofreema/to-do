import { useEffect, useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { SingleMessageType } from "@/types";

type Props = {
  _id: number | Id<"messages">;
  system?: boolean;
  text: string;
  createdAt: Date;
  image?: string;
  audio?: string;
  user: {
    _id: number | Id<"users">;
    name?: string;
  };
};

type MessageType = {
  results: SingleMessageType[];
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
          image: message.image,
          audio: message.pdf,
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
