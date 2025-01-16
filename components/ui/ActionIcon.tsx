import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Icon } from "@tabler/icons-react-native";
import { Title } from "@/components/typography/Title";
import { colors } from "@/constants";
import { RFPercentage } from "react-native-responsive-fontsize";

type Props = {
  icon: Icon;
  onPress: () => void;
  text?: string;
};

export const ActionIcon = ({ icon: Icon, onPress, text }: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <Icon color={colors.white} size={25} />
      </View>
      {text && (
        <Title
          text={text}
          textStyle={{ color: colors.black, fontSize: RFPercentage(2.5) }}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    height: 50,
    width: 50,
    backgroundColor: colors.lightblue,
  },
});
