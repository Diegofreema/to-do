import { StyleSheet, Text } from 'react-native';

type Props = {
  text: string;
};

export const Label = ({ text }: Props) => {
  return <Text style={styles.label}>{text}</Text>;
};

const styles = StyleSheet.create({
  label: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
