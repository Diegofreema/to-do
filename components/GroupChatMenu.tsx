import { router } from "expo-router";
import { Text, View } from "moti";
import React, { PropsWithChildren, useRef, useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { CustomPressable } from "@/components/ui/CustomPressable";
import { IconDotsVertical } from "@tabler/icons-react-native";
import { colors } from "@/constants";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Id } from "@/convex/_generated/dataModel";
import { LoadingModal } from "@/components/LoadingModal";
import { useHandleLeave } from "@/hooks/useHandleLeave";

const MENU_WIDTH = 150;
type Props = {
  conversationId: Id<"conversations">;
};
export const GroupChatMenu = ({ conversationId }: Props) => {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const { onLeaveGroup, leaving } = useHandleLeave({ conversationId });

  const buttonRef = useRef<TouchableOpacity>(null);
  const animation = useSharedValue(0);
  const measureButton = () => {
    buttonRef.current?.measure((x, y, width, height, pageX, pageY) => {
      // Position menu below the button
      setMenuPosition({
        top: pageY + height + 5,
        right: Dimensions.get("window").width - (pageX + width),
      });
    });
  };

  const handleOpenMenu = () => {
    measureButton();
    setShowMenu(true);
    animation.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });
  };

  const handleCloseMenu = () => {
    setShowMenu(false);
    animation.value = withTiming(
      0,
      {
        duration: 200,
      },
      () => {
        runOnJS(setShowMenu)(false);
      },
    );
  };

  const menuAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animation.value,
      transform: [
        {
          translateY: interpolate(animation.value, [0, 1], [-20, 0]),
        },
      ],
    };
  });

  const MenuItem = ({
    onPress,
    children,
  }: PropsWithChildren<{ onPress: () => void }>) => (
    <CustomPressable
      onPress={() => {
        onPress?.();
        handleCloseMenu();
      }}
      style={styles.menuItem}
    >
      <Text style={styles.text}>{children}</Text>
    </CustomPressable>
  );

  const onLeave = () => {
    handleCloseMenu();
    onLeaveGroup();
  };
  const onNavigate = () => {
    handleCloseMenu();
    router.push(`/group-info?conversationId=${conversationId}`);
  };

  return (
    <>
      <LoadingModal visible={leaving} />
      <View>
        <TouchableOpacity ref={buttonRef} onPress={handleOpenMenu}>
          <IconDotsVertical color={colors.white} />
        </TouchableOpacity>

        <Modal
          visible={showMenu}
          transparent
          animationType="none"
          onRequestClose={handleCloseMenu}
        >
          <Pressable style={styles.backdrop} onPress={handleCloseMenu}>
            <Animated.View
              style={[
                styles.menuContainer,
                {
                  top: menuPosition.top,
                  right: menuPosition.right,
                },
                menuAnimatedStyle,
              ]}
            >
              <MenuItem onPress={onLeave}>Leave group</MenuItem>
              <View style={styles.divider} />
              <MenuItem onPress={onNavigate}>Group info</MenuItem>
            </Animated.View>
          </Pressable>
        </Modal>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  menuContainer: {
    position: "absolute",
    width: MENU_WIDTH,
    backgroundColor: "white",
    borderRadius: 5,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  text: {
    fontSize: 15,
    fontFamily: "NunitoBold",
    color: "#000",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginVertical: 4,
  },
});
