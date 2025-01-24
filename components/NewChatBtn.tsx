import { colors } from "@/constants";
import { IconMessageCirclePlus } from "@tabler/icons-react-native";
import { router } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";

export const NewChatBtn = () => {
  const onPress = () => {
    router.push("/newChat");
  };
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <IconMessageCirclePlus color={colors.white} size={30} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 30,
    right: 10,
    width: 70,
    height: 70,
    borderRadius: 100,
    backgroundColor: colors.lightblue,
    justifyContent: "center",
    alignItems: "center",
  },
});
