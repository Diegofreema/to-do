import { mail } from '@/app/(protected)/(tabs)/more';
import { LoginForm } from '@/components/form/LoginForm';
import CustomBackgroundImage from '@/components/ui/CustomBackgroundImage';
import { colors } from '@/constants';
import { useId } from '@/lib/zustand/useId';
import { useIsFirst } from '@/lib/zustand/useIsFirst';
import { openURL } from 'expo-linking';
import { Redirect } from 'expo-router';
import { ScrollView } from 'moti';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { RFPercentage } from 'react-native-responsive-fontsize';

const Login = () => {
  const { isFirst } = useIsFirst();
  const id = useId((state) => state.id);
  console.log({ id });

  if (isFirst) {
    return <Redirect href={'/onboard'} />;
  }

  const onPress = async () => {
    await openURL(mail);
  };
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: 'white' }}
    >
      <CustomBackgroundImage
        text="Get Back into your Students Account"
        text2="Welcome Back, Kindly fill in your details to get back in your account"
      >
        <LoginForm />
        <Animated.View
          entering={FadeIn.delay(1000)}
          style={{ marginTop: 'auto', marginBottom: 20, alignItems: 'center' }}
        >
          <Text
            style={{ fontFamily: 'NunitoRegular', fontSize: RFPercentage(1.7) }}
          >
            if you have difficulty, please contact the ICT Helpdesk at:
          </Text>
          <TouchableOpacity onPress={onPress} style={{ marginTop: 10 }}>
            <Text
              style={{
                fontFamily: 'NunitoBold',
                fontSize: RFPercentage(2),
                color: colors.lightblue,
              }}
            >
              student.ictsupport@fpno.edu.ng
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </CustomBackgroundImage>
    </ScrollView>
  );
};
export default Login;
