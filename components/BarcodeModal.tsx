import { useBarcode } from '@/lib/zustand/useBarcode';
import { IconX } from '@tabler/icons-react-native';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';

export const BarcodeModal = () => {
  const { isOpen, onClose } = useBarcode();
  return (
    <View>
      <Modal
        visible={isOpen}
        onRequestClose={onClose}
        animationType="slide"
        transparent={true}
        statusBarTranslucent
        onDismiss={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={{ width: '100%', marginHorizontal: 20 }}>
            <View style={styles.modal}>
              <TouchableOpacity
                style={{ position: 'absolute', top: 10, right: 10 }}
                onPress={onClose}
              >
                <IconX size={25} color={'black'} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: 300,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
