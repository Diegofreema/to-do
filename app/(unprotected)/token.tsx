import CustomBackgroundImage from '@/components/ui/CustomBackgroundImage';
import { TokenForm } from '@/components/form/TokenForm';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { View } from 'moti';
import { ActivityIndicator } from 'react-native';
import { colors } from '@/constants';
import { useEffect } from 'react';
import { useTempData } from '@/lib/zustand/useTempData';
import { ErrorBoundaryProps } from 'expo-router';
import { ErrorComponent } from '@/components/ui/ErrorComponent';
import { ScrollWrapper } from '@/components/ui/Wrapper';
import { useNotification } from '@/utils/context/NotificationContext';
import { useId } from '@/lib/zustand/useId';
// import { usePush } from "@/hooks/usePush";

export function ErrorBoundary({ retry }: ErrorBoundaryProps) {
  return <ErrorComponent retry={retry} />;
}

const Token = () => {
  const details = useTempData((state) => state.user);
  const data = useQuery(api.user.checkIfUserIsInDb, { id: details.id });
  const getId = useId((state) => state.getId);
  const { expoPushToken, notification, error } = useNotification();
  // const token = usePush();
  console.log({ error, notification });
  console.log({ expoPushToken });
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
          pushToken: expoPushToken!,
        });
        getId(id!);
      };
      onAddUser();
    } else if (data !== undefined) {
      getId(data?._id!);
    }
  }, [data, details, addUserToDb, expoPushToken, getId]);

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
