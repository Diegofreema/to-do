import { TokenForm } from '@/components/form/TokenForm';
import CustomBackgroundImage from '@/components/ui/CustomBackgroundImage';
import { ErrorComponent } from '@/components/ui/ErrorComponent';
import { ScrollWrapper } from '@/components/ui/Wrapper';
import { colors } from '@/constants';
import { api } from '@/convex/_generated/api';
import { useExpoToken } from '@/lib/zustand/useExpoToken';
import { useId } from '@/lib/zustand/useId';
import { useTempData } from '@/lib/zustand/useTempData';
import { useMutation, useQuery } from 'convex/react';
import { ErrorBoundaryProps } from 'expo-router';
import { View } from 'moti';
import { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
// import { usePush } from "@/hooks/usePush";

export function ErrorBoundary({ retry }: ErrorBoundaryProps) {
  return <ErrorComponent retry={retry} />;
}

const Token = () => {
  const details = useTempData((state) => state.user);
  const data = useQuery(api.user.checkIfUserIsInDb, { id: details.id });
  const getId = useId((state) => state.getId);
  const token = useExpoToken((state) => state.expoToken);
  // const token = usePush();

  const addUserToDb = useMutation(api.user.addUserToDb);
  useEffect(() => {
    if (data === null) {
      const onAddUser = async () => {
        const id = await addUserToDb({
          userId: details.id,
          name: `${details.fname} ${details.lname}`,
          image: `https://fpn.netpro.software/Uploads/${details.id}.jpeg`,
          department: details.Department,
          faculty: details.Faculty,
          pushToken: token,
        });
        getId(id!);
      };
      onAddUser();
    } else if (data !== undefined) {
      getId(data?._id!);
    }
  }, [data, details, addUserToDb, token, getId]);

  if (!data)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={colors.lightblue} size={'large'} />
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
