import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { GroupConversationType } from "@/types";
import { useId } from "@/lib/zustand/useId";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { router } from "expo-router";
import { AvatarContent } from "@/components/ui/AvatarContent";
import { formatDistanceToNow } from "date-fns";
import { UnreadCount } from "@/components/UnreadCount";
import React from "react";
import { colors } from "@/constants";
import { trimText } from "@/helper";

type GroupConvoProps = {
  conversation: GroupConversationType;
};
export const GroupConversation = ({ conversation }: GroupConvoProps) => {
  const id = useId((state) => state.id);

  const unread = useQuery(api.conversation.getUnreadMessages, {
    conversationId: conversation.id,
    userId: id!,
  });
  const {
    otherUsers,
    name,
    lastMessageSenderId,
    lastMessage,
    lastMessageTime,
    createdBy,
  } = conversation;

  const isMine = lastMessageSenderId === id;
  const unreadCount = unread ?? 0;
  const text = lastMessage || `Created by ${createdBy}`;
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => router.push(`/group-chat/${conversation.id}`)}
    >
      <View style={styles.swipeable}>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <AvatarContent
            name={name || ""}
            image={[...otherUsers?.map((u) => u?.image!)]}
            text={trimText(text, 15)}
            myMessage={isMine}
          />
          <View style={{ marginTop: 10 }}>
            {lastMessageTime && (
              <Text style={{ fontSize: 12, fontFamily: "NunitoLight" }}>
                {formatDistanceToNow(lastMessageTime, {
                  includeSeconds: true,
                })}
              </Text>
            )}
            {unreadCount > 0 && <UnreadCount unread={unreadCount} />}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  separator: {
    width: "100%",
    borderTopWidth: 1,
  },
  swipeable: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
});
