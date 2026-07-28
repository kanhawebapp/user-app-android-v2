import { useRef } from 'react';
import { Animated, Easing } from 'react-native';

const rotateAnim = useRef(new Animated.Value(0)).current;
const flameOpacity = useRef(new Animated.Value(1)).current;
const glowAnim = useRef(new Animated.Value(0.5)).current;
const swayAnim = useRef(new Animated.Value(0)).current;

const animationRef = useRef<any>(null);
const flameAnimRef = useRef<any>(null);
const glowAnimRef = useRef<any>(null);
const swayAnimRef = useRef<any>(null);

export const startFlameAnimation = () => {
  flameAnimRef.current = Animated.loop(
    Animated.sequence([
      Animated.timing(flameOpacity, {
        toValue: 0.7,
        duration: 120,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(flameOpacity, {
        toValue: 1,
        duration: 120,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]),
  );
  flameAnimRef.current.start();

  glowAnimRef.current = Animated.loop(
    Animated.sequence([
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 0.3,
        duration: 800,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]),
  );
  glowAnimRef.current.start();

  swayAnimRef.current = Animated.loop(
    Animated.sequence([
      Animated.timing(swayAnim, {
        toValue: 3,
        duration: 600,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }),
      Animated.timing(swayAnim, {
        toValue: -3,
        duration: 600,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }),
    ]),
  );
  swayAnimRef.current.start();
};
export const stopFlameAnimation = () => {
  flameAnimRef.current?.stop();
  glowAnimRef.current?.stop();
  swayAnimRef.current?.stop();

  flameOpacity.setValue(1);
  glowAnim.setValue(0.5);
  swayAnim.setValue(0);
};

 export const startRotation = () => {
    rotateAnim.setValue(0);

    animationRef.current = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    animationRef.current.start();
  };

 export const stopRotation = () => {
    animationRef.current?.stop();
    rotateAnim.setValue(0);
  };