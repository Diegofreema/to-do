import CustomBackgroundImage from "@/components/ui/CustomBackgroundImage";
import { TokenForm } from "@/components/form/TokenForm";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { View } from "moti";
import { ActivityIndicator } from "react-native";
import { colors } from "@/constants";
import { useEffect } from "react";
import { useTempData } from "@/lib/zustand/useTempData";
import { ErrorBoundaryProps } from "expo-router";
import { ErrorComponent } from "@/components/ui/ErrorComponent";
import { ScrollWrapper } from "@/components/ui/Wrapper";

export function ErrorBoundary({ retry }: ErrorBoundaryProps) {
  return <ErrorComponent retry={retry} />;
}

const Token = () => {
  const details = useTempData((state) => state.user);
  const data = useQuery(api.user.checkIfUserIsInDb, { id: details.id });
  const addUserToDb = useMutation(api.user.addUserToDb);
  useEffect(() => {
    if (data === "not found") {
      const onAddUser = async () => {
        await addUserToDb({
          userId: details.id,
          name: `${details.fname} ${details.lname}`,
          image: `https://fpn.netpro.software/Uploads/${details.id}.jpeg`,
          department: details.Department,
          faculty: details.Faculty,
        });
      };
      onAddUser();
    }
  }, [data, details, addUserToDb]);

  if (!data)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color={colors.lightblue} size={"large"} />
      </View>
    );
  return (
    <ScrollWrapper styles={{ paddingHorizontal: 0 }}>
      <CustomBackgroundImage
        text="E-Mail Address Verification"
        text2="Enter the 5 Digit Code sent to Johndoe@gmail.com"
      >
        <TokenForm />
      </CustomBackgroundImage>
    </ScrollWrapper>
  );
};
export default Token;
