import { Doc, Id } from "@/convex/_generated/dataModel";
import { CustomPressable } from "@/components/ui/CustomPressable";
import { Avatar } from "@/components/ui/Avatar";
import { Alert, StyleSheet, Text, View } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { colors } from "@/constants";
import { GroupMemberModal } from "@/components/modal/GroupMemberModal";
import { useCallback, useState } from "react";
import { useId } from "@/lib/zustand/useId";
import { useHandleLeave } from "@/hooks/useHandleLeave";
import { LoadingModal } from "@/components/LoadingModal";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ConvexError } from "convex/values";
import { useShowToast } from "@/lib/zustand/useShowToast";
import { IconCrown } from "@tabler/icons-react-native";

type GroupMemberProps = {
  member: Doc<"users">;
  adminMembers: Id<"users">[];
  conversationId: Id<"conversations">;
  creatorId: Id<"users">;
};
export const GroupMember = ({
  member,
  adminMembers,
  conversationId,
  creatorId,
}: GroupMemberProps) => {
  const isAdmin = adminMembers.includes(member?._id);

  const makeAdmin = useMutation(api.message.makeGroupAdmin);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { onLeaveGroup, leaving } = useHandleLeave({
    conversationId,
    remove: true,
    userToRemoveId: member?._id,
  });
  const [visible, setVisible] = useState(false);
  const onClose = useCallback(() => setVisible(false), []);
  const onShowToast = useShowToast((state) => state.onShow);
  const id = useId((state) => state.id!);
  const loggedInUserIsAdmin = adminMembers.includes(id);
  const otherUserIsAdmin = !!adminMembers.find((i) => member?._id === i);
  const isCreator = creatorId === member._id;
  const loggedInUserIsCreator = creatorId === id;
  const isAdminButNotCreator = otherUserIsAdmin && !isCreator;
  const onPress = () => {
    if (id === member._id) return;
    setVisible(true);
  };
  const handleAdd = async (userId: Id<"users">) => {
    setIsLoading(true);

    try {
      await makeAdmin({ conversationId, userId });
      onShowToast({
        type: "success",
        message: "Success",
        description: `${member.name} has been made an admin`,
      });
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
      setIsLoading(false);
    }
  };
  const onAsk = (id: Id<"users">) => {
    Alert.alert(
      "Are you sure?",
      `You are about to make ${member.name} an admin`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Continue",
          style: "default",
          onPress: async () => {
            await handleAdd(id);
          },
        },
      ],
    );
  };

  return (
    <>
      <GroupMemberModal
        visible={visible}
        onClose={onClose}
        id={member?._id}
        name={member.name}
        onRemove={onLeaveGroup}
        isAdmin={loggedInUserIsAdmin}
        isAdminButNotCreator={isAdminButNotCreator}
        loggedInUserIsCreator={loggedInUserIsCreator}
        onAsk={onAsk}
        isCreator={isCreator}
      />
      <LoadingModal visible={leaving || isLoading} />
      <CustomPressable
        onPress={onPress}
        style={{
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={styles.avatarContainer}>
          <Avatar size={50} imgSrc={member.image} />
          <Text style={{ fontSize: RFPercentage(2), fontFamily: "NunitoBold" }}>
            {member.name}
          </Text>
        </View>
        {isAdmin && (
          <View style={styles.adminBtn}>
            <Text style={styles.adminText}>Group Admin</Text>
            {isCreator && <IconCrown color={colors.white} size={15} />}
          </View>
        )}
      </CustomPressable>
    </>
  );
};

const styles = StyleSheet.create({
  adminBtn: {
    backgroundColor: colors.lightblue,
    padding: 5,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  adminText: {
    fontSize: RFPercentage(1.3),
    fontFamily: "NunitoBold",
    color: colors.white,
  },
  avatarContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
});
