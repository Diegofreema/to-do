import { TouchableOpacity, TouchableOpacityProps } from "react-native";

type Props = TouchableOpacityProps & {};

export const CustomPressable = ({ ...props }: Props) => {
  return <TouchableOpacity style={{ padding: 5 }} {...props} />;
};
