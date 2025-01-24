import { FingerPrintModal } from "@/components/FingerPrintModal";
import { Boxes } from "@/components/ui/Boxes";
import { Data } from "@/components/ui/Data";
import { ProfileHeader } from "@/components/ui/ProfileHeader";
import { ScrollWrapper } from "@/components/ui/Wrapper";
import { useFingerPrint } from "@/lib/zustand/useFingerPrint";
import { useFirstTimeModal } from "@/lib/zustand/useFirstTimeModal";
import { usePassCode } from "@/lib/zustand/usePasscode";
import { ErrorBoundaryProps, Redirect, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { ErrorComponent } from "@/components/ui/ErrorComponent";

export function ErrorBoundary({ retry }: ErrorBoundaryProps) {
  return <ErrorComponent retry={retry} />;
}

export default function HomeScreen() {
  const [visible, setVisible] = useState(false);
  const isFirstTime = useFirstTimeModal((state) => state.isFirstTime);
  const pathname = usePathname();

  const lock = useFingerPrint((state) => state.lock);
  const deviceIsLock = useFingerPrint((state) => state.deviceIsLock);
  const deviceIsLockWithPin = usePassCode((state) => state.deviceIsLock);
  useEffect(() => {
    if (!lock && pathname === "/" && isFirstTime) {
      setTimeout(() => setVisible(true), 4000);
    }
  }, [lock, pathname, isFirstTime]);
  if (deviceIsLock && pathname !== "/lock" && pathname !== "check-passcode")
    return <Redirect href="/lock" />;
  if (
    deviceIsLockWithPin &&
    pathname !== "/lock" &&
    pathname !== "check-passcode"
  )
    return <Redirect href="/check-passcode" />;
  return (
    <ScrollWrapper>
      <FingerPrintModal visible={visible} onClose={() => setVisible(false)} />
      <ProfileHeader />
      <Boxes />
      <Data />
    </ScrollWrapper>
  );
}
