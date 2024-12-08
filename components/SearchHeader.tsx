import { NavHeader } from "@/components/ui/NavHeader";
import { TouchableOpacity } from "react-native";
import { IconSearch } from "@tabler/icons-react-native";
import { colors } from "@/constants";
import { router } from "expo-router";

type Props = {
  title?: string;
};

export const SearchHeader = ({ title = "Select student" }: Props) => {
  return (
    <NavHeader
      title={title}
      leftContent={() => (
        <LeftContent onPress={() => router.push("/search-conversations")} />
      )}
    />
  );
};

const LeftContent = ({ onPress }: { onPress: () => void }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <IconSearch color={colors.black} size={25} />
    </TouchableOpacity>
  );
};
