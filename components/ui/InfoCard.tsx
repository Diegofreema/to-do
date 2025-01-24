import { StyleSheet, TouchableOpacity, View } from "react-native";

import { LecturesType } from "@/types";
import { RFPercentage } from "react-native-responsive-fontsize";
import { colors } from "@/constants";
import {
  IconArticle,
  IconBuilding,
  IconClock,
  IconUser,
} from "@tabler/icons-react-native";
import { IconText } from "@/components/IconText";
import { Spacer } from "@/components/ui/Divider";

export const InfoCard = ({ item }: { item: LecturesType }) => {
  return (
    <TouchableOpacity activeOpacity={0.5} style={{ marginBottom: 5, gap: 5 }}>
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <View style={{ flex: 1 }}>
            <IconText
              icon={IconArticle}
              text={item.coursecode}
              textStyle={styles.title}
            />
            <Spacer space={8} />
            <IconText icon={IconUser} text={item.lecturer.trim()} />
          </View>
        </View>
        <View>
          <IconText
            text={item.Hall}
            icon={IconBuilding}
            style={{ alignSelf: "flex-end" }}
            textStyle={{ fontSize: RFPercentage(1.4), textAlign: "right" }}
          />
          <Spacer space={8} />
          <IconText text={item.period} icon={IconClock} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  subContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    flex: 1,
  },
  title: {
    fontSize: RFPercentage(1.8),
    fontFamily: "NunitoBold",
    color: colors.black,
    lineHeight: 20,
  },
});
