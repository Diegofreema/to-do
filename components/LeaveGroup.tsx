import { IconDoorExit, IconSquareX } from '@tabler/icons-react-native';
import { Button } from '@/components/ui/Button';
import { Id } from '@/convex/_generated/dataModel';
import { useHandleLeave } from '@/hooks/useHandleLeave';
import { useCloseGroup } from '@/hooks/useCloseGroup';
import { useCallback } from 'react';

type Props = {
  conversationId: Id<'conversations'>;
  isCreator: boolean;
};

export const LeaveGroup = ({ conversationId, isCreator }: Props) => {
  const { onLeaveGroup, leaving } = useHandleLeave({ conversationId });
  const { onCloseGroup, leaving: leavingGroup } = useCloseGroup({
    conversationId,
  });
  const btnText = isCreator ? 'Close group' : 'Leave group';
  const Icon = isCreator ? IconSquareX : IconDoorExit;
  const isLoading = leaving || leavingGroup;
  const onPress = useCallback(() => {
    if (isCreator) {
      onCloseGroup();
    } else {
      onLeaveGroup();
    }
  }, [isCreator, onCloseGroup, onLeaveGroup]);
  return (
    <Button
      text={btnText}
      onPress={onPress}
      style={{ backgroundColor: 'red' }}
      icon={Icon}
      isLoading={isLoading}
    />
  );
};
