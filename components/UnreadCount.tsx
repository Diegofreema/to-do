import { View, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";
import React from "react";
import { colors } from "@/constants";

export const UnreadCount = ({
  unread,
  style,
}: {
  unread: number;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <View style={[styles.unread, style]}>
      <Text style={{ color: "white", fontFamily: "NunitoBold" }}>{unread}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  unread: {
    alignSelf: "flex-end",
    marginTop: "auto",
    backgroundColor: colors.lightblue,
    borderRadius: 20,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
