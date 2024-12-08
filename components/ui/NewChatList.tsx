import { FlatList, StyleSheet } from "react-native";
import { NewConversationType, PaginateType } from "@/types";
import { NewChatListItem } from "@/components/NewChatListItem";

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
    />
  );
};

const styles = StyleSheet.create({
  content: {
    gap: 15,
  },
});
