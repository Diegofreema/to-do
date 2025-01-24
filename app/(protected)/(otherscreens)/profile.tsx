import { ProfileBackground } from "@/components/ProfileBackground";
import { ProfileInfo } from "@/components/ui/ProfileInfo";
import { StatusBar } from "expo-status-bar";
import { ScrollView } from "moti";
import React from "react";

const Profile = () => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40, backgroundColor: "white" }}
    >
      <ProfileBackground>
        <StatusBar style={"light"} />
        <ProfileInfo />
      </ProfileBackground>
    </ScrollView>
  );
};
export default Profile;
