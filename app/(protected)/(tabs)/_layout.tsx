import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/HapticTab";
import { TabIcons } from "@/components/TabIcons";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { colors } from "@/constants";
import {
  IconCashBanknote,
  IconDotsCircleHorizontal,
  IconHome2,
  IconIdBadge,
  IconMessage,
  IconSchool,
} from "@tabler/icons-react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/lib/zustand/useAuth";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { View } from "react-native";
import { UnreadCount } from "@/components/UnreadCount";

export default function TabLayout() {
  const id = useAuth((state) => state.user.id);

  const data = useQuery(api.conversation.getUnreadAllMessages, {
    userId: id,
  });
  const showUnreadCount = data && data > 0;
  return (
    <>
      <StatusBar backgroundColor="white" style="dark" />
      <SafeAreaView style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: colors.lightblue,
            headerShown: false,
            tabBarButton: HapticTab,
            tabBarBackground: TabBarBackground,
            tabBarLabelStyle: { fontFamily: "NunitoBold", fontSize: 12 },
            tabBarStyle: { backgroundColor: "white" },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Home",
              tabBarIcon: ({ size, focused }) => (
                <TabIcons
                  id="in"
                  size={size}
                  focused={focused}
                  icon={IconHome2}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="academics"
            options={{
              title: "Academics",
              href: null,
              tabBarIcon: ({ size, focused }) => (
                <TabIcons
                  id="aca"
                  size={size}
                  focused={focused}
                  icon={IconSchool}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="payment"
            options={{
              title: "Payments",
              href: null,
              tabBarIcon: ({ size, focused }) => (
                <TabIcons
                  id="payment"
                  size={size}
                  focused={focused}
                  icon={IconCashBanknote}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="chat"
            options={{
              title: "chats",
              tabBarIcon: ({ size, focused }) => (
                <View>
                  <TabIcons
                    id="chat"
                    size={size}
                    focused={focused}
                    icon={IconMessage}
                  />
                  {showUnreadCount ? (
                    <UnreadCount
                      unread={data}
                      style={{ position: "absolute", top: -5, right: -8 }}
                    />
                  ) : null}
                </View>
              ),
            }}
          />

          <Tabs.Screen
            name="id"
            options={{
              title: "ID",
              tabBarIcon: ({ size, focused }) => (
                <TabIcons
                  size={size}
                  focused={focused}
                  icon={IconIdBadge}
                  id="more"
                />
              ),
            }}
          />
          <Tabs.Screen
            name="more"
            options={{
              title: "More",
              tabBarIcon: ({ size, focused }) => (
                <TabIcons
                  size={size}
                  focused={focused}
                  icon={IconDotsCircleHorizontal}
                  id="more"
                />
              ),
            }}
          />
        </Tabs>
      </SafeAreaView>
    </>
  );
}
