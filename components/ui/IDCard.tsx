import { StyleSheet, View } from "react-native";
import { colors } from "@/constants";
import { Title } from "@/components/typography/Title";
import { borderRadius, spacing } from "@/constants/constants";
import { RFPercentage } from "react-native-responsive-fontsize";
import { FlexText } from "@/components/ui/FlexText";
import { useAuth } from "@/lib/zustand/useAuth";

export const IDCard = () => {
  const { user } = useAuth();

  const {
    fname,
    lname,
    matricnumber,
    email,
    phone,
    birthday,
    Faculty,
    mname,
    Department,
    programtype,
  } = user;
  const userArray = [
    { title: "First name", value: fname },
    { title: "Middle name", value: mname },
    { title: "Last name", value: lname },
    { title: "Matric number", value: matricnumber },
    { title: "Email", value: email },
    { title: "Phone", value: phone },
    { title: "birthday", value: birthday },
    { title: "Faculty", value: Faculty },
    { title: "Department", value: Department },
    { title: "Program", value: programtype },
  ];
  return (
    <View style={styles.container}>
      <Title text={"Information"} textStyle={styles.title} />
      <View style={{ gap: 5, width: "100%" }}>
        {userArray.map((credential) => (
          <FlexText
            text={credential.title}
            text2={credential.value}
            key={credential.title}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius,
    padding: spacing,
    marginTop: 15,
  },
  title: {
    fontSize: RFPercentage(2.6),
    fontFamily: "NunitoBold",
    color: colors.black,
  },
});
