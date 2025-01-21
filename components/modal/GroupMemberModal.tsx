import { Modal, StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants";
import { CustomPressable } from "@/components/ui/CustomPressable";
import { Id } from "@/convex/_generated/dataModel";
import { ActionIcon } from "@/components/ui/ActionIcon";
import { IconX } from "@tabler/icons-react-native";
import { router } from "expo-router";

type GroupMemberModalProps = {
  visible: boolean;
  onClose: () => void;
  id: Id<"users">;
  name: string;
  onRemove: () => void;
  isAdmin: boolean;
  onAsk: (id: Id<"users">) => void;
  isCreator: boolean;
  loggedInUserIsCreator: boolean;
  isAdminButNotCreator: boolean;
};

export const GroupMemberModal = ({
  onClose,
  visible,
  name,
  id,
  onRemove,
  isAdmin,
  onAsk,
  loggedInUserIsCreator,

  isAdminButNotCreator,
}: GroupMemberModalProps) => {
  const onMessage = () => {
    onClose();
    router.push(`/singleChat/${id}`);
  };
  const onLeave = async () => {
    onClose();
    onRemove();
  };
  const onMakeAdmin = () => {
    onAsk(id);
    onClose();
  };
  return (
    <Modal
      visible={visible}
      transparent
      onRequestClose={onClose}
      animationType={"slide"}
    >
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <ActionIcon
            icon={IconX}
            onPress={onClose}
            style={{ position: "absolute", right: 5, zIndex: 3, top: 0 }}
          />
          {isAdmin && (
            <CustomPressable onPress={onMakeAdmin}>
              <Text style={styles.text}>Make group admin</Text>
            </CustomPressable>
          )}
          <CustomPressable onPress={onMessage}>
            <Text style={styles.text}>Message {name}</Text>
          </CustomPressable>
          {loggedInUserIsCreator && isAdminButNotCreator && (
            <CustomPressable onPress={onLeave}>
              <Text style={styles.text}>Dismiss as admin</Text>
            </CustomPressable>
          )}
          {isAdmin && (
            <CustomPressable onPress={onLeave}>
              <Text style={styles.text}>Remove {name}</Text>
            </CustomPressable>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  subContainer: {
    backgroundColor: colors.lightblue,
    borderRadius: 8,
    padding: 20,
    width: "85%",
    marginHorizontal: "auto",
    gap: 15,
  },
  text: {
    color: "white",
    fontSize: 18,
    fontFamily: "NunitoMedium",
  },
});
