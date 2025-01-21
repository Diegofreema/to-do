import React from "react";
import { FlatList, StyleSheet } from "react-native";

import { ConversationType, PaginateType } from "@/types";
import { Conversation } from "@/components/ui/Conversation";
import { Divider } from "@/components/ui/Divider";
import { EmptyChat } from "@/components/ui/EmptyChat";
import { colors } from "@/constants";
import Animated, { SlideInLeft, SlideOutLeft } from "react-native-reanimated";

type Props = PaginateType & {
  conversations: ConversationType[];
};

export const Conversations = ({
  conversations,
  loadMore,
  isLoading,
  status,
}: Props) => {
  const handleLoadMore = () => {
    if (status === "CanLoadMore" && !isLoading) {
      loadMore(20);
    }
  };
  return (
    <Animated.View
      entering={SlideInLeft.springify().damping(80).stiffness(200)}
      exiting={SlideOutLeft}
      style={{ flex: 1 }}
    >
      <FlatList
        data={conversations}
        renderItem={({ item }) => <Conversation conversation={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainerStyle}
        ItemSeparatorComponent={() => <Divider />}
        ListEmptyComponent={() => <EmptyChat />}
        onEndReached={handleLoadMore}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    gap: 10,
    flexGrow: 1,
    backgroundColor: colors.white,
    marginTop: 10,
    paddingHorizontal: 10,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
});
