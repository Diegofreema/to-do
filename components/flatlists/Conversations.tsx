import { FlatList, StyleSheet } from "react-native";
import { ConversationType } from "@/types";
import { Conversation } from "@/components/ui/Conversation";
import { Divider } from "@/components/ui/Divider";
import { EmptyChat } from "@/components/ui/EmptyChat";

type Props = {
  conversations: ConversationType[];
};
export const Conversations = ({ conversations }: Props) => {
  return (
    <FlatList
      data={conversations}
      renderItem={({ item }) => <Conversation conversation={item} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainerStyle}
      ItemSeparatorComponent={() => <Divider />}
      ListEmptyComponent={() => <EmptyChat />}
    />
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    gap: 20,
    flexGrow: 1,
  },
});
