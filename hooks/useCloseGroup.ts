import { ConvexError } from "convex/values";
import { useState } from "react";
import { Alert } from "react-native";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { router } from "expo-router";

type Props = {
  conversationId: Id<"conversations">;
};

export const useCloseGroup = ({ conversationId }: Props) => {
  const [leaving, setLeaving] = useState(false);
  const closeGroup = useMutation(api.message.closeGroup);

  const handleClose = async () => {
    setLeaving(true);
    try {
      await closeGroup({ conversationId });
      router.replace("/chat");
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
        `Failed to close group, please try again later`,
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
  const onCloseGroup = () => {
    Alert.alert("Are you sure?", `This can't be reversed`, [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Continue",
        onPress: () => handleClose(),
        style: "destructive",
      },
    ]);
  };
  return { leaving, onCloseGroup };
};
