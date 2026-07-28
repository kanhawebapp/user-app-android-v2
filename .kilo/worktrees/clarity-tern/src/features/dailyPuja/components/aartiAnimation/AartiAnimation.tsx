import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,

  Animated,
  Easing,
} from 'react-native';
import Icon from '../../../../components/Icon/Icon';
import { playAarti, stopAarti } from '../../utils/soundManager';
import { aertiAnimationStyle } from './style';
import { startFlameAnimation, stopFlameAnimation } from './aartiHook';

export default function AartiAnimation() {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const flameOpacity = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.5)).current;
  const swayAnim = useRef(new Animated.Value(0)).current;

  const [isPlaying, setIsPlaying] = useState(false);

  const animationRef = useRef<any>(null);
  const flameAnimRef = useRef<any>(null);
  const glowAnimRef = useRef<any>(null);
  const swayAnimRef = useRef<any>(null);
  const styles = aertiAnimationStyle;

  /* =========================
     🔥 Flame Animation
  ========================== */

  /* =========================
     🔄 Rotation Animation
  ========================== */

  const startRotation = () => {
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

  const stopRotation = () => {
    animationRef.current?.stop();
    rotateAnim.setValue(0);
  };

  /* =========================
     🔊 Sound Control
  ========================== */

  const startAarti = () => {
    setIsPlaying(true);
    startRotation();
    startFlameAnimation();

    playAarti('aarti');
  };

  const stopAartiHandler = () => {
    setIsPlaying(false);
    stopRotation();
    stopFlameAnimation();
    // Stop the aarti using the dedicated player
    stopAarti();
  };

  useEffect(() => {
    return () => {
      // Clean up - stop aarti when component unmounts
      stopAarti();
    };
  }, []);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0.3, 1],
    outputRange: [0.3, 1],
  });

  const glowScale = glowAnim.interpolate({
    inputRange: [0.3, 1],
    outputRange: [1, 1.3],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.glow,
          {
            opacity: glowOpacity,
            transform: [{ scale: glowScale }],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.diyaContainer,
          {
            transform: [
              { rotate: rotateInterpolate },
              { translateX: swayAnim },
            ],
          },
        ]}
      >
        <View style={styles.diyaBase}>
          <Animated.View
            style={[styles.flameContainer, { opacity: flameOpacity }]}
          >
            <View style={styles.flame} />
            <View style={styles.flameInner} />
            <View style={styles.flameCenter} />
          </Animated.View>
        </View>
      </Animated.View>

      <TouchableOpacity
        style={styles.button}
        onPress={isPlaying ? stopAartiHandler : startAarti}
        activeOpacity={0.7}
      >
        <Icon
          name={isPlaying ? 'stop-circle' : 'play-circle'}
          size={50}
          color="#FFD700"
        />
      </TouchableOpacity>
    </View>
  );
}

