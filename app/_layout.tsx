import { Toast } from "@/components/ui/toast";
import { useShowToast } from "@/lib/zustand/useShowToast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Slot, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { ConvexProvider, ConvexReactClient } from "convex/react";
const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();
export default function RootLayout() {
  const { isOpen, onHide } = useShowToast();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    NunitoLight: require("../assets/fonts/NunitoLight.ttf"),
    NunitoRegular: require("../assets/fonts/NunitoRegular.ttf"),
    NunitoBold: require("../assets/fonts/NunitoBold.ttf"),
  });
  const pathname = usePathname();
  console.log(pathname);
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => onHide(), 3000);
    }
  }, [isOpen, onHide]);
  if (!loaded) {
    return null;
  }

  return (
    <>
      <StatusBar style="dark" />
      <ConvexProvider client={convex}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <QueryClientProvider client={queryClient}>
            <Toast />
            <Slot screenOptions={{ headerShown: false }} />
          </QueryClientProvider>
        </GestureHandlerRootView>
      </ConvexProvider>
    </>
  );
}
