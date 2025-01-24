import { ErrorComponent } from '@/components/ErrorComponent';
import { useAuth } from '@/lib/zustand/useAuth';
import { useFingerPrint } from '@/lib/zustand/useFingerPrint';
import { usePassCode } from '@/lib/zustand/usePasscode';
import { useIsLocked, usePath } from '@/lib/zustand/usePath';
import {
  ErrorBoundaryProps,
  Href,
  Redirect,
  router,
  Stack,
  usePathname,
} from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';

export function ErrorBoundary({ retry }: ErrorBoundaryProps) {
  return <ErrorComponent onPress={retry} />;
}

const ProtectedLayout = () => {
  const id = useAuth((state) => state.user.id);

  const lock = useFingerPrint((state) => state.lock);
  const lockDevice = useFingerPrint((state) => state.lockDevice);
  const isPassCode = usePassCode((state) => state.isPassCode);
  const passCode = usePassCode((state) => state.passCode);
  const lockDeviceWithPassCode = usePassCode((state) => state.lockDevice);

  const setLock = useIsLocked((state) => state.lock);
  const setPath = usePath((state) => state.setPath);

  const currentPath = usePath((state) => state.currentPath);
  const appState = useRef(AppState.currentState);
  const pathname = usePathname();
  console.log(pathname);
  const pathToStore =
    pathname === '/lock' || pathname === '/check-passcode'
      ? currentPath
      : pathname;
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        if (
          pathname.includes('singleChat') ||
          pathname.includes('group-chat') ||
          pathname.includes('camera')
        )
          return;
        if (lock && pathname !== '/lock' && pathname !== '/check-passcode') {
          setLock();
          router.replace('/lock');
          return;
        }
        if (
          isPassCode &&
          pathname !== '/check-passcode' &&
          pathname !== '/lock'
        ) {
          console.log('processed');
          router.replace('/check-passcode');
        }
      } else {
        setPath(pathToStore as Href);
        if (lock) {
          lockDevice();
        }
        if (passCode) {
          lockDeviceWithPassCode();
        }
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [
    lock,
    pathname,
    setLock,
    isPassCode,
    setPath,
    lockDevice,
    lockDeviceWithPassCode,
    passCode,
    pathToStore,
  ]);
  if (!id) return <Redirect href="/login" />;
  return (
    <>
      <StatusBar backgroundColor="white" style={'dark'} />
      <MenuProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </MenuProvider>
    </>
  );
};
export default ProtectedLayout;
