import { StyleSheet, Text, View } from "react-native";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { LoadingModal } from "@/components/LoadingModal";
import { AvatarPile } from "@/components/ui/AvatarPile";
import { RFPercentage } from "react-native-responsive-fontsize";
import { GroupMembers } from "@/components/GroupMembers";
import { useId } from "@/lib/zustand/useId";
import { Redirect } from "expo-router";
import React from "react";

export const GroupInfo = ({
  conversationId,
}: {
  conversationId: Id<"conversations">;
}) => {
  const data = useQuery(api.message.getGroupData, { conversationId });
  const loggedInUser = useId((state) => state.id!);
  const conversation = useQuery(api.conversation.getGroupConversation, {
    loggedInUser,
    conversationId,
  });
  if (data === undefined || conversation === undefined) {
    return <LoadingModal visible={true} />;
  }
  const isInGroup = conversation?.participants.includes(loggedInUser);
  if (!isInGroup) {
    return <Redirect href={"/chat"} />;
  }
  const images = data?.members.map((m) => m?.image!);
  console.log(data?.conversation?.creatorId);
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <AvatarPile avatars={images} size={100} maxAvatars={6} />
        <Text style={{ fontSize: RFPercentage(3), fontFamily: "NunitoBold" }}>
          {data?.conversation?.name}
        </Text>
        <Text
          style={{ fontSize: RFPercentage(2), fontFamily: "NunitoRegular" }}
        >
          {data?.memberCount} members
        </Text>
      </View>
      <GroupMembers
        members={data?.members}
        adminMembers={data?.conversation?.adminMembers!}
        conversationId={conversationId}
        creatorId={data?.conversation?.creatorId!}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 10,
  },
});
