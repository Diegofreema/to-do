import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { Title } from "@/components/typography/Title";
import { colors } from "@/constants";
import { RFPercentage } from "react-native-responsive-fontsize";
import { NewConversationType } from "@/types";
import { router } from "expo-router";

type Props = {
  user: NewConversationType;
};
export const NewChatListItem = ({ user }: Props) => {
  console.log(user);
  const onPress = () => {
    router.push(`/singleChat/${user.id}`);
  };
  return (
    <TouchableOpacity
      style={styles.itemContainer}
      activeOpacity={0.5}
      onPress={onPress}
    >
      <Image
        source={{ uri: user.image }}
        style={{ width: 60, height: 60, borderRadius: 50 }}
        contentFit={"cover"}
        placeholder={require("@/assets/images/place-user.jpeg")}
        placeholderContentFit={"cover"}
      />
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
});
