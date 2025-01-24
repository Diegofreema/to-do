import { StyleSheet, View } from "react-native";
import { PropsWithChildren } from "react";

export const Card = ({ children }: PropsWithChildren) => {
  return <View style={styles.card}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    gap: 10,
  },
});
