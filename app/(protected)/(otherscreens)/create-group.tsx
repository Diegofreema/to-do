import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Wrapper } from "@/components/ui/Wrapper";
import { NavHeader } from "@/components/ui/NavHeader";
import { useNewGroupMembers } from "@/lib/zustand/useNewGroupMembers";
import { NewGroupUser } from "@/components/NewGroupUsers";
import { HStack } from "@/components/ui/HStack";
import { colors } from "@/constants";
import { AbsoluteAction } from "@/components/AbsoluteAction";
import { IconCheck } from "@tabler/icons-react-native";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { useShowToast } from "@/lib/zustand/useShowToast";
import { router } from "expo-router";
import { useAuth } from "@/lib/zustand/useAuth";

const CreateGroup = () => {
  const { top } = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [value, setValue] = useState("");
  const [creating, setCreating] = useState(false);
  const {
    user: { id, fname, lname },
  } = useAuth();
  const onShowToast = useShowToast((state) => state.onShow);
  const createGroup = useMutation(api.conversation.createGroup);
  const members = useNewGroupMembers((state) => state.members);
  const clearMembers = useNewGroupMembers((state) => state.clearMembers);
  const data = useQuery(api.user.getUserById, { userId: id });

  const numColumns = Math.floor((width - 20) / 80);
  if (data === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color={colors.lightblue} size={"large"} />
      </View>
    );
  }
  const onCreate = async () => {
    if (!data?.userId) return;
    if (value.trim() === "") {
      onShowToast({
        type: "error",
        description: "Please add a group name",
        message: "Failed to create group",
      });
      return;
    }
    if (value.trim().length < 3) {
      onShowToast({
        type: "error",
        description: "Group name should be at least that 3 characters",
        message: "Failed to create group",
      });
      return;
    }
    setCreating(true);
    try {
      await createGroup({
        members: [data?._id, ...members.map((m) => m.id)],
        name: value,
        admin: data?._id,
        createdBy: `${fname} ${lname}`,
      });
      onShowToast({
        type: "success",
        message: "Success",
        description: "Group has been created",
      });
      clearMembers();
      router.replace("/");
    } catch (e) {
      console.log(e);
      onShowToast({
        type: "error",
        message: "Failed to create group",
        description: "Something went wrong, please try again",
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <Wrapper styles={{ marginTop: top }}>
      <NavHeader title={"Create group"} />
      <HStack
        style={{ marginBottom: 20 }}
        justifyContent={"flex-start"}
        leftContent={() => null}
        rightContent={() => (
          <TextInput
            placeholder={"Group name"}
            style={styles.input}
            autoFocus
            onChangeText={setValue}
            value={value}
          />
        )}
      />
      <View style={{ gap: 20, width: "100%" }}>
        <Text style={{ fontFamily: "NunitoLight" }}>
          Members: {members.length}
        </Text>

        <FlatList
          data={members}
          renderItem={({ item }) => (
            <NewGroupUser item={item} showBtn={false} />
          )}
          style={{ width: "100%" }}
          contentContainerStyle={{
            gap: 20,
            width: "100%",
          }}
          numColumns={numColumns}
        />
      </View>
      <AbsoluteAction icon={IconCheck} onPress={onCreate} loading={creating} />
    </Wrapper>
  );
};
export default CreateGroup;

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
  },
  pressable: {
    width: 50,
    height: 50,
    borderRadius: 50,
    overflow: "hidden",
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightblue,
    paddingVertical: 15,
  },
});
