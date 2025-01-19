import { Modal, StyleSheet } from "react-native";
import { MotiView, View } from "moti";
import { colors } from "@/constants";

type LoadingModalProps = {
  visible: boolean;
};
const _size = 100;
export const LoadingModal = ({ visible }: LoadingModalProps) => {
  return (
    <Modal visible={visible} transparent>
      <View style={styles.container}>
        <MotiView
          from={{
            width: _size,
            height: _size,
            borderRadius: _size / 2,
            borderWidth: 0,
            shadowOpacity: 0.5,
          }}
          animate={{
            width: _size + 20,
            height: _size + 20,
            borderRadius: (_size + 20) / 2,
            borderWidth: _size / 10,
            shadowOpacity: 1,
          }}
          transition={{
            type: "timing",
            duration: 1000,
            loop: true,
          }}
          style={{
            width: _size,
            height: _size,
            borderRadius: _size / 2,
            borderWidth: _size / 2,
            borderColor: colors.lightblue,
            shadowColor: colors.lightblue,
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 1,
            shadowRadius: 10,
            elevation: 16,
          }}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
});
