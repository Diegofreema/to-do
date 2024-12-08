import { FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";
import { ConversationType, PaginateType } from "@/types";
import { Conversation } from "@/components/ui/Conversation";
import { Divider } from "@/components/ui/Divider";
import { EmptyChat } from "@/components/ui/EmptyChat";
import React from "react";
import { IconSearch } from "@tabler/icons-react-native";
import { colors } from "@/constants";
import { router } from "expo-router";

type Props = PaginateType & {
  conversations: ConversationType[];
};

export const Conversations = ({ conversations }: Props) => {
  return (
    <FlatList
      ListHeaderComponent={() => (
        <TouchableOpacity
          style={styles.container}
          onPress={() => router.push("/search-conversations")}
        >
          <IconSearch color={colors.black} size={30} />

          <Text style={styles.input}>Search</Text>
        </TouchableOpacity>
      )}
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
    gap: 10,
    flexGrow: 1,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 5,
    backgroundColor: colors.white,
    marginTop: 10,
    padding: 5,
  },
  input: {
    flex: 1,
    fontFamily: "NunitoRegular",
    fontSize: 15,
  },
});
