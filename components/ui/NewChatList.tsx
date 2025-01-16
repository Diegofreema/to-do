import { FlatList, StyleSheet } from "react-native";
import { NewConversationType, PaginateType } from "@/types";
import { NewChatListItem } from "@/components/NewChatListItem";
import { EmptyText } from "@/components/EmptyText";
import { router } from "expo-router";
import { useNewGroupMembers } from "@/lib/zustand/useNewGroupMembers";

type Props = PaginateType & {
  results: NewConversationType[];
  group?: boolean;
};

export const NewChatList = ({
  results,
  status,
  loadMore,
  isLoading,
  group,
}: Props) => {
  const addMember = useNewGroupMembers((state) => state.addMember);

  const onLoadMore = () => {
    if (status === "CanLoadMore" && !isLoading) {
      loadMore(20);
    }
  };
  const onPress = (user: NewConversationType) => {
    if (group) {
      addMember(user);
    } else {
      onNav(user.id);
    }
  };
  const onNav = (id: string) => {
    router.push(`/singleChat/${id}`);
  };

  return (
    <FlatList
      data={results}
      renderItem={({ item }) => (
        <NewChatListItem user={item} onPress={() => onPress(item)} />
      )}
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
