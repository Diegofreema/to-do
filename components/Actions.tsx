import { AntDesign } from '@expo/vector-icons';
import { useMemo } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';

import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
type Props = {
  visible: boolean;
  onVisible: () => void;
  onHide: () => void;
  onToggleTodo: (name: string) => void;
  onDeleteTodo: (name: string) => void;
  name: string;
  isCompleted: boolean;
};
export const Action = ({
  onHide,
  onVisible,
  visible,
  onDeleteTodo,
  onToggleTodo,
  name,
  isCompleted,
}: Props) => {
  const text = useMemo(
    () => (isCompleted ? 'Unset completed' : 'Set completed'),
    [isCompleted]
  );

  const handleDelete = () => {
    onDeleteTodo(name);
    onHide();
  };

  const handleToggle = () => {
    onToggleTodo(name);
    onHide();
  };

  return (
    <Menu opened={visible} onBackdropPress={onHide} onClose={onHide}>
      <MenuTrigger />

      <MenuOptions optionsContainerStyle={{ padding: 10 }}>
        <MenuOption text={text} onSelect={handleToggle} />
        <MenuOption text="Delete" onSelect={handleDelete} />
      </MenuOptions>
      <TouchableOpacity onPress={onVisible}>
        <AntDesign
          name="ellipsis1"
          size={24}
          color="black"
          //
        />
      </TouchableOpacity>
    </Menu>
  );
};
