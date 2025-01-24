import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { PropsWithChildren } from "react";

type Props = {
  style?: StyleProp<ViewStyle>;
};
export const Stack = ({ children, style }: PropsWithChildren<Props>) => {
  return <View style={[styles.container, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    gap: 15,
  },
});
