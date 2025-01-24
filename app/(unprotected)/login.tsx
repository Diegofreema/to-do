import { LoginForm } from "@/components/form/LoginForm";
import CustomBackgroundImage from "@/components/ui/CustomBackgroundImage";
import { useIsFirst } from "@/lib/zustand/useIsFirst";
import { Redirect } from "expo-router";
import React from "react";
import { ScrollView } from "moti";
import { Linking, Text, TouchableOpacity, View } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { colors } from "@/constants";
import { mail } from "@/app/(protected)/(tabs)/more";
import { useShowToast } from "@/lib/zustand/useShowToast";
import Animated, { FadeIn } from "react-native-reanimated";
import { openURL } from "expo-linking";

const Login = () => {
  const { isFirst } = useIsFirst();
  const onShowToast = useShowToast((state) => state.onShow);
  console.log(isFirst);
  if (isFirst) {
    return <Redirect href={"/onboard"} />;
  }

  const onPress = async () => {
    await openURL(mail);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: "white" }}
    >
      <CustomBackgroundImage
        text="Get Back into your Students Account"
        text2="Welcome Back, Kindly fill in your details to get back in your account"
      >
        <LoginForm />
        <Animated.View
          entering={FadeIn.delay(1000)}
          style={{ marginTop: "auto", marginBottom: 20, alignItems: "center" }}
        >
          <Text
            style={{ fontFamily: "NunitoRegular", fontSize: RFPercentage(1.7) }}
          >
            if you have difficulty, please contact the ICT Helpdesk at:
          </Text>
          <TouchableOpacity onPress={onPress} style={{ marginTop: 10 }}>
            <Text
              style={{
                fontFamily: "NunitoBold",
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
