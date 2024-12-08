import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { Swipeable } from "react-native-gesture-handler";
import { LegacyRightAction } from "@/components/RightAction";
import { colors } from "@/constants";
import React, { useRef } from "react";
import { ConversationType } from "@/types";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ChatLoader } from "@/components/Skeletons/ChatLoader";
import { AvatarContent } from "@/components/ui/AvatarContent";
import { Spacer } from "@/components/ui/Divider";
import { useId } from "@/lib/zustand/useId";
import { formatDistanceToNow } from "date-fns";

type Props = {
  conversation: ConversationType;
};
export const Conversation = ({ conversation }: Props) => {
  const id = useId((state) => state.id);
  const legacyRef = useRef<Swipeable>(null);
  const data = useQuery(api.user.getUserConvexId, {
    userId: conversation.otherUserId!,
  });
  const unread = useQuery(api.conversation.getUnreadMessages, {
    conversationId: conversation.id,
    userId: id!,
  });
  const onPress = () => {
    if (legacyRef.current) {
      legacyRef.current.close();
    }
  };

  if (!data || unread === undefined) {
    return (
      <>
        <Spacer space={20} />
        <ChatLoader length={1} />
      </>
    );
  }

  const isMine = conversation.lastMessageSenderId === id;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => router.push(`/singleChat/${conversation.otherUserId}`)}
    >
      <Swipeable
        ref={legacyRef}
        friction={2}
        enableTrackpadTwoFingerGesture
        rightThreshold={40}
        renderRightActions={(progress, dragX) =>
          LegacyRightAction(progress, dragX, onPress)
        }
        containerStyle={styles.swipeable}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <AvatarContent
            name={data?.name || ""}
            image={data?.image!}
            text={conversation.lastMessage}
            myMessage={isMine}
            isOnline={data.isOnline}
          />
          <View style={{ marginTop: 10 }}>
            {conversation?.lastMessageTime && (
              <Text style={{ fontSize: 12, fontFamily: "NunitoLight" }}>
                {formatDistanceToNow(conversation.lastMessageTime, {
                  includeSeconds: true,
                })}{" "}
                ago
              </Text>
            )}
            {unread > 0 && (
              <View style={styles.unread}>
                <Text style={{ color: "white", fontFamily: "NunitoBold" }}>
                  {unread}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Swipeable>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  separator: {
    width: "100%",
    borderTopWidth: 1,
  },
  swipeable: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    elevation: 3,

    borderRadius: 8,
    marginTop: 20,
    paddingHorizontal: 10,
    paddingVertical: 15,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    width: "100%",
  },
  unread: {
    alignSelf: "flex-end",
    marginTop: "auto",
    backgroundColor: colors.lightblue,
    borderRadius: 20,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
