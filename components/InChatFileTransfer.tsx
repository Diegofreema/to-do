import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export const InChatFileTransfer = ({ filePath }: { filePath: string }) => {
  let fileType = "";
  let name = "";
  if (filePath !== undefined) {
    name = filePath.split("/").pop() as string;
    fileType = filePath.split(".").pop() as string;
  }
  return (
    <View style={styles.container}>
      <View style={styles.frame}>
        <Image
          source={
            fileType === "pdf"
              ? require("../assets/chat_file.png")
              : require("../assets/unknowFile.png")
          }
          style={{ height: 60, width: 60 }}
        />
        <View>
          <Text style={styles.text}>
            {name.replace("%20", "").replace(" ", "")}
          </Text>
          <Text style={styles.textType}>{fileType.toUpperCase()}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
    borderRadius: 15,
    padding: 5,
  },
  text: {
    color: "black",
    marginTop: 10,
    fontSize: 16,
    lineHeight: 20,
    marginLeft: 5,
    marginRight: 5,
  },
  textType: {
    color: "black",
    marginTop: 5,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  frame: {
    backgroundColor: "#fff",
    flexDirection: "row",
    borderRadius: 10,
    padding: 5,
    marginTop: -4,
  },
});
