import Animated, { FadeOut } from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import { useWindowDimensions } from 'react-native';

type Props = {
  setEndAnimation: () => void;
};

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);
export const AnimatedSplashScreen = ({ setEndAnimation }: Props) => {
  const { height, width } = useWindowDimensions();
  return (
    <AnimatedLottieView
      exiting={FadeOut}
      style={{ height, width }}
      source={require('@/assets/images/new.json')}
      onAnimationFinish={(isCancelled) => {
        if (!isCancelled) {
          setEndAnimation();
        }
      }}
      loop={false}
      autoPlay={false}
    />
  );
};
