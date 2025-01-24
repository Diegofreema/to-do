import CustomBackgroundImage from "@/components/ui/CustomBackgroundImage";
import { CheckPasscodeForm } from "@/components/ui/CheckPasscodeForm";
import { ScrollView } from "moti";

const CheckPasscode = () => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor:'#ffffff'}}>
      <CustomBackgroundImage
        text={"Enter your pin"}
        text2={"Please enter your secured pin below"}
      >
        <CheckPasscodeForm />
      </CustomBackgroundImage>
    </ScrollView>
  );
};
export default CheckPasscode;
