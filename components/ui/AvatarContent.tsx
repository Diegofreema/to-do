import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { RFPercentage } from "react-native-responsive-fontsize";
import { IconCheck } from "@tabler/icons-react-native";
import { colors } from "@/constants";

export const AvatarContent = ({
  image,
  name,
  text,
  myMessage,
  isOnline,
}: {
  image: string;
  name: string;
  text?: string;
  myMessage?: boolean;
  isOnline?: boolean;
}) => {
  console.log("dcnd ");
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <Image
        contentFit={"cover"}
        placeholderContentFit={"cover"}
        placeholder={require("@/assets/images/place-user.jpeg")}
        style={{ width: 60, height: 60, borderRadius: 50 }}
        source={{ uri: image }}
      />
      <View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
          <Text
            style={{
              color: "black",
              fontSize: RFPercentage(1.7),
              fontFamily: "NunitoRegular",
            }}
          >
            {name}
          </Text>
          {isOnline && <View style={styles.online} />}
        </View>
        <View style={{ flexDirection: "row", gap: 3, alignItems: "center" }}>
          {myMessage && <IconCheck color={colors.lightblue} size={20} />}
          <Text
            style={{
              color: "black",
              fontSize: RFPercentage(2),
              fontFamily: "NunitoRegular",
            }}
          >
            {text}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  online: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#03C03C",
  },
});
