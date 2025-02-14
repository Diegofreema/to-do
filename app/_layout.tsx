import { Toast } from "@/components/ui/toast";
import { useShowToast } from "@/lib/zustand/useShowToast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { useFonts } from "expo-font";
import { Slot, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ConvexQueryClient } from "@convex-dev/react-query";
import * as Updates from "expo-updates";
import { NotificationProvider } from "@/utils/context/NotificationContext";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";

TaskManager.defineTask(
  BACKGROUND_NOTIFICATION_TASK,
  ({ data, error, executionInfo }) => {
    console.log("✅ Received a notification in the background!", {
      data,
      error,
      executionInfo,
    });
    // Do something with the notification data
  },
);

Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});
const convexQueryClient = new ConvexQueryClient(convex);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKeyHashFn: convexQueryClient.hashFn(),
      queryFn: convexQueryClient.queryFn(),
    },
  },
});
convexQueryClient.connect(queryClient);
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
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
    async function onFetchUpdateAsync() {
      try {
        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (error) {
        // You can also add an alert() to see the error message in case of an error when fetching updates.
        console.log(error);
      }
    }
    onFetchUpdateAsync();
  }, []);
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
      <NotificationProvider>
        <ConvexProvider client={convex}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <QueryClientProvider client={queryClient}>
              <Toast />
              <ActionSheetProvider>
                <Slot screenOptions={{ headerShown: false }} />
              </ActionSheetProvider>
            </QueryClientProvider>
          </GestureHandlerRootView>
        </ConvexProvider>
      </NotificationProvider>
    </>
  );
}
