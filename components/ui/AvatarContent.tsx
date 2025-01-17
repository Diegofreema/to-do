import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { RFPercentage } from "react-native-responsive-fontsize";
import { IconCheck, IconFile } from "@tabler/icons-react-native";
import { colors } from "@/constants";
import { AvatarPile } from "@/components/ui/AvatarPile";

export const AvatarContent = ({
  image,
  name,
  text,
  myMessage,
  isOnline,
  color = "black",
  chat,
  hideOnlineStatus = false,
}: {
  image: string | string[];
  name: string;
  text?: string;
  myMessage?: boolean;
  isOnline?: boolean;
  color?: string;
  chat?: boolean;
  hideOnlineStatus?: boolean;
}) => {
  const isImage = text?.startsWith("https");
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      {Array.isArray(image) ? (
        <AvatarPile avatars={image} />
      ) : (
        <Image
          contentFit={"cover"}
          placeholderContentFit={"cover"}
          placeholder={require("@/assets/images/place-user.jpeg")}
          style={{ width: 60, height: 60, borderRadius: 50 }}
          source={{ uri: image }}
        />
      )}
      <View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
          <Text
            style={{
              color,
              fontSize: RFPercentage(1.7),
              fontFamily: "NunitoRegular",
            }}
          >
            {name}
          </Text>
          {isOnline && !chat && <View style={styles.online} />}
        </View>
        {!hideOnlineStatus && (
          <View style={{ flexDirection: "row", gap: 3, alignItems: "center" }}>
            {chat && (
              <Text
                style={{
                  color: "white",
                  fontFamily: "NunitoRegular",
                  fontSize: 12,
                }}
              >
                {isOnline ? "Online" : "Offline"}
              </Text>
            )}
            {isOnline && chat && <View style={styles.online} />}
          </View>
        )}
        <View style={{ flexDirection: "row", gap: 3, alignItems: "center" }}>
          {myMessage && <IconCheck color={colors.lightblue} size={20} />}
          {isImage ? (
            <IconFile size={24} color={colors.lightblue} />
          ) : (
            <Text
              style={{
                color: "black",
                fontSize: RFPercentage(2),
                fontFamily: "NunitoRegular",
              }}
            >
              {text}
            </Text>
          )}
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
