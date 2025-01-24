import { useSharedValue } from 'react-native-reanimated';
import { FlatList, StyleSheet, View, ViewToken } from 'react-native';
import { AnimatedListCard } from '@/components/ui/AnimatedListCard';
import { spacing } from '@/constants/constants';
import { LecturesType } from '@/types';
import { colors } from '@/constants';

type Props = {
  data: LecturesType[];
  refreshing: boolean;
  onRefresh: () => void;
};

export const LecturesAnimated = ({ data, onRefresh, refreshing }: Props) => {
  const viewableItems = useSharedValue<ViewToken[]>([]);
  return (
    <FlatList
      data={data}
      refreshing={refreshing}
      onRefresh={onRefresh}
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
      ItemSeparatorComponent={() => (
        <View
          style={{
            height: StyleSheet.hairlineWidth,
            width: '100%',
            backgroundColor: colors.black,
          }}
        />
      )}
      keyExtractor={(_, index) => index.toString()}
    />
  );
};
