import { Wrapper } from "@/components/ui/Wrapper";
import { SearchHeader } from "@/components/SearchHeader";
import { View } from "react-native";
import { ChatLoader } from "@/components/Skeletons/ChatLoader";
import { ErrorBoundaryProps, router } from "expo-router";
import { useId } from "@/lib/zustand/useId";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/lib/zustand/useAuth";
import { ErrorComponent } from "@/components/ui/ErrorComponent";
import React from "react";
import { NewChatList } from "@/components/ui/NewChatList";
import { ActionIcon } from "@/components/ui/ActionIcon";
import { Spacer } from "@/components/ui/Divider";
import { IconUsersPlus } from "@tabler/icons-react-native";

export function ErrorBoundary({ retry }: ErrorBoundaryProps) {
  return <ErrorComponent retry={retry} />;
}

export const NewChat = () => {
  const id = useId((state) => state.id);
  const {
    user: { Faculty, Department },
  } = useAuth();
  const { results, loadMore, isLoading, status } = usePaginatedQuery(
    api.conversation.getOtherUsers,
    { userId: id!, faculty: Faculty, department: Department },
    { initialNumItems: 30 },
  );

  if (isLoading) {
    return (
      <>
        <SearchHeader />
        <ChatLoader />
      </>
    );
  }

  const onAction = () => {
    router.push("/newGroup");
  };
  return (
    <Wrapper>
      <SearchHeader />
      <View style={{ marginTop: 10 }}>
        <ActionIcon
          icon={IconUsersPlus}
          onPress={onAction}
          text={"New group"}
        />
        <Spacer space={30} />
        <NewChatList
          results={results}
          loadMore={loadMore}
          isLoading={isLoading}
          status={status}
        />
      </View>
    </Wrapper>
  );
};
