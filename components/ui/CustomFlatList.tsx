import { Href } from "expo-router";
import { FlatList, StyleSheet, View, ViewToken } from "react-native";
import Animated, {
  SlideInLeft,
  SlideInRight,
  useSharedValue,
} from "react-native-reanimated";
import { RFPercentage } from "react-native-responsive-fontsize";

import { InfoCard } from "@/components/ui/InfoCard";
import { SubTitle } from "@/components/typography/Subtitle";
import { LinkText } from "@/components/ui/LinkText";
import { colors } from "@/constants";
import { DataType } from "@/types";
import { EmptyText } from "@/components/ui/EmptyText";
import { upcoming } from "@/data";
import { AnimatedListCard } from "@/components/ui/AnimatedListCard";
import { spacing } from "@/constants/constants";

export const CustomFlatList = ({ data }: { data: typeof upcoming }) => {
  const viewableItems = useSharedValue<ViewToken[]>([]);
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => {
        return <AnimatedListCard item={item} viewableItems={viewableItems} />;
      }}
      onViewableItemsChanged={({ viewableItems: vItems }) => {
        viewableItems.value = vItems;
      }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        gap: spacing,
        paddingHorizontal: 5,
        paddingBottom: 50,
      }}
      keyExtractor={(_, index) => index.toString()}
    />
  );
};

export const CustomFlatListNoScroll = ({
  title,
  link,
  data,
  index,
  emptyText = "No Records yet",
}: {
  title: string;
  link?: Href;
  data: DataType[];
  index: number;
  emptyText?: string;
}) => {
  const getSlideDirection = (index: number) => {
    const baseAnimation = index % 2 === 0 ? SlideInLeft : SlideInRight;
    return baseAnimation.springify().damping(80).stiffness(200);
  };

  const SlideDirection = getSlideDirection(index);
  return (
    <Animated.View entering={SlideDirection}>
      <FlatList
        data={data.slice(0, 5)}
        ListHeaderComponent={() => <FlatListHeader text={title} link={link} />}
        renderItem={({ item }) => <InfoCard item={item} />}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        contentContainerStyle={styles.contentContainerStyle}
        ListEmptyComponent={() => <EmptyText text={emptyText} />}
      />
    </Animated.View>
  );
};

const FlatListHeader = ({ text, link }: { text: string; link?: Href }) => {
  return (
    <View
      style={{
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <SubTitle text={text} textStyle={styles.title} />
      {link && <LinkText text="View all" link={link} />}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: RFPercentage(2.5),
    fontFamily: "NunitoBold",
    color: colors.black,
  },
  contentContainerStyle: {
    gap: 15,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    borderRadius: 10,
    paddingVertical: 20,
    minHeight: 350,
  },
});
