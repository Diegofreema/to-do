import CustomBackgroundImage from "@/components/ui/CustomBackgroundImage";
import { PassCode } from "@/components/PassCode";
import { StatusBar } from "expo-status-bar";
import { ScrollWrapper } from "@/components/ui/Wrapper";

const Passcode = () => {
  return (
    <ScrollWrapper styles={{ paddingHorizontal: 0 }}>
      <CustomBackgroundImage
        text={"Set Pin"}
        text2={"Keep this pin safe, you will use it to access your data"}
      >
        <StatusBar hidden />
        <PassCode />
      </CustomBackgroundImage>
    </ScrollWrapper>
  );
};
export default Passcode;
