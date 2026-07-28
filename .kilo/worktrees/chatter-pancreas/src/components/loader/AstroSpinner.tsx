import React, {useEffect, useRef} from 'react';
import {View, Animated, Easing, StyleSheet} from 'react-native';
import Svg, {Line} from 'react-native-svg';
import {colors} from '../../theme';

const AnimatedView = Animated.createAnimatedComponent(View);

const StickCircleLoader = () => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const size = 60;
  const stickCount = 12;
  const center = size / 2;
  const radius = 15;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1400,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const colorss = colors.primary.main;
  const sticks = Array.from({length: stickCount}).map((_, index) => {
    const angle = (360 / stickCount) * index;
    const opacity = (index + 1) / stickCount; // gradient fade effect

    return (
      <Line
        key={index}
        x1={center}
        y1={center - radius}
        x2={center}
        y2={center - radius - 10}
        stroke={colorss}
        strokeWidth="4"
        strokeLinecap="round"
        opacity={opacity}
        transform={`rotate(${angle}, ${center}, ${center})`}
      />
    );
  });

  return (
    <View style={styles.container}>
      <AnimatedView style={{transform: [{rotate: spin}]}}>
        <Svg width={size} height={size}>
          {sticks}
        </Svg>
      </AnimatedView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StickCircleLoader;
