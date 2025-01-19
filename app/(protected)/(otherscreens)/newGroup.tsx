import { Wrapper } from "@/components/ui/Wrapper";
import { SearchHeader } from "@/components/SearchHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Spacer } from "@/components/ui/Divider";
import { ChatLoader } from "@/components/Skeletons/ChatLoader";
import React from "react";
import { NewChatList } from "@/components/ui/NewChatList";
import { NewGroupUsers } from "@/components/NewGroupUsers";
import { useNewGroupMembers } from "@/lib/zustand/useNewGroupMembers";
import { IconArrowRight } from "@tabler/icons-react-native";
import { router } from "expo-router";
import { AbsoluteAction } from "@/components/AbsoluteAction";
import { usePaginatedUsers } from "@/hooks/usePaginatedUsers";

const NewGroup = () => {
  const { top } = useSafeAreaInsets();
  const hasMember = useNewGroupMembers((state) => state.members);
  const clearMembers = useNewGroupMembers((state) => state.clearMembers);
  const { formatedResults, status, loadMore, isLoading } = usePaginatedUsers();

  if (status === "LoadingFirstPage") {
    return (
      <Wrapper styles={{ marginTop: top }}>
        <SearchHeader title={"New Group"} />
        <Spacer space={10} />
        <ChatLoader />
      </Wrapper>
    );
  }

  const onAction = () => router.push("/create-group");
  return (
    <Wrapper styles={{ marginTop: top }}>
      <SearchHeader title={"New Group"} onPress={clearMembers} />
      <Spacer space={10} />
      <NewGroupUsers />
      <Spacer space={10} />
      <NewChatList
        results={formatedResults}
        loadMore={loadMore}
        isLoading={isLoading}
        status={status}
        group
      />
      {hasMember.length > 0 && (
        <AbsoluteAction icon={IconArrowRight} onPress={onAction} />
      )}
    </Wrapper>
  );
};
export default NewGroup;
