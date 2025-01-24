import { AnimatedContainer } from '@/components/animated/AnimatedContainer';
import { IDCard } from '@/components/ui/IDCard';
import { ProfileDetail } from '@/components/ui/ProfileDetail';

export const ProfileInfo = () => {
  return (
    <AnimatedContainer>
      <ProfileDetail />
      <IDCard />
    </AnimatedContainer>
  );
};
