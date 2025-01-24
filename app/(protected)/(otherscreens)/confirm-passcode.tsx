import CustomBackgroundImage from "@/components/ui/CustomBackgroundImage";
import { ConfirmPassCode } from "@/components/ui/ConfirmPasscode";
import { StatusBar } from "expo-status-bar";
import { ScrollWrapper } from "@/components/ui/Wrapper";

const Confirm = () => {
  return (
    <ScrollWrapper styles={{ paddingHorizontal: 0 }}>
      <CustomBackgroundImage
        text={"Confirm pin"}
        text2={"Keep this pin safe, you will use it to access your data"}
      >
        <StatusBar hidden />
        <ConfirmPassCode />
      </CustomBackgroundImage>
    </ScrollWrapper>
  );
};
export default Confirm;
