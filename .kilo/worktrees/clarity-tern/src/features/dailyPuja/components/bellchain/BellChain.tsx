import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, Animated, Easing, Image } from 'react-native';
import Icon from '../../../../components/Icon/Icon';
import { playEffect } from '../../utils/SoundService';
import { bellchainStyle } from './style';

const bellImage = require('../../assets/images/bell.png');
const bell2Image = require('../../assets/images/bell2.png');

function Bell({
  position,
  index,
  onRing,
  image,
}: {
  position: 'left' | 'right';
  index: number;
  onRing: () => void;
  image?: any;
}) {
  const swingAnim = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const styles = bellchainStyle;

  const ringBell = () => {
    // Stop any previous animation
    animationRef.current?.stop();

    // Reset safely (no jhatka because animation stopped)
    swingAnim.setValue(0);

    // Natural decreasing swing effect
    animationRef.current = Animated.sequence([
      Animated.timing(swingAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }),
      Animated.timing(swingAnim, {
        toValue: -0.8,
        duration: 600,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }),
      Animated.timing(swingAnim, {
        toValue: 0.6,
        duration: 600,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }),
      Animated.timing(swingAnim, {
        toValue: -0.4,
        duration: 600,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }),
      Animated.timing(swingAnim, {
        toValue: 0.2,
        duration: 600,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }),
      Animated.timing(swingAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]);

    animationRef.current.start();
    onRing();
  };

  const rotate = swingAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-20deg', '20deg'],
  });

  return (
    <View style={styles.hangingContainer}>
      <View style={styles.chainLine} />

      <TouchableOpacity onPress={ringBell} activeOpacity={0.8}>
        <Animated.View
          style={[
            styles.bellWrapper,
            {
              transform: [{ translateY: -60 }, { rotate }, { translateY: 60 }],
            },
          ]}
        >
          {image ? (
            <Image
              source={image}
              style={[
                styles.bellImage,
                position === 'right' && styles.rightBellTilt,
              ]}
              resizeMode="contain"
            />
          ) : (
            <Icon name="bell" size={50} color="#FFD700" library="FontAwesome" />
          )}
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}
export default function BellChain() {
  const playBellSound = () => {
    playEffect('bell');
  };
  const styles = bellchainStyle;

  return (
    <View style={styles.container}>
      <View style={styles.leftChain}>
        {/* <Bell
          position="left"
          index={0}
          onRing={playBellSound}
          image={bellImage}
        /> */}
        <Bell
          position="left"
          index={1}
          onRing={playBellSound}
          image={bell2Image}
        />
      </View>

      <View style={styles.rightChain}>
        <Bell
          position="right"
          index={2}
          onRing={playBellSound}
          image={bell2Image}
        />
        {/* <Bell
          position="right"
          index={3}
          onRing={playBellSound}
          image={bellImage}
        /> */}
      </View>
    </View>
  );
}
