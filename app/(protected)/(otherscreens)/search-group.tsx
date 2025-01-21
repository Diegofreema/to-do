import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Wrapper } from "@/components/ui/Wrapper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/constants";
import { IconArrowNarrowLeft } from "@tabler/icons-react-native";
import { router } from "expo-router";
import React, { useState } from "react";
import { useDebounce } from "use-debounce";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useId } from "@/lib/zustand/useId";
import { EmptyText } from "@/components/EmptyText";
import { GroupConversation } from "@/components/GroupConvo";

const SearchConversations = () => {
  const { top } = useSafeAreaInsets();
  const id = useId((state) => state.id!);

  const [search, setSearch] = useState("");
  const [value] = useDebounce(search, 1000);
  const conversations = useQuery(
    api.conversation.searchGroup,
    value === "" ? "skip" : { search: value, id },
  );
  const onPress = () => {
    setSearch("");
    router.back();
  };

  const emptyText =
    value === "" ? "" : "You are not a member of any group with this name";
  return (
    <Wrapper styles={{ marginTop: top }}>
      <View style={styles.container}>
        <TouchableOpacity style={{ padding: 5 }} onPress={onPress}>
          <IconArrowNarrowLeft color={colors.black} size={30} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder={"Search by name"}
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <FlatList
        data={conversations}
        renderItem={({ item }) => <GroupConversation conversation={item} />}
        contentContainerStyle={{ gap: 15, flexGrow: 1 }}
        ListEmptyComponent={() => <EmptyText text={emptyText} />}
      />
    </Wrapper>
  );
};
export default SearchConversations;

const styles = StyleSheet.create({
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
    marginBottom: 20,
  },
  input: {
    flex: 1,
    fontFamily: "NunitoRegular",
    fontSize: 15,
  },
});
