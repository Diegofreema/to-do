import Modal from 'react-native-modal';
import * as LocalAuthentication from 'expo-local-authentication';
import { useFingerPrint } from '@/lib/zustand/useFingerPrint';
import { useFirstTimeModal } from '@/lib/zustand/useFirstTimeModal';
import { useShowToast } from '@/lib/zustand/useShowToast';
import { Card } from './ui/Card';
import { Title } from './typography/Title';
import { SubTitle } from './typography/Subtitle';
import { Button } from './ui/Button';
import { HStack } from './ui/HStack';
import { colors } from '@/constants';
import { RFPercentage } from 'react-native-responsive-fontsize';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export const FingerPrintModal = ({ onClose, visible }: Props): JSX.Element => {
  const toggleLock = useFingerPrint((state) => state.toggleLock);

  const setFirstTimeToFalse = useFirstTimeModal(
    (state) => state.setFirstTimeToFalse
  );
  const onShowToast = useShowToast((state) => state.onShow);
  const handleClose = () => {
    setFirstTimeToFalse();
    onClose();
  };
  const onPress = async () => {
    const isAvailable = await LocalAuthentication.hasHardwareAsync();
    if (!isAvailable) {
      handleClose();
      return onShowToast({
        type: 'error',
        message: 'Error',
        description: 'Finger print not available on this device',
      });
    }
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
      handleClose();
      onShowToast({
        type: 'error',
        message: 'Error',
        description: 'Finger print not enrolled on this device',
      });
      return;
    }
    toggleLock();
    onShowToast({
      description: 'Finger print login enabled',
      message: 'Success',
      type: 'success',
    });

    onClose();
  };

  return (
    <Modal
      onBackdropPress={handleClose}
      onBackButtonPress={handleClose}
      isVisible={visible}
      backdropOpacity={0.8}
      backdropColor="black"
      style={{}}
    >
      <Card>
        <Title
          text="Would you like to enable Fingerprint"
          textStyle={{ color: colors.black, textAlign: 'center' }}
        />
        <SubTitle
          text="Enable Fingerprint would allow you to log in more securely and quickly in the future"
          textStyle={{
            color: colors.black,
            textAlign: 'center',
            fontSize: RFPercentage(1.9),
          }}
        />

        <HStack
          gap={10}
          leftContent={() => (
            <Button
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                borderColor: colors.lightblue,
                borderWidth: 1,
              }}
              text={'Not now'}
              onPress={handleClose}
              textStyle={{ color: colors.lightblue }}
            />
          )}
          rightContent={() => (
            <Button
              style={{ flex: 1, backgroundColor: colors.lightblue }}
              text={'Finger print'}
              onPress={onPress}
            />
          )}
        />
      </Card>
    </Modal>
  );
};
