import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Easing, Image } from 'react-native';

interface FlowerParticle {
  id: number;
  x: number;
  size: number;
  delay: number;
  imageSource: any;
}

const FLOWER_IMAGES = [
  require('../../assets/images/rose.png'),
  require('../../assets/images/marigold.png'),
  require('../../assets/images/lotus.png'),
  require('../../assets/images/jasmine.png'),
  require('../../assets/images/mogra.png'),
];

function generateFlowers(count: number): FlowerParticle[] {
  const flowers: FlowerParticle[] = [];
  for (let i = 0; i < count; i++) {
    flowers.push({
      id: i,
      x: Math.random() * 100, // percentage
      size: 25 + Math.random() * 15,
      delay: Math.random() * 3000,
      imageSource: FLOWER_IMAGES[Math.floor(Math.random() * FLOWER_IMAGES.length)],
    });
  }
  return flowers;
}

function Flower({ particle, isActive }: { particle: FlowerParticle; isActive: boolean }) {
  const translateY = useRef(new Animated.Value(-50)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    if (!isActive) {
      // Reset animations when not active
      translateY.setValue(-50);
      opacity.setValue(1);
      return;
    }

    // Rotation animation
    const rotateAnim = Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 2000 + Math.random() * 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    rotateAnim.start();

    // Fall animation with staggered start
    const fallAnimation = Animated.sequence([
      Animated.delay(particle.delay),
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(translateY, {
              toValue: 850, // Fall to bottom of screen
              duration: 4000 + Math.random() * 3000,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 4000 + Math.random() * 3000,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
          ]),
          // Reset position
          Animated.parallel([
            Animated.timing(translateY, {
              toValue: -50,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 1,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ])
      ),
    ]);

    fallAnimation.start();

    return () => {
      rotateAnim.stop();
      fallAnimation.stop();
    };
  }, [isActive]);

  // Don't render if not active
  if (!isActive || !isMounted) {
    return null;
  }

  const rotateInterpolate = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.flower,
        {
          left: `${particle.x}%`,
          transform: [
            { translateY: translateY },
            { rotate: rotateInterpolate },
            { scale: particle.size / 30 },
          ],
          opacity: opacity,
        },
      ]}
    >
      <Image
        source={particle.imageSource}
        style={styles.flowerImage}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

interface FlowerRainProps {
  isActive?: boolean;
}

export default function FlowerRain({ isActive = false }: FlowerRainProps) {
  const flowers = useRef<FlowerParticle[]>(generateFlowers(25));

  return (
    <View style={styles.container} pointerEvents="none">
      {flowers.current.map((particle) => (
        <Flower key={particle.id} particle={particle} isActive={isActive} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  flower: {
    position: 'absolute',
    top: 0,
    width: 50,
    height: 50,
  },
  flowerImage: {
    width: '100%',
    height: '100%',
  },
});

