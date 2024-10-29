import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Label } from './Label';
import { CustomButton } from './CustomButton';
import { useState } from 'react';
import { useTodo } from '@/lib/zustand/useTodo';
import { Todo } from './Todos';

type Props = {
  closeBottomSheet: () => void;
};
export const AddTask = ({ closeBottomSheet }: Props) => {
  const [value, setValue] = useState('');
  const addTodo = useTodo((state) => state.addTodo);
  const [category, setCategory] = useState('Personal');
  const [description, setDescription] = useState('');
  const newTodo = {
    name: value,
    category,
    description,
    isCompleted: false,
  };
  const isValid = value.length > 2 && description.length > 2;
  const onAddTodo = () => {
    addTodo(newTodo);
    closeBottomSheet();
    setValue('');
    setDescription('');
  };

  const onCancel = () => {
    setValue('');
    setDescription('');
    closeBottomSheet();
  };
  const isActivePersonal = category === 'Personal' ? 'skyblue' : '#eee';
  const isActiveWork = category === 'Work' ? 'skyblue' : '#eee';
  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Task</Text>
      <View style={styles.divider} />
      {/* // input container */}
      <View style={styles.inputContainer}>
        <Label text="Title Task" />
        <TextInput
          style={styles.input}
          placeholder="Add Task Name"
          placeholderTextColor={'#ccc'}
          value={value}
          onChangeText={(text) => setValue(text)}
        />
      </View>
      {/* end of input container */}
      {/* category */}
      <View style={styles.inputContainer}>
        <Label text="Category" />
        <View style={styles.btnContainer}>
          <CustomButton
            onPress={() => setCategory('Personal')}
            title="Personal"
            backgroundColor={isActivePersonal}
          />
          <CustomButton
            onPress={() => setCategory('Work')}
            title="Work"
            backgroundColor={isActiveWork}
          />
        </View>
      </View>
      {/* end of category */}

      <View style={styles.inputContainer}>
        <Label text="Description" />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Add Description"
          placeholderTextColor={'#ccc'}
          value={description}
          onChangeText={(text) => setDescription(text)}
        />
      </View>

      <View style={[styles.btnContainer, { marginTop: 50 }]}>
        <CustomButton
          title="Cancel"
          backgroundColor="skyblue"
          onPress={onCancel}
        />
        <CustomButton
          onPress={onAddTodo}
          title="Create"
          backgroundColor="#eee"
          disabled={!isValid}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  divider: {
    backgroundColor: '#ccc',
    width: '60%',
    marginHorizontal: 'auto',
    height: 2,
    marginTop: 20,
  },
  inputContainer: {
    marginTop: 20,
    gap: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  btnContainer: { flexDirection: 'row', gap: 20 },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
});
