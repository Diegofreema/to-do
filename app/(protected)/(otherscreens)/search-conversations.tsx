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
import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useId } from "@/lib/zustand/useId";
import { NewChatListItem } from "@/components/NewChatListItem";
import { EmptyText } from "@/components/EmptyText";

const SearchConversations = () => {
  const { top } = useSafeAreaInsets();
  const id = useId((state) => state.id!);

  const [search, setSearch] = useState("");
  const [value] = useDebounce(search, 1000);
  const userList = useQuery(
    api.user.searchUsers,
    value === "" ? "skip" : { search: value, id },
  );
  const onPress = () => {
    setSearch("");
    router.back();
  };
  const users = useMemo(
    () =>
      userList?.map((user) => ({
        id: user?._id,
        name: user?.name,
        image: user?.image,
        userId: user?.userId,
      })),
    [userList],
  );
  const emptyText =
    value === "" ? "" : "No student found, try a different name";
  const onNav = (id: string) => {
    router.push(`/singleChat/${id}`);
  };
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
        data={users}
        renderItem={({ item }) => (
          <NewChatListItem user={item} onPress={() => onNav(item.id)} />
        )}
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
