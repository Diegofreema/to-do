import { useSharedValue } from "react-native-reanimated";
import { FlatList, ViewToken } from "react-native";

import { spacing } from "@/constants/constants";
import { NewsTypes } from "@/types";
import { NewsAnimatedCard } from "@/components/NewsAnimatedCard";

type Props = {
  data: NewsTypes[];
  onRefetch: () => void;
  isRefetching: boolean;
};

export const NewsAnimated = ({ data, onRefetch, isRefetching }: Props) => {
  const viewableItems = useSharedValue<ViewToken[]>([]);
  const formatedData = data.map((item, i) => ({
    ...item,
    id: i,
  }));
  return (
    <FlatList
      onRefresh={onRefetch}
      refreshing={isRefetching}
      data={formatedData}
      renderItem={({ item }) => {
        return <NewsAnimatedCard item={item} viewableItems={viewableItems} />;
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


