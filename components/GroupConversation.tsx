import { FlatList, StyleSheet } from "react-native";
import { GroupConversationType, PaginateType } from "@/types";
import { Divider } from "@/components/ui/Divider";
import { EmptyChat } from "@/components/ui/EmptyChat";
import React from "react";
import { colors } from "@/constants";
import { GroupConversation } from "@/components/GroupConvo";

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
    <FlatList
      data={data}
      renderItem={({ item }) => <GroupConversation conversation={item} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainerStyle}
      ItemSeparatorComponent={() => <Divider />}
      ListEmptyComponent={() => <EmptyChat />}
      onEndReached={handleLoadMore}
    />
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
