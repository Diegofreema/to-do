import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { Title } from "@/components/typography/Title";
import { colors } from "@/constants";
import { RFPercentage } from "react-native-responsive-fontsize";
import { NewConversationType } from "@/types";
import { useNewGroupMembers } from "@/lib/zustand/useNewGroupMembers";
import { IconCheck } from "@tabler/icons-react-native";

type Props = {
  user: NewConversationType;
  onPress: () => void;
};
export const NewChatListItem = ({ user, onPress }: Props) => {
  const membersToAddToNewGroup = useNewGroupMembers((state) => state.members);
  const renderCheckIcon = membersToAddToNewGroup.find((m) => m.id === user.id);
  return (
    <TouchableOpacity
      style={styles.itemContainer}
      activeOpacity={0.5}
      onPress={onPress}
    >
      <View>
        <Image
          source={{ uri: user.image }}
          style={{ width: 60, height: 60, borderRadius: 50 }}
          contentFit={"cover"}
          placeholder={require("@/assets/images/place-user.jpeg")}
          placeholderContentFit={"cover"}
        />
        {renderCheckIcon && (
          <View style={styles.iconContainer}>
            <IconCheck color={colors.white} size={20} />
          </View>
        )}
      </View>

      <View>
        <Title
          text={user.name}
          textStyle={{ color: colors.black, fontSize: RFPercentage(2) }}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,

    paddingVertical: 10,
  },
  iconContainer: {
    height: 25,
    width: 25,
    position: "absolute",
    bottom: -4,
    right: -10,
    backgroundColor: colors.lightblue,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
