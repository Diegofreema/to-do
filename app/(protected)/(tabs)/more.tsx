import * as LocalAuthentication from "expo-local-authentication";

import { Wrapper } from "@/components/ui/Wrapper";
import { useFingerPrint } from "@/lib/zustand/useFingerPrint";
import { usePassCode } from "@/lib/zustand/usePasscode";
import { useState } from "react";
import { router } from "expo-router";
import { LogoutModal } from "@/components/LogoutModal";
import { HStack } from "@/components/ui/HStack";
import { Title } from "@/components/typography/Title";
import { StyleSheet, Switch, TouchableOpacity } from "react-native";
import { colors } from "@/constants";
import { RFPercentage } from "react-native-responsive-fontsize";
import { openURL } from "expo-linking";
import {
  IconInfoSquareRounded,
  IconLogout,
  IconPencil,
} from "@tabler/icons-react-native";
import { Stack } from "@/components/ui/Stack";
import { useShowToast } from "@/lib/zustand/useShowToast";

export const mail = "mailto:student.ictsupport@fpno.edu.ng";
const More = () => {
  const toggleLock = useFingerPrint((state) => state.toggleLock);
  const [visible, setVisible] = useState(false);
  const passCode = usePassCode((state) => state.passCode);
  const onShowToast = useShowToast((state) => state.onShow);
  const lock = useFingerPrint((state) => state.lock);
  const onLock = async () => {
    const isAvailable = await LocalAuthentication.hasHardwareAsync();
    if (!isAvailable)
      return onShowToast({
        type: "error",
        message: "Error",
        description: "Finger print not available on this device",
      });
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
      onShowToast({
        type: "error",
        message: "Error",
        description: "Finger print not enrolled on this device",
      });
      return;
    }

    if (lock) {
      router.push("/lock?off=true");
    } else {
      toggleLock();
      onShowToast({
        type: "success",
        message: "Success",
        description: "Login with finger print enabled",
      });
    }
  };
  const onLogout = () => {
    setVisible(true);
  };

  const onEdit = () => {
    router.push(`/check-passcode?action=change`);
  };

  const onTerms = () => {};
  const onSupport = async () => {
    await openURL(mail);
  };
  const onPrivacy = () => {};
  return (
    <Wrapper>
      <LogoutModal visible={visible} onClose={() => setVisible(false)} />
      <Stack style={{ marginTop: 30 }}>
        <HStack
          style={styles.container}
          leftContent={() => (
            <Title text={"Finger Print"} textStyle={styles.title} />
          )}
          rightContent={() => (
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={lock ? colors.lightblue : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              // @ts-ignore
              onChange={onLock}
              value={lock}
            />
          )}
        />
        {passCode && (
          <TouchableOpacity
            onPress={onEdit}
            activeOpacity={0.5}
            style={styles.container}
          >
            <Title text={"Change Pin"} textStyle={styles.title} />
            <IconPencil size={RFPercentage(2.5)} color={colors.black} />
          </TouchableOpacity>
        )}

        {/* <TouchableOpacity
          onPress={onPrivacy}
          activeOpacity={0.5}
          style={styles.container}
        >
          <Title text={'Privacy & Policy'} textStyle={styles.title} />

          <IconLockSquare color={colors.black} size={28} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onTerms}
          activeOpacity={0.5}
          style={styles.container}
        >
          <Title text={'Terms & Conditions'} textStyle={styles.title} />

          <IconNotes color={colors.black} size={28} />
        </TouchableOpacity>
       */}
        <TouchableOpacity
          onPress={onSupport}
          activeOpacity={0.5}
          style={styles.container}
        >
          <Title text={"Support"} textStyle={styles.title} />

          <IconInfoSquareRounded
            color={colors.black}
            size={RFPercentage(2.5)}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onLogout}
          activeOpacity={0.5}
          style={[styles.container]}
        >
          <Title text={"Logout"} textStyle={styles.title} />

          <IconLogout color={colors.red} size={RFPercentage(2.5)} />
        </TouchableOpacity>
      </Stack>
    </Wrapper>
  );
};
export default More;

const styles = StyleSheet.create({
  title: { color: colors.black, fontSize: RFPercentage(2.5) },
  container: {
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 5,
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});
