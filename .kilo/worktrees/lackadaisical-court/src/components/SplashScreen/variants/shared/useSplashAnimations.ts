import {useEffect, useRef} from 'react';
import {Animated, Easing, Dimensions} from 'react-native';

const {height} = Dimensions.get('window');

export interface SplashAnimations {
  fadeAnim: Animated.Value;
  logoScale: Animated.Value;
  logoOpacity: Animated.Value;
  glowAnim: Animated.Value;
  textAnim: Animated.Value;
  textSlide: Animated.Value;
  omSymbolAnim: Animated.Value;
  omSymbolRotate: Animated.Value;
  omStartPos: Animated.Value;
  starBlink1: Animated.Value;
  starBlink2: Animated.Value;
  starBlink3: Animated.Value;
  starBlink4: Animated.Value;
  particle1Y: Animated.Value;
  particle2Y: Animated.Value;
  particle3Y: Animated.Value;
  particle4Y: Animated.Value;
  particle5Y: Animated.Value;
  flameAnim1: Animated.Value;
  flameAnim2: Animated.Value;
}

export interface SplashAnimationsOptions {
  timeout: number;
  onComplete: () => void;
}

export const useSplashAnimations = ({
  timeout,
  onComplete,
}: SplashAnimationsOptions): SplashAnimations => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;
  const textAnim = useRef(new Animated.Value(0)).current;
  const textSlide = useRef(new Animated.Value(50)).current;
  const omSymbolAnim = useRef(new Animated.Value(0)).current;
  const omSymbolRotate = useRef(new Animated.Value(0)).current;
  const omStartPos = useRef(new Animated.Value(0)).current;
  const starBlink1 = useRef(new Animated.Value(0.2)).current;
  const starBlink2 = useRef(new Animated.Value(0.2)).current;
  const starBlink3 = useRef(new Animated.Value(0.2)).current;
  const starBlink4 = useRef(new Animated.Value(0.2)).current;
  const particle1Y = useRef(new Animated.Value(0)).current;
  const particle2Y = useRef(new Animated.Value(0)).current;
  const particle3Y = useRef(new Animated.Value(0)).current;
  const particle4Y = useRef(new Animated.Value(0)).current;
  const particle5Y = useRef(new Animated.Value(0)).current;
  const flameAnim1 = useRef(new Animated.Value(1)).current;
  const flameAnim2 = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        tension: 35,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.4,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.parallel([
      Animated.timing(textAnim, {
        toValue: 1,
        duration: 800,
        delay: 1400,
        useNativeDriver: true,
      }),
      Animated.timing(textSlide, {
        toValue: 0,
        duration: 800,
        delay: 1400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.sequence([
      Animated.timing(omSymbolAnim, {
        toValue: 1,
        duration: 600,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.timing(omStartPos, {
        toValue: 1,
        duration: 1200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(omSymbolRotate, {
          toValue: 1,
          duration: 8000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(omSymbolRotate, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Star blinking
    Animated.loop(
      Animated.sequence([
        Animated.timing(starBlink1, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(starBlink1, {
          toValue: 0.2,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(starBlink2, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(starBlink2, {
          toValue: 0.2,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(starBlink3, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(starBlink3, {
          toValue: 0.2,
          duration: 1800,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(starBlink4, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(starBlink4, {
          toValue: 0.2,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Particles
    const animateParticle = (
      anim: Animated.Value,
      delay: number,
      duration: number,
    ) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: -150,
            duration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: height + 100,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };

    animateParticle(particle1Y, 0, 5000);
    animateParticle(particle2Y, 1200, 6000);
    animateParticle(particle3Y, 2400, 4500);
    animateParticle(particle4Y, 3600, 5500);
    animateParticle(particle5Y, 1800, 4800);

    // Diya flame
    Animated.loop(
      Animated.sequence([
        Animated.timing(flameAnim1, {
          toValue: 0.8,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(flameAnim1, {
          toValue: 1.2,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(flameAnim2, {
          toValue: 0.9,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(flameAnim2, {
          toValue: 1.1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    const timer = setTimeout(onComplete, timeout);
    return () => clearTimeout(timer);
  }, [timeout, onComplete]);

  return {
    fadeAnim,
    logoScale,
    logoOpacity,
    glowAnim,
    textAnim,
    textSlide,
    omSymbolAnim,
    omSymbolRotate,
    omStartPos,
    starBlink1,
    starBlink2,
    starBlink3,
    starBlink4,
    particle1Y,
    particle2Y,
    particle3Y,
    particle4Y,
    particle5Y,
    flameAnim1,
    flameAnim2,
  };
};
