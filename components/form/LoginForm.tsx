import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import { z } from 'zod';

import { AnimatedContainer } from '@/components/animated/AnimatedContainer';
import { CustomInput } from '@/components/form/CustomInput';
import { Button } from '@/components/ui/Button';
import { Stack } from '@/components/ui/Stack';
import { loginSchema } from '@/lib/hookform/validators';
import axios from 'axios/index';

// import { generateFromRandomNumbersOtp, sendEmail } from "@/helper";
import { useAuth } from '@/lib/zustand/useAuth';
import { useShowToast } from '@/lib/zustand/useShowToast';

export const LoginForm = () => {
  const [secure, setSecure] = useState<boolean>(true);
  const toggleSecure = () => setSecure(!secure);
  // const setDetails = useStoreId((state) => state.setDetails);
  // const getData = useTempData((state) => state.getUser);
  // ! to remove later
  const getUser = useAuth((state) => state.getUser);
  const { onShow } = useShowToast();
  const {
    formState: { errors, isSubmitting },
    reset,
    handleSubmit,
    control,
  } = useForm<z.infer<typeof loginSchema>>({
    defaultValues: {
      password: '',
      email: '',
    },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      const { data } = await axios(
        `https://estate.netpro.software/api.aspx?api=userlogin&email=${values.email}&pasword=${values.password}`
      );

      if (data.result === 'failed') {
        return onShow({
          message: 'Error',
          description: 'Failed to login',
          type: 'error',
        });
      }
      if (data.result === 'incorrect credentials') {
        return onShow({
          message: 'Error',
          description: 'Incorrect credentials',
          type: 'error',
        });
      }
      // const otp = generateFromRandomNumbersOtp();
      // await sendEmail(values.email, otp);
      getUser(data);
      // setDetails(data.id);
      onShow({
        message: 'Success',
        description: 'Welcome back',
        type: 'success',
      });
      // getData(data);
      reset();
      onShow({
        message: 'Success',
        description: 'An otp was sent to your email',
        type: 'success',
      });
      // router.push(`/token?token=${otp}`);
    } catch (e: any) {
      console.log('error', e);
      onShow({
        message: 'Error',
        description: 'Something went wrong',
        type: 'error',
      });
    }
  };

  return (
    <AnimatedContainer>
      <Stack>
        <CustomInput
          control={control}
          errors={errors}
          name="email"
          placeholder="Johndoe@gmail.com"
          label="Email"
          type="email-address"
        />
        <CustomInput
          control={control}
          errors={errors}
          name="password"
          placeholder="********"
          label="Password"
          password
          secureTextEntry={secure}
          toggleSecure={toggleSecure}
        />
      </Stack>
      <View style={{ marginTop: 50 }}>
        <Button
          text={'Login'}
          onPress={handleSubmit(onSubmit)}
          isLoading={isSubmitting}
          isDisabled={isSubmitting}
        />
      </View>
    </AnimatedContainer>
  );
};
