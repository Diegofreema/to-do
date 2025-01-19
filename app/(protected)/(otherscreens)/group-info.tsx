import { Wrapper } from "@/components/ui/Wrapper";
import { NavHeader } from "@/components/ui/NavHeader";
import { useLocalSearchParams } from "expo-router";
import { Id } from "@/convex/_generated/dataModel";
import { GroupInfo } from "@/components/GroupInfo";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const GroupInformation = () => {
  const { conversationId } = useLocalSearchParams<{
    conversationId: Id<"conversations">;
  }>();
  const { top } = useSafeAreaInsets();
  return (
    <Wrapper styles={{ marginTop: top }}>
      <NavHeader title={"Group info"} />
      <GroupInfo conversationId={conversationId} />
    </Wrapper>
  );
};
export default GroupInformation;
