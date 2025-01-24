import CustomBackgroundImage from "@/components/ui/CustomBackgroundImage";
import { LockComponent } from "@/components/ui/LockComponent";

const Lock = () => {
  return (
    <CustomBackgroundImage
      text={"Login to your Account"}
      text2={"Welcome Back"}
    >
      <LockComponent />
    </CustomBackgroundImage>
  );
};
export default Lock;
