import { Image } from "expo-image";
import * as LocalAuthentication from "expo-local-authentication";
import { Href, router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { AnimatedContainer } from "@/components/animated/AnimatedContainer";
import { ProfileDetail } from "@/components/ui/ProfileDetail";
import { colors } from "@/constants";
import { SubTitle } from "@/components/typography/Subtitle";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Divider } from "@/components/ui/Divider";
import { useAuth } from "@/lib/zustand/useAuth";
import { useIsLocked, usePath } from "@/lib/zustand/usePath";
import { useFingerPrint } from "@/lib/zustand/useFingerPrint";
import { usePassCode } from "@/lib/zustand/usePasscode";
import React from "react";
import { useShowToast } from "@/lib/zustand/useShowToast";
import { Avatar } from "./Avatar";

export const LockComponent = () => {
  const { off } = useLocalSearchParams<{ off?: string }>();
  const {
    user: { fname, lname },
  } = useAuth();
  const removeUser = useAuth((state) => state.removeUser);
  const storedPath = usePath((state) => state.currentPath);
  const unlock = useIsLocked((state) => state.unlock);
  const toggleLock = useFingerPrint((state) => state.toggleLock);
  const unlockDevice = useFingerPrint((state) => state.unlockDevice);
  const unlockDeviceWithPin = usePassCode((state) => state.unlockDevice);
  const onShowToast = useShowToast((state) => state.onShow);
  const onPasswordLogin = () => {
    removeUser();
    router.replace("/login");
  };
  const onPress = async () => {
    const { success } = await LocalAuthentication.authenticateAsync({
      promptMessage:
        off === "true"
          ? "Turn off login with fingerprint"
          : "Login with fingerprint",
      cancelLabel: "Cancel",
    });

    if (success) {
      unlock();
      unlockDevice();
      unlockDeviceWithPin();
      if (off === "true") {
        toggleLock();
        router.back();

        onShowToast({
          description: "You have turned off login with finger print",
          message: "Success",
          type: "success",
        });
        return;
      }

      onShowToast({
        description: "Welcome back",
        message: "Success",
        type: "success",
      });

      router.replace(storedPath as Href);
    }
  };
  return (
    <AnimatedContainer>
      <View style={{ alignSelf: "center" }}>
        <Avatar />
      </View>
      <ProfileDetail style={{ marginTop: 5 }} text={`${fname} ${lname}`} />
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={onPress}
        style={styles.touchable}
      >
        <Image
          source={require("@/assets/images/finger.png")}
          style={styles.img}
          contentFit={"contain"}
        />
      </TouchableOpacity>
      <View style={{ marginTop: 10, justifyContent: "center" }}>
        <SubTitle
          text={
            off === "true"
              ? "Turn off login with fingerprint"
              : "Click to Login with fingerprint"
          }
          textStyle={styles.text}
        />

        {off !== "true" && (
          <>
            <View style={styles.or}>
              <Divider />
              <Text
                style={{ fontFamily: "NunitoRegular", textAlign: "center" }}
              >
                Or
              </Text>
              <Divider />
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 5,
                justifyContent: "center",
                marginTop: 30,
              }}
            >
              <TouchableOpacity onPress={onPasswordLogin}>
                <Text style={{ fontFamily: "NunitoRegular" }}>
                  Login with password
                </Text>
              </TouchableOpacity>
              <View
                style={{ width: 1, height: 20, backgroundColor: colors.border }}
              />
              <TouchableOpacity onPress={() => router.push("/check-passcode")}>
                <Text style={{ fontFamily: "NunitoRegular" }}>
                  Login with pin
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </AnimatedContainer>
  );
};

const styles = StyleSheet.create({
  img: { width: 60, height: 60, borderRadius: 40, alignSelf: "center" },
  touchable: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderColor: colors.border,
    borderWidth: 1,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  text: { color: colors.black, fontSize: RFPercentage(2), textAlign: "center" },
  or: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    alignItems: "center",
    gap: 5,
  },
  flex: {
    gap: 5,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
});
