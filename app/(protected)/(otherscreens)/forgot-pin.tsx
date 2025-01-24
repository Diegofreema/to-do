import { AnimatedForgotToken } from "@/components/animated/AnimatedContainer";
import { ForgotForm } from "@/components/ForgotPin";
import CustomBackgroundImage from "@/components/ui/CustomBackgroundImage";

const ForgotPin = () => {
  return (
    <CustomBackgroundImage
      text={"Check your email"}
      text2={"A token has been sent to your registered email"}
    >
      <AnimatedForgotToken>
        <ForgotForm />
      </AnimatedForgotToken>
    </CustomBackgroundImage>
  );
};
export default ForgotPin;
