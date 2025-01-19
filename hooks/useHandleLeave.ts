import { ConvexError } from "convex/values";
import { useState } from "react";
import { Alert } from "react-native";

import { useId } from "@/lib/zustand/useId";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

type Props = {
  conversationId: Id<"conversations">;
  remove?: boolean;
  userToRemoveId?: Id<"users">;
};

export const useHandleLeave = ({
  conversationId,
  remove,
  userToRemoveId,
}: Props) => {
  const [leaving, setLeaving] = useState(false);
  const loggedInUserId = useId((state) => state.id!);
  const leaveGroup = useMutation(api.conversation.leaveGroup);
  const idToRemove = remove ? userToRemoveId : loggedInUserId;
  const description = remove
    ? "This user won't be able to "
    : "You will no longer ";
  const text = remove ? "remove" : "leave";
  const handleLeave = async () => {
    setLeaving(true);
    try {
      await leaveGroup({ conversationId, loggedInUserId: idToRemove! });
    } catch (error) {
      const errorMessage =
        // Check whether the error is an application error
        error instanceof ConvexError
          ? // Access data and cast it to the type we expect
            (error.data as string)
          : // Must be some developer error,
            // and prod deployments will not
            // reveal any more information about it
            // to the client
            "Unexpected error occurred";
      Alert.alert(
        errorMessage,
        `Failed to ${text} group, please try again later`,
        [
          {
            text: "OK",
            style: "default",
          },
        ],
      );
    } finally {
      setLeaving(false);
    }
  };
  const onLeaveGroup = () => {
    Alert.alert(
      "Are you sure?",
      `${description}receive messages from this group`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: remove ? "Remove" : "Leave",
          onPress: () => handleLeave(),
          style: "destructive",
        },
      ],
    );
  };
  return { leaving, onLeaveGroup };
};
