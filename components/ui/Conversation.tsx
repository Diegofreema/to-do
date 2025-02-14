import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
// import { LegacyRightAction } from "@/components/RightAction";
import { colors } from "@/constants";
import React from "react";
import { ConversationType } from "@/types";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AvatarContent } from "@/components/ui/AvatarContent";
import { useId } from "@/lib/zustand/useId";
import { formatDistanceToNow } from "date-fns";
import { UnreadCount } from "@/components/UnreadCount";

type Props = {
  conversation: ConversationType;
};
export const Conversation = ({ conversation }: Props) => {
  const id = useId((state) => state.id);

  const unread = useQuery(api.conversation.getUnreadMessages, {
    conversationId: conversation.id,
    userId: id!,
  });
  const { otherUser, lastMessageSenderId, lastMessage, lastMessageTime } =
    conversation;

  const isMine = lastMessageSenderId === id;
  const unreadCount = unread ?? 0;
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => router.push(`/singleChat/${otherUser?._id}`)}
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
            name={otherUser?.name || ""}
            image={otherUser?.image!}
            text={lastMessage}
            myMessage={isMine}
            isOnline={otherUser?.isOnline}
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
