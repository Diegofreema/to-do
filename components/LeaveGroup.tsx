import { IconDoorExit } from "@tabler/icons-react-native";
import { Button } from "@/components/ui/Button";
import { Id } from "@/convex/_generated/dataModel";
import { useHandleLeave } from "@/hooks/useHandleLeave";

type Props = {
  conversationId: Id<"conversations">;
};

export const LeaveGroup = ({ conversationId }: Props) => {
  const { onLeaveGroup, leaving } = useHandleLeave({ conversationId });
  return (
    <Button
      text={"Leave group"}
      onPress={onLeaveGroup}
      style={{ backgroundColor: "red" }}
      icon={IconDoorExit}
      isLoading={leaving}
    />
  );
};
