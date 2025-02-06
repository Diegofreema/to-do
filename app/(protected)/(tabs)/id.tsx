import { IDModal } from '@/components/ui/IDCardModal';
import { ScrollWrapper } from '@/components/ui/Wrapper';
import React from 'react';
import { View } from 'react-native';

const id = () => {
  return (
    <ScrollWrapper>
      <View style={{ paddingTop: 50 }}>
        <IDModal />
      </View>
    </ScrollWrapper>
  );
};

export default id;
