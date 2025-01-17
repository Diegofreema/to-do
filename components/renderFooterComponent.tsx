import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { InChatFileTransfer } from "@/components/InChatFileTransfer";

type Props = {
  imagePath: string;
  filePath: string;
  setImagePath: React.Dispatch<React.SetStateAction<string>>;
  setFilePath: React.Dispatch<React.SetStateAction<string>>;
};

export const renderFooter = ({
  imagePath,
  filePath,
  setImagePath,
  setFilePath,
}: Props) => {
  if (imagePath) {
    return (
      <View style={styles.chatFooter}>
        <Image
          source={{ uri: imagePath }}
          style={{ height: 75, width: 75 }}
          contentFit="cover"
        />
        <TouchableOpacity
          onPress={() => setImagePath("")}
          style={styles.buttonFooterChatImg}
        >
          <Text style={styles.textFooterChat}>X</Text>
        </TouchableOpacity>
      </View>
    );
  }
  if (filePath) {
    return (
      <View style={styles.chatFooter}>
        <InChatFileTransfer filePath={filePath} />
        <TouchableOpacity
          onPress={() => setFilePath("")}
          style={styles.buttonFooterChat}
        >
          <Text style={styles.textFooterChat}>X</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return undefined;
};

const styles = StyleSheet.create({
  buttonFooterChat: {
    width: 35,
    height: 35,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    borderColor: "black",
    right: 3,
    top: -2,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  buttonFooterChatImg: {
    width: 35,
    height: 35,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    borderColor: "black",
    left: 66,
    top: -4,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  textFooterChat: {
    fontSize: 18,
    fontWeight: "bold",
    color: "gray",
  },
  chatFooter: {
    shadowColor: "#1F2687",
    shadowOpacity: 0.37,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
    flexDirection: "row",
    padding: 5,
    backgroundColor: "blue",
  },
});
