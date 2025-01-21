import { IconUserPlus } from "@tabler/icons-react-native";
import { router } from "expo-router";
import { FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Doc, Id } from "@/convex/_generated/dataModel";
import { GroupMember } from "@/components/GroupMember";
import { LeaveGroup } from "@/components/LeaveGroup";
import { ActionIcon } from "@/components/ui/ActionIcon";
import { useId } from "@/lib/zustand/useId";

type Props = {
  members: Doc<"users">[];
  adminMembers: Id<"users">[];
  conversationId: Id<"conversations">;
  creatorId: Id<"users">;
};

export const GroupMembers = ({
  members,
  adminMembers,
  conversationId,
  creatorId,
}: Props) => {
  const { bottom } = useSafeAreaInsets();
  const id = useId((state) => state.id!);
  const isAdmin = adminMembers.includes(id);

  console.log({ creatorId });
  const onAction = () => {
    router.push(`/add-member?conversationId=${conversationId}`);
  };
  return (
    <FlatList
      ListHeaderComponent={() =>
        isAdmin ? (
          <ActionIcon
            icon={IconUserPlus}
            text={"Add members"}
            onPress={onAction}
          />
        ) : null
      }
      style={{ marginTop: 20, flex: 1 }}
      data={members}
      renderItem={({ item }) => (
        <GroupMember
          member={item}
          adminMembers={adminMembers}
          conversationId={conversationId}
          creatorId={creatorId}
        />
      )}
      contentContainerStyle={{ gap: 20, flexGrow: 1 }}
      ListFooterComponent={
        <LeaveGroup
          conversationId={conversationId}
          isCreator={creatorId === id}
        />
      }
      ListFooterComponentStyle={{ marginTop: "auto", marginBottom: bottom }}
    />
  );
};
