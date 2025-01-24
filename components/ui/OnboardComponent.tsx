import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

import { colors } from "@/constants";
import { useIsFirst } from "@/lib/zustand/useIsFirst";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import Animated, {
  FlipInEasyX,
  FlipOutEasyX,
  LinearTransition,
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from "react-native-reanimated";

const data = [
  {
    text: "Shaping Bright Future with Quality Education",
    subText:
      "Here, we foster intellectual growth through rigorous academics, groundbreaking research, and a legacy of excellence that spans generations",
    image: require("@/assets/images/Learning.png"),
  },
  {
    text: "Your Gate way to Knowledge and Discovery",
    subText:
      "Where scholarly tradition meets contemporary innovation - cultivating minds through world-class research facilities, distinguished faculty, and an unwavering commitment to academic excellence",
    image: require("@/assets/images/SEDTT.png"),
  },
  {
    text: "Innovative & Interactive Learning Environment",
    subText:
      "Fostering groundbreaking discoveries through our prestigious research facilities, internationally recognized faculty, and a legacy of academic distinction that spans decades",
    image: require("@/assets/images/student.jpg"),
  },
];
export const OnboardComponent = () => {
  const [active, setActive] = useState(0);
  const { setIsFirstToFalse } = useIsFirst();
  const router = useRouter();
  const dataToShow = data[active];
  const onSkip = () => {
    setIsFirstToFalse();
    router.replace("/login");
  };
  const onNext = () => {
    if (active === 2) {
      setIsFirstToFalse();
      router.replace("/login");
    } else {
      setActive((prev) => prev + 1);
    }
  };

  const isLast = active === 2;
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Animated.Image
        source={dataToShow.image}
        style={styles.img}
        entering={FlipInEasyX}
        exiting={FlipOutEasyX}
        key={active + 1}
        // entering={ZoomIn.damping(80).stiffness(200).duration(1000)}
        // exiting={ZoomOut}
      />
      <View style={styles.textContainer}>
        <Indicators currentIndex={active} onSkip={onSkip} />
        <Animated.Text style={styles.text}>{dataToShow.text}</Animated.Text>
        <Animated.Text style={[styles.text, styles.subText]}>
          {dataToShow.subText}
        </Animated.Text>
        <Pressable
          onPress={onNext}
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.5 : 1,
              height: 50,
              borderRadius: 5,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: colors.lightblue,
              marginBottom: 30,
              marginTop: "auto",
            },
          ]}
        >
          {isLast ? (
            <Animated.Text
              key="continue"
              style={[
                {
                  color: colors.white,
                  fontSize: RFPercentage(2),
                  fontFamily: "NunitoBold",
                },
              ]}
            >
              Continue
            </Animated.Text>
          ) : (
            <Animated.Text
              key="finish"
              style={[
                {
                  color: colors.white,
                  fontSize: RFPercentage(2),
                  fontFamily: "NunitoBold",
                },
              ]}
            >
              Next
            </Animated.Text>
          )}
        </Pressable>
      </View>
    </View>
  );
};

const Indicators = ({
  currentIndex,
  onSkip,
}: {
  currentIndex: number;
  onSkip: () => void;
}) => {
  return (
    <View style={styles.indicatorContainer}>
      <View style={styles.indicatorView}>
        {[...Array(3).keys()].map((_, i) => {
          const isCurrent = currentIndex === i;
          return <Dot key={i} isCurrent={isCurrent} />;
        })}
      </View>
      <TouchableOpacity onPress={onSkip}>
        <Text style={{ color: colors.lightblue, fontFamily: "NunitoBold" }}>
          Skip
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const Dot = ({ isCurrent }: { isCurrent: boolean }) => {
  return (
    <Animated.View
      layout={LinearTransition.springify().damping(80).stiffness(200)}
      style={[
        styles.indicator,
        {
          backgroundColor: isCurrent ? colors.lightblue : "lightgray",
          width: isCurrent ? 20 : 10,
        },
      ]}
    />
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  img: {
    flex: 0.55,
    width: "100%",
    resizeMode: "cover",
  },
  textContainer: {
    backgroundColor: colors.white,
    paddingTop: 10,
    paddingHorizontal: 20,
    flex: 0.45,
  },
  text: {
    color: colors.black,
    fontSize: RFPercentage(3),
    fontFamily: "NunitoBold",
    marginBottom: 10,
    textAlign: "center",
  },
  subText: {
    fontSize: RFPercentage(2),
    fontFamily: "NunitoRegular",
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  indicator: {
    width: 10,
    height: 6,
    borderRadius: 8,
    backgroundColor: "lightgray",
  },
  indicatorView: {
    flexDirection: "row",
    gap: 10,
  },
});
