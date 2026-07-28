import React from 'react';
import {Animated, StyleSheet} from 'react-native';
import {SPLASH_COLORS, STAR_POSITIONS} from '../constants';

interface TwinklingStarsProps {
  starBlink1: Animated.Value;
  starBlink2: Animated.Value;
  starBlink3: Animated.Value;
  starBlink4: Animated.Value;
}

export const TwinklingStars: React.FC<TwinklingStarsProps> = ({
  starBlink1,
  starBlink2,
  starBlink3,
  starBlink4,
}) => {
  const blinkAnims = [starBlink1, starBlink2, starBlink3, starBlink4];

  return (
    <>
      {STAR_POSITIONS.map((pos, index) => (
        <Animated.View
          key={index}
          style={[
            styles.star,
            {
              top: pos.top,
              left: pos.left,
              width: pos.size,
              height: pos.size,
              borderRadius: pos.size / 2,
              opacity: blinkAnims[index % 4],
            },
          ]}
        />
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  star: {
    position: 'absolute',
    backgroundColor: SPLASH_COLORS.white,
  },
});
