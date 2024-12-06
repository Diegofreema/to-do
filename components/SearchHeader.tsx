import { NavHeader } from "@/components/ui/NavHeader";
import { AnimatePresence, View } from "moti";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { IconArrowNarrowLeft, IconSearch } from "@tabler/icons-react-native";
import { colors } from "@/constants";
import { useState } from "react";

type Props = {
  title?: string;
};

export const SearchHeader = ({ title = "Select student" }: Props) => {
  const [showSearch, setShowSearch] = useState(false);
  const { width } = useWindowDimensions();
  return (
    <View>
      <NavHeader
        title={title}
        leftContent={() => <LeftContent onPress={() => setShowSearch(true)} />}
      />

      <AnimatePresence>
        {showSearch && (
          <View
            style={styles.container}
            from={{
              transform: [
                { translateX: width + 10 },
                { scale: 0 },
                { perspective: 10 },
              ],
            }}
            animate={{
              transform: [
                { translateX: 0 },
                { scale: 1 },
                { perspective: 100 },
              ],
            }}
            exit={{
              transform: [
                { translateX: width + 10 },
                { scale: 0 },
                { perspective: 10 },
              ],
            }}
          >
            <TouchableOpacity
              style={{ padding: 5 }}
              onPress={() => setShowSearch(false)}
            >
              <IconArrowNarrowLeft color={colors.black} size={30} />
            </TouchableOpacity>
            <TextInput style={styles.input} placeholder={"Search by name"} />
          </View>
        )}
      </AnimatePresence>
    </View>
  );
};

const LeftContent = ({ onPress }: { onPress: () => void }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <IconSearch color={colors.black} size={25} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 5,
    backgroundColor: colors.white,
    position: "absolute",
    zIndex: 55,
    top: 0,
  },
  input: {
    flex: 1,
    fontFamily: "NunitoRegular",
    fontSize: 15,
  },
});
