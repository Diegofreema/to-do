import { useEffect } from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

type MarkRead = {
  noParticipants: boolean;
  loggedInUserId: Id<"users">;
  results: Doc<"messages">[];
};
export const useMarkRead = ({
  noParticipants,
  loggedInUserId,
  results,
}: MarkRead) => {
  const markAsRead = useMutation(api.conversation.addSeenId);
  useEffect(() => {
    const onMarkMessagesAsRead = async () => {
      // Early return if no data or no conversation participants
      if (!results || noParticipants) return;

      // Find messages unseen by ALL participants
      const messagesThatEveryParticipantHasNotSeen = results.filter(
        (message) => {
          // Ensure seenId is an array and check against all participants
          return !message.senderId.includes(loggedInUserId);
        },
      );
      // Only proceed if there are messages to mark
      if (messagesThatEveryParticipantHasNotSeen.length > 0) {
        await markAsRead({
          messages: messagesThatEveryParticipantHasNotSeen.map((m) => m._id),
          id: loggedInUserId,
        });
      }
    };
    onMarkMessagesAsRead();
  }, [markAsRead, results, loggedInUserId, noParticipants]);
};
