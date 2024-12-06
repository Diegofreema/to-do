import { Wrapper } from "@/components/ui/Wrapper";
import { Title } from "@/components/typography/Title";
import { Button } from "@/components/ui/Button";
import { colors } from "@/constants";

export const ErrorComponent = ({ retry }: { retry: () => void }) => {
  return (
    <Wrapper
      styles={{ gap: 5, justifyContent: "center", alignItems: "center" }}
    >
      <Title
        text={"Something went wrong"}
        textStyle={{ color: "black", textAlign: "center" }}
      />
      <Button
        text={"Retry"}
        onPress={retry}
        textStyle={{ color: colors.lightblue }}
        style={{ backgroundColor: "transparent" }}
      />
    </Wrapper>
  );
};
