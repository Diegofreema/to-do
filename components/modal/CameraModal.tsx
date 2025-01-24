import { useShowCamera } from '@/lib/zustand/useShowCamera';
import React from 'react';
import { Modal } from 'react-native';
import { CameraComponent } from '../Camera';

export const CameraModal = () => {
  const visible = useShowCamera((state) => state.showCamera);
  const onClose = useShowCamera((state) => state.setShowCamera);

  return (
    <Modal
      visible={visible}
      transparent
      onRequestClose={onClose}
      animationType={'slide'}
    >
      <CameraComponent />
    </Modal>
  );
};
