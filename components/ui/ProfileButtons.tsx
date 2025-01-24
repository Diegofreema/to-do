import { StyleSheet, View } from 'react-native';
import { Button } from './Button';
import { useBarcode } from '@/lib/zustand/useBarcode';
import { useIdModal } from '@/lib/zustand/useIdModal';

export const ProfileButtons = () => {
  const { onOpen } = useBarcode();
  const { onOpen: onOpenId } = useIdModal();

  return (
    <View style={styles.container}>
      <Button text="View ID" onPress={onOpenId} style={{ flex: 1 }} />
      <Button text="View QR Code" onPress={onOpen} style={{ flex: 1 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 30,
  },
});
