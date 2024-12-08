import { FlatList, StyleSheet } from "react-native";
import { NewConversationType, PaginateType } from "@/types";
import { NewChatListItem } from "@/components/NewChatListItem";
import { EmptyText } from "@/components/EmptyText";

type Props = PaginateType & {
  results: NewConversationType[];
};

export const NewChatList = ({
  results,
  status,
  loadMore,
  isLoading,
}: Props) => {
  console.log(results.length);
  const onLoadMore = () => {
    if (status === "CanLoadMore") {
      loadMore(20);
    }
  };
  return (
    <FlatList
      data={results}
      renderItem={({ item }) => <NewChatListItem user={item} />}
      contentContainerStyle={styles.content}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={() => <EmptyText text={"No student found"} />}
    />
  );
};

const styles = StyleSheet.create({
  content: {
    gap: 15,
    flexGrow: 1,
  },
});
