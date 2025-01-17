import { Image } from "expo-image";
import { StyleSheet } from "react-native";
import { IMessage, MessageImageProps } from "react-native-gifted-chat";
import { useCallback, useState } from "react";

import { CustomPressable } from "@/components/ui/CustomPressable";
import { PreviewModal } from "@/components/ui/PreviewModal";

type Props = MessageImageProps<IMessage> & {};
export const RenderImage = ({ ...props }: Props) => {
  const [showPreview, setShowPreview] = useState(false);
  const onClose = useCallback(() => setShowPreview(false), []);
  return (
    <>
      <PreviewModal
        visible={showPreview}
        hideModal={onClose}
        url={props.currentMessage.image!}
        type="image"
      />
      <CustomPressable
        onPress={() => setShowPreview(true)}
        style={styles.imageContainer}
      >
        <Image
          source={{ uri: props.currentMessage.image }}
          style={styles.image}
          placeholder={require("@/assets/images/place.webp")}
          placeholderContentFit="cover"
          contentFit="cover"
        />
      </CustomPressable>
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
  },
  imageContainer: {
    width: 120,
    height: 100,
    borderRadius: 8,
    overflow: "hidden",
  },
});
