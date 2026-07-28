import {Easing} from 'react-native';
import {Animated} from 'react-native';

export const createDotAnimation = (anim: Animated.Value, delay: number) => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        delay,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: 0,
        duration: 300,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]),
  );
};

export const buildScaleInterpolation = (
  anim: Animated.Value,
  inputRange: [number, number],
  outputRange: [number, number],
) => anim.interpolate({inputRange, outputRange});

export const buildFadeInterpolation = (
  anim: Animated.Value,
  inputRange: [number, number],
  outputRange: [number, number],
) => anim.interpolate({inputRange, outputRange});
