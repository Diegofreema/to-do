import { AddTask } from '@/components/Addtask';
import { CustomButton } from '@/components/CustomButton';
import { NewButton } from '@/components/NewButton';
import { Todos } from '@/components/Todos';
import { useTodo } from '@/lib/zustand/useTodo';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Index() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const todos = useTodo((state) => state.todo);
  const [category, setCategory] = useState('Personal');
  const snapShots = useMemo(() => ['25%', '50%', '75%'], []);
  const filteredTodos = useMemo(() => {
    return todos.filter(
      (todo) => todo.category.toLowerCase() === category.toLowerCase()
    );
  }, [todos, category]);
  console.log({ filteredTodos, todos });
  const openBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };
  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
  };

  const isActivePersonal = category === 'Personal' ? 'skyblue' : '#eee';
  const isActiveWork = category === 'Work' ? 'skyblue' : '#eee';
  return (
    <View style={styles.container}>
      <Text style={styles.today}>Today</Text>
      <Text style={styles.date}>October 5, 2023</Text>
      {/*  end of text */}
      <View style={styles.card}>
        <Text style={styles.cardText}>
          Keep it up!! Complete your tasks. You are almost there!
        </Text>
      </View>
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
      <Todos todos={filteredTodos} />
      <NewButton onPress={openBottomSheet} />
      {/*  end of card */}
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapShots}
        index={-1}
        enablePanDownToClose
      >
        <BottomSheetScrollView style={{ flex: 1 }}>
          <AddTask closeBottomSheet={closeBottomSheet} />
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    paddingHorizontal: 15,
  },
  today: { color: '#ccc', fontSize: 20 },
  date: { color: 'black', fontSize: 30, fontWeight: '700' },
  card: {
    marginTop: 20,
    height: 150,
    width: '100%',
    backgroundColor: 'skyblue',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: { fontSize: 25, color: 'white', fontWeight: '600' },
  btnContainer: { flexDirection: 'row', gap: 20, marginTop: 20 },
});
