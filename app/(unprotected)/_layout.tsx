import { useAuth } from '@/lib/zustand/useAuth';
import { usePassCode } from '@/lib/zustand/usePasscode';
import { Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

const Unprotected = () => {
  const id = useAuth((state) => state.user.id);

  const passCode = usePassCode((state) => state.passCode);
  if (id && passCode) {
    return <Redirect href="/" />;
  }
  if (id && !passCode) {
    return <Redirect href="/passcode" />;
  }
  return (
    <>
      <StatusBar style="light" />

      <Stack
        screenOptions={{ headerShown: false, animation: 'slide_from_left' }}
      />
    </>
  );
};
export default Unprotected;
