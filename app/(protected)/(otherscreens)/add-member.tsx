import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Wrapper } from "@/components/ui/Wrapper";
import { NewChatList } from "@/components/ui/NewChatList";
import { usePaginatedUsers } from "@/hooks/usePaginatedUsers";
import { SearchHeader } from "@/components/SearchHeader";
import { Spacer } from "@/components/ui/Divider";
import { ChatLoader } from "@/components/Skeletons/ChatLoader";
import { NewGroupUsers } from "@/components/NewGroupUsers";
import { useNewGroupMembers } from "@/lib/zustand/useNewGroupMembers";
import { AbsoluteAction } from "@/components/AbsoluteAction";
import { IconPlus } from "@tabler/icons-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useShowToast } from "@/lib/zustand/useShowToast";
import { ConvexError } from "convex/values";

const AddMember = () => {
  const { formatedResults, status, loadMore, isLoading } = usePaginatedUsers();
  const { conversationId } = useLocalSearchParams<{
    conversationId: Id<"conversations">;
  }>();
  const data = useQuery(api.message.getGroupData, { conversationId });
  const { top } = useSafeAreaInsets();
  const addToGroup = useMutation(api.message.addToGroup);
  const [adding, setAdding] = useState(false);
  const onShowToast = useShowToast((state) => state.onShow);
  const hasMember = useNewGroupMembers((state) => state.members);
  const clearMembers = useNewGroupMembers((state) => state.clearMembers);
  const membersId = data?.conversation?.participants;
  const formatedMembers = formatedResults.filter(
    (m) => !membersId?.includes(m.id),
  );
  if (status === "LoadingFirstPage" || data === undefined) {
    return (
      <Wrapper styles={{ marginTop: top }}>
        <SearchHeader title={"New Group"} />
        <Spacer space={10} />
        <ChatLoader />
      </Wrapper>
    );
  }
  const onAction = async () => {
    setAdding(true);
    try {
      await addToGroup({
        conversationId,
        usersToAddIds: hasMember.map((m) => m.id),
      });
      clearMembers();
      onShowToast({
        type: "success",
        message: "Success",
        description: "New members has been added",
      });
      router.back();
    } catch (error) {
      const errorMessage =
        error instanceof ConvexError
          ? (error.data as string)
          : "Unexpected error occurred";
      onShowToast({
        type: "error",
        message: "Error",
        description: errorMessage,
      });
    } finally {
      setAdding(false);
    }
  };
  return (
    <>
      <Wrapper styles={{ marginTop: top }}>
        <SearchHeader title={"Add member"} onPress={clearMembers} />
        <Spacer space={10} />
        <NewGroupUsers />
        <Spacer space={10} />
        <NewChatList
          results={formatedMembers}
          loadMore={loadMore}
          isLoading={isLoading}
          status={status}
          group
        />
        {hasMember.length > 0 && (
          <AbsoluteAction icon={IconPlus} onPress={onAction} loading={adding} />
        )}
      </Wrapper>
    </>
  );
};
export default AddMember;
