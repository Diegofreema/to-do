import { Href, Link } from "expo-router";
import {StyleProp, StyleSheet, TextStyle} from "react-native";
import {colors} from "@/constants";

type Props = {
  text: string;
  link: Href;
  textStyle?: StyleProp<TextStyle>
};
export const LinkText = ({ link, text,textStyle }: Props) => {
  return <Link href={link} style={[styles.link, textStyle]}>{text}</Link>;
};

const styles = StyleSheet.create({
    link: {
        color: colors.lightblue,
        textDecorationLine: 'underline',
        fontFamily: "NunitoBold",
    }
})
