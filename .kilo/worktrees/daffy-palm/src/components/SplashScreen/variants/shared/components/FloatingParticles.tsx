import React from 'react';
import {Animated, StyleSheet} from 'react-native';
import {SPLASH_COLORS, PARTICLE_CONFIGS} from '../constants';

interface FloatingParticlesProps {
  particle1Y: Animated.Value;
  particle2Y: Animated.Value;
  particle3Y: Animated.Value;
  particle4Y: Animated.Value;
  particle5Y: Animated.Value;
}

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  particle1Y,
  particle2Y,
  particle3Y,
  particle4Y,
  particle5Y,
}) => {
  const anims = [particle1Y, particle2Y, particle3Y, particle4Y, particle5Y];

  return (
    <>
      {PARTICLE_CONFIGS.map((config, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            {
              left: config.left,
              transform: [{translateY: anims[index]}],
              width: config.size,
              height: config.size,
              borderRadius: config.size / 2,
              opacity: config.opacity,
            },
          ]}
        />
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    backgroundColor: SPLASH_COLORS.gold,
    top: -10,
    shadowColor: SPLASH_COLORS.gold,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
});
