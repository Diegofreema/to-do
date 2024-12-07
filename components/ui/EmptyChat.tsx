import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Title } from "@/components/typography/Title";
import { colors } from "@/constants";
import { IconMessageChatbot } from "@tabler/icons-react-native";
import { router } from "expo-router";

export const EmptyChat = () => {
  return (
    <View style={styles.container}>
      <Title
        text={"Start a conversation"}
        textStyle={{ color: colors.black }}
      />
      <TouchableOpacity
        style={styles.press}
        onPress={() => router.push("/newChat")}
      >
        <IconMessageChatbot size={100} color={colors.lightblue} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  press: {},
});
