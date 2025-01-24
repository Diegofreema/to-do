import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

import { AnimatedCard } from "@/components/animated/AnimatedCard";
import { ErrorComponent } from "@/components/ErrorComponent";
import { BoxSkeleton } from "@/components/Skeletons/BoxeSkeleton";
import { colors } from "@/constants";
import { textToRender } from "@/helper";
import { useGetDashboard } from "@/lib/tanstack/query";
import { useAuth } from "@/lib/zustand/useAuth";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";
import { useId } from "@/lib/zustand/useId";

const images = [
  require("@/assets/images/study4.png"),

  require("@/assets/images/study3.png"),

  require("@/assets/images/study2.png"),

  require("@/assets/images/study.png"),
];
export const Boxes = () => {
  const id = useAuth((state) => state.user.id);

  const user = useQuery(api.user.getUserById, { userId: id });
  const { data, isError, isPending, refetch } = useGetDashboard(id);
  const { id: convexId, getId } = useId();
  useEffect(() => {
    if (user && !convexId) {
      getId(user._id);
    }
  }, [user, convexId, getId]);
  if (isError) {
    return <ErrorComponent onPress={refetch} />;
  }
  if (isPending || !user) {
    return <BoxSkeleton />;
  }

  const objectToArray = Object.entries(data).map(([key, value]) => {
    return {
      key,
      value,
    };
  });

  return (
    <FlatList
      numColumns={2}
      columnWrapperStyle={{ gap: 10 }}
      scrollEnabled={false}
      contentContainerStyle={{
        gap: 10,
        paddingHorizontal: 5,
        paddingBottom: 10,
      }}
      data={objectToArray}
      renderItem={({ item, index }) => (
        <AnimatedCard index={index} style={{ flex: 1 }}>
          <Box item={item} index={index} />
        </AnimatedCard>
      )}
    />
  );
};

const Box = ({
  item,
  index,
}: {
  item: { key: string; value: string };
  index: number;
}) => {
  const onPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const img = images[index];
  return (
    <TouchableOpacity onPress={onPress} style={styles.box} activeOpacity={0.5}>
      <Image
        style={{ width: 40, height: 40, marginBottom: 10 }}
        source={img}
        contentFit="contain"
      />
      <View style={[styles.flex, { alignItems: "center" }]}>
        <Text style={styles.title}>{textToRender(item.key)}</Text>
        <Text style={styles.value}>{item.value}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  box: {
    flex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 5,
    backgroundColor: colors.white,
    borderRadius: 5,
    padding: 10,
  },
  flex: {
    flexDirection: "row",
    gap: 10,
    marginTop: "auto",
  },
  title: {
    fontSize: RFPercentage(2),
    fontFamily: "NunitoRegular",
    flex: 1,
  },
  value: {
    fontSize: RFPercentage(2.5),
    textAlign: "center",
    fontFamily: "NunitoBold",
  },
});
