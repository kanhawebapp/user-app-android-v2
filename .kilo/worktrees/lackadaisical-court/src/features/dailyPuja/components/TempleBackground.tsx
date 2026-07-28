import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {ANIMATION_DURATION} from '../constants/animation.constants';

const {width, height} = Dimensions.get('window');

interface TempleBackgroundProps {
  backgroundImage: any; // Background image source (temple specific)
  lordImage: any; // Lord image source
  animationTrigger?: number; // Trigger value to restart animation when god changes
}

export default function TempleBackground({
  backgroundImage,
  lordImage,
  animationTrigger = 0,
}: TempleBackgroundProps) {
  // Animation values for background
  const backgroundScale = useRef(new Animated.Value(0.5)).current;
  const backgroundOpacity = useRef(new Animated.Value(0)).current;

  // Animation values for lord image
  const lordScale = useRef(new Animated.Value(0.5)).current;
  const lordOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Reset animations to starting values
    backgroundScale.setValue(0.5);
    backgroundOpacity.setValue(0);
    lordScale.setValue(0.5);
    lordOpacity.setValue(0);

    // Start background animation (slightly delayed for layered effect)
    const backgroundAnimation = Animated.parallel([
      Animated.timing(backgroundScale, {
        toValue: 1,
        duration: ANIMATION_DURATION.BACKGROUND_ZOOM_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(backgroundOpacity, {
        toValue: 1,
        duration: ANIMATION_DURATION.BACKGROUND_FADE_DURATION,
        useNativeDriver: true,
      }),
    ]);

    // Start lord image animation (slightly delayed for depth effect)
    const lordAnimation = Animated.parallel([
      Animated.timing(lordScale, {
        toValue: 1,
        duration: ANIMATION_DURATION.LORD_ZOOM_DURATION,
        delay: ANIMATION_DURATION.LORD_ANIMATION_DELAY, // Slight delay for layered zoom effect
        useNativeDriver: true,
      }),
      Animated.timing(lordOpacity, {
        toValue: 1,
        duration: ANIMATION_DURATION.LORD_FADE_DURATION,
        delay: ANIMATION_DURATION.LORD_ANIMATION_DELAY,
        useNativeDriver: true,
      }),
    ]);

    // Run both animations
    Animated.sequence([backgroundAnimation, lordAnimation]).start();
  }, [
    backgroundImage,
    lordImage,
    animationTrigger,
    backgroundScale,
    backgroundOpacity,
    lordScale,
    lordOpacity,
  ]);

  return (
    <Animated.View
      style={[
        styles.container,
        // {
        //   transform: [{ scale: backgroundScale }],
        //   opacity: backgroundOpacity,
        // },
      ]}>
      {/* Temple Background Image */}
      <ImageBackground
        source={backgroundImage}
        style={styles.background}
        resizeMode="cover">
        {/* <Image
          source={lordImage}
          style={styles.lordImage}
          resizeMode="contain"
        /> */}
      </ImageBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lordContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lordImage: {
    width: width * 0.5,
    height: height * 0.6,
    position: 'absolute',
  },
});
