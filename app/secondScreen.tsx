import { Text, View } from 'react-native';

export default function SecondScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ fontSize: 50, fontWeight: 'bold', color: 'blue' }}>
        Edit app/secondScreen.tsx to edit this screen.
      </Text>
    </View>
  );
}
