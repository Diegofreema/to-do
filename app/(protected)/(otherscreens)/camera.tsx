import { router } from "expo-router";

import { CameraComponent } from "@/components/Camera";
import { useWindowDimensions } from "react-native";
import { ErrorComponent } from "@/components/ErrorComponent";
import { colors } from "@/constants";
import { useCameraPermission } from "react-native-vision-camera";

const CameraScreen = () => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const { height } = useWindowDimensions();

  if (!hasPermission)
    return (
      <ErrorComponent
        onPress={async () => {
          await requestPermission();
          console.log("permission denied");
        }}
        title="This apps need your camera permission"
        btnText="Grant"
        height={height}
        onGoBack={() => router.back()}
        backgroundColor={colors.lightblue}
        textColor={colors.white}
      />
    );

  return <CameraComponent />;
};
export default CameraScreen;
