import { FlatList, StyleSheet } from "react-native";
import { GroupConversationType, PaginateType } from "@/types";
import { Divider } from "@/components/ui/Divider";
import { EmptyChat } from "@/components/ui/EmptyChat";
import React from "react";
import { colors } from "@/constants";
import { GroupConversation } from "@/components/GroupConvo";
import Animated, { SlideInRight, SlideOutRight } from "react-native-reanimated";

type Props = PaginateType & {
  data: GroupConversationType[];
};
export const GroupConversations = ({
  status,
  loadMore,
  isLoading,
  data,
}: Props) => {
  console.log(data);
  const handleLoadMore = () => {
    if (status === "CanLoadMore" && !isLoading) {
      loadMore(20);
    }
  };
  return (
    <Animated.View
      entering={SlideInRight.springify().damping(80).stiffness(200)}
      exiting={SlideOutRight}
      style={{ flex: 1 }}
    >
      <FlatList
        data={data}
        renderItem={({ item }) => <GroupConversation conversation={item} />}
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
