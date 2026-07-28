import {useEffect, useRef} from 'react';
import {Animated, Easing} from 'react-native';

export interface WaveAnimations {
  waveScale: Animated.Value;
  waveOpacity: Animated.Value;
  waveScale2: Animated.Value;
  waveOpacity2: Animated.Value;
  waveScale3: Animated.Value;
  waveOpacity3: Animated.Value;
}

export const useWaveAnimations = (): WaveAnimations => {
  const waveScale = useRef(new Animated.Value(0)).current;
  const waveOpacity = useRef(new Animated.Value(0)).current;
  const waveScale2 = useRef(new Animated.Value(0)).current;
  const waveOpacity2 = useRef(new Animated.Value(0)).current;
  const waveScale3 = useRef(new Animated.Value(0)).current;
  const waveOpacity3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(800),
      Animated.parallel([
        Animated.timing(waveScale, {
          toValue: 1.5,
          duration: 1500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(waveOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.delay(800),
          Animated.timing(waveOpacity, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();

    Animated.sequence([
      Animated.delay(1300),
      Animated.parallel([
        Animated.timing(waveScale2, {
          toValue: 1.8,
          duration: 1500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(waveOpacity2, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.delay(800),
          Animated.timing(waveOpacity2, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();

    Animated.sequence([
      Animated.delay(1800),
      Animated.parallel([
        Animated.timing(waveScale3, {
          toValue: 2,
          duration: 1500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(waveOpacity3, {
            toValue: 0.7,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.delay(800),
          Animated.timing(waveOpacity3, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  }, []);

  return {
    waveScale,
    waveOpacity,
    waveScale2,
    waveOpacity2,
    waveScale3,
    waveOpacity3,
  };
};
