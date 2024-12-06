import { Wrapper } from "@/components/ui/Wrapper";
import { SearchHeader } from "@/components/SearchHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Spacer } from "@/components/ui/Divider";
import { ChatLoader } from "@/components/Skeletons/ChatLoader";

const NewGroup = () => {
  const { top } = useSafeAreaInsets();
  return (
    <Wrapper styles={{ marginTop: top }}>
      <SearchHeader title={"New Group"} />
      <Spacer space={60} />
      <ChatLoader />
    </Wrapper>
  );
};
export default NewGroup;
