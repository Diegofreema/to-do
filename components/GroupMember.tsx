import { Doc, Id } from "@/convex/_generated/dataModel";
import { CustomPressable } from "@/components/ui/CustomPressable";
import { Avatar } from "@/components/ui/Avatar";
import { StyleSheet, Text, View } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { colors } from "@/constants";
import { GroupMemberModal } from "@/components/modal/GroupMemberModal";
import { useCallback, useState } from "react";
import { useId } from "@/lib/zustand/useId";
import { useHandleLeave } from "@/hooks/useHandleLeave";
import { LoadingModal } from "@/components/LoadingModal";

type GroupMemberProps = {
  member: Doc<"users">;
  adminMembers: Id<"users">[];
  conversationId: Id<"conversations">;
};
export const GroupMember = ({
  member,
  adminMembers,
  conversationId,
}: GroupMemberProps) => {
  const isAdmin = adminMembers.includes(member?._id);
  const { onLeaveGroup, leaving } = useHandleLeave({
    conversationId,
    remove: true,
    userToRemoveId: member?._id,
  });
  const [visible, setVisible] = useState(false);
  const onClose = useCallback(() => setVisible(false), []);
  const id = useId((state) => state.id);
  const onPress = () => {
    if (id === member._id) return;
    setVisible(true);
  };
  return (
    <>
      <GroupMemberModal
        visible={visible}
        onClose={onClose}
        id={member?._id}
        name={member.name}
        onRemove={onLeaveGroup}
      />
      <LoadingModal visible={leaving} />
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
          </View>
        )}
      </CustomPressable>
    </>
  );
};

const styles = StyleSheet.create({
  adminBtn: { backgroundColor: colors.lightblue, padding: 5, borderRadius: 4 },
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
