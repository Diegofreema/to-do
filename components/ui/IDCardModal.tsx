import { useStoreId } from "@/lib/zustand/useStoreId";
import { StyleSheet, View } from "react-native";
import { FlexText } from "./FlexText";
import { Image } from "expo-image";
import { Title } from "../typography/Title";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Avatar } from "./Avatar";
import { colors } from "@/constants";
import { Barcode } from "./Barcode";
import { useAuth } from "@/lib/zustand/useAuth";

export const IDModal = () => {
  const details = useStoreId((state) => state.details);
  const data = useAuth((state) => state.user);
  console.log({ details, data });
  const fullName = `${data.fname} ${data.lname}`;
  return (
    <View style={styles.modal}>
      <View style={styles.top}>
        <Image
          contentFit="contain"
          source={require("@/assets/images/logo.png")}
          style={{ width: 200, height: 60 }}
        />
        <Title
          text="Federal Polytechnic Nekede"
          textStyle={{ color: "black", fontSize: RFPercentage(2.5) }}
        />
        <View style={styles.avatar}>
          <Avatar size={100} />
        </View>
      </View>
      <View
        style={{
          marginTop: 15,
          gap: 10,
          paddingHorizontal: 20,
          paddingBottom: 20,
        }}
      >
        <FlexText color="white" text="Full name" text2={fullName} />
        <FlexText
          color="white"
          text="Matric Number"
          text2={data?.matricnumber}
        />
        <FlexText color="white" text="Department" text2={data.Department} />
        <FlexText color="white" text="Program" text2={data?.programtype} />
        {/*<FlexText color="white" text="Expiring Date" text2={details.exp} />*/}
        <FlexText
          color="white"
          text="Matric Number"
          text2={data.matricnumber}
        />
        <FlexText color="white" text="Faculty" text2={data.Faculty} />
      </View>
      <Barcode />
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    marginHorizontal: 5,
    backgroundColor: colors.lightblue,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 500,
    overflow: "hidden",
    paddingBottom: 20,
  },

  avatar: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: "white",
    marginVertical: 20,
    borderRadius: 100,
    padding: 15,
    marginBottom: -50,
  },
  top: {
    alignItems: "center",
    backgroundColor: "white",
    width: "100%",
    paddingTop: 20,
    borderBottomRightRadius: 100,
  },
});
