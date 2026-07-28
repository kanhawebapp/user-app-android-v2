import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  Image,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Door images
const doorLeftImage = require('../assets/images/door_left.jpg');
const doorRightImage = require('../assets/images/door_right.jpg');

interface TempleDoorProps {
  isOpen: boolean;
  children?: React.ReactNode;
}

export default function TempleDoor({ isOpen, children }: TempleDoorProps) {
  const leftAnim = useRef(new Animated.Value(0)).current;
  const rightAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(leftAnim, {
        toValue: isOpen ? 1 : 0,
        duration: 3500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(rightAnim, {
        toValue: isOpen ? 1 : 0,
        duration: 3500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [isOpen]);


  const leftRotate = leftAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '100deg'],
  });

  const rightRotate = rightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-100deg'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        isOpen && styles.containerOpen,
      ]}
      pointerEvents={isOpen ? 'none' : 'box-none'}
    >
      {/* Inner Content (Temple / God Image) */}
      <View style={styles.innerContent}>{children}</View>

      {/* Left Door */}
      <Animated.View
        style={[
          styles.door,
          styles.leftDoor,
          {
            transform: [
              { perspective: 1000 },

              // Move pivot to left edge
              { translateX: -width / 4 },

              { rotateY: leftRotate },

              // Move back after rotation
              { translateX: width / 4 },
            ],
          },
        ]}
      >
        <Image source={doorLeftImage} style={styles.image} />
      </Animated.View>

      {/* Right Door */}
      <Animated.View
        style={[
          styles.door,
          styles.rightDoor,
          {
            transform: [
              { perspective: 1000 },

              // Move pivot to right edge
              { translateX: width / 4 },

              { rotateY: rightRotate },

              // Move back after rotation
              { translateX: -width / 4 },
            ],
          },
        ]}
      >
        <Image source={doorRightImage} style={styles.image} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerOpen: {
    // Additional styles when door is open (if needed)
  },

  innerContent: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },

  door: {
    position: 'absolute',
    width: width / 2,
    height: height,
    backfaceVisibility: 'hidden',
  },

  leftDoor: {
    left: 0,
  },

  rightDoor: {
    right: 0,
  },

  image: {
    width: '100%',
    height: '120%',
    resizeMode: 'cover',
  },
});
