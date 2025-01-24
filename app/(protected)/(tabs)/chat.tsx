import { Wrapper } from "@/components/ui/Wrapper";
import { ErrorBoundaryProps, router } from "expo-router";
import React, { useState } from "react";
import { NewChatBtn } from "@/components/NewChatBtn";
import { useId } from "@/lib/zustand/useId";
import { ErrorComponent } from "@/components/ui/ErrorComponent";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ChatLoader } from "@/components/Skeletons/ChatLoader";
import { Conversations } from "@/components/flatlists/Conversations";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { IconSearch } from "@tabler/icons-react-native";
import { colors } from "@/constants";
import { CustomPressable } from "@/components/ui/CustomPressable";
import { GroupConversations } from "@/components/GroupConversation";

export function ErrorBoundary({ retry }: ErrorBoundaryProps) {
  return <ErrorComponent retry={retry} />;
}
const options = ["Single", "Group"];
const Chat = () => {
  const id = useId((state) => state.id);
  const [selectedTab, setSelectedTab] = useState("Single");
  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.conversation.getConversations,
    {
      userId: id!,
    },
    { initialNumItems: 20 },
  );
  const {
    results: groupResults,
    status: groupStatus,
    loadMore: groupLoadMore,
    isLoading: groupIsLoading,
  } = usePaginatedQuery(
    api.conversation.getGroupConversations,
    { userId: id! },
    { initialNumItems: 20 },
  );
  if (status === "LoadingFirstPage" || groupStatus === "LoadingFirstPage") {
    return (
      <Wrapper>
        <TouchableOpacity
          style={[styles.container, { marginBottom: 20 }]}
          onPress={() => router.push("/search-conversations")}
          disabled
        >
          <IconSearch color={colors.black} size={30} />

          <Text style={styles.input}>Search</Text>
        </TouchableOpacity>
        <ChatLoader />
      </Wrapper>
    );
  }
  const route =
    selectedTab === "Single" ? "/search-conversations" : "/search-group";
  return (
    <Wrapper styles={{ paddingHorizontal: 0 }}>
      <View style={{ paddingHorizontal: 15, gap: 10 }}>
        <TouchableOpacity
          style={[styles.container]}
          onPress={() => router.push(route)}
        >
          <IconSearch color={colors.black} size={30} />
          <Text style={styles.input}>Search</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", gap: 15 }}>
          {options.map((option) => {
            const isActive = option === selectedTab;
            return (
              <CustomPressable
                key={option}
                style={[styles.press, isActive && styles.pressActive]}
                onPress={() => setSelectedTab(option)}
              >
                <Text style={[styles.text, isActive && styles.activeText]}>
                  {option}
                </Text>
              </CustomPressable>
            );
          })}
        </View>
      </View>
      {selectedTab === "Single" && (
        <Conversations
          conversations={results}
          isLoading={isLoading}
          loadMore={loadMore}
          status={status}
        />
      )}
      {selectedTab === "Group" && (
        <GroupConversations
          isLoading={groupIsLoading}
          loadMore={groupLoadMore}
          status={groupStatus}
          data={groupResults}
        />
      )}
      <NewChatBtn />
    </Wrapper>
  );
};

export default Chat;

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
    padding: 5,
    marginTop: 10,
  },
  input: {
    flex: 1,
    fontFamily: "NunitoRegular",
    fontSize: 15,
  },
  press: {
    borderWidth: 1,
    borderColor: colors.lightblue,
    borderRadius: 20,
    padding: 10,
  },
  pressActive: {
    backgroundColor: colors.lightblue,
  },
  activeText: {
    color: colors.white,
  },
  text: {
    fontFamily: "NunitoRegular",
  },
});
