import React, {useRef, useEffect} from 'react';
import {View, Text, Image, StyleSheet, Animated, Easing} from 'react-native';
import {useTheme} from '../../../../theme';

interface TypingIndicatorProps {
  astrologerName: string;
  astrologerImage?: string;
  pulseAnim: Animated.Value;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  astrologerName,
  astrologerImage,
  pulseAnim,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    const createDotAnimation = (anim: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 300,
            delay,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 300,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      );
    };

    const dot1 = createDotAnimation(dot1Anim, 0);
    const dot2 = createDotAnimation(dot2Anim, 150);
    const dot3 = createDotAnimation(dot3Anim, 300);

    dot1.start();
    dot2.start();
    dot3.start();

    return () => {
      dot1.stop();
      dot2.stop();
      dot3.stop();
    };
  }, []);

  const renderDot = (anim: Animated.Value) => (
    <Animated.View
      style={[
        styles.dot,
        {
          backgroundColor: colors.text.tertiary,
          opacity: anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.3, 1],
          }),
          transform: [
            {
              scale: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1.2],
              }),
            },
          ],
        },
      ]}
    />
  );

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: 'transparent',
          opacity: fadeAnim,
        },
      ]}>
      <View style={styles.avatarContainer}>
        {astrologerImage ? (
          <Image source={{uri: astrologerImage}} style={styles.avatar} />
        ) : (
          <View
            style={[
              styles.avatarPlaceholder,
              {backgroundColor: colors.primary.light},
            ]}>
            <Text style={[styles.avatarInitial, {color: colors.primary.main}]}>
              {astrologerName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      <View
        style={[
          styles.bubble,
          {
            backgroundColor: colors.background.tertiary,
            borderBottomLeftRadius: 6,
          },
        ]}>
        <View style={styles.dotsContainer}>
          {renderDot(dot1Anim)}
          {renderDot(dot2Anim)}
          {renderDot(dot3Anim)}
        </View>
        <Text style={[styles.typingText, {color: colors.text.tertiary}]}>
          typing
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  avatarContainer: {
    marginRight: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 14,
    fontWeight: '700',
  },
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
    borderTopLeftRadius: 4,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  typingText: {
    fontSize: 12,
    fontStyle: 'italic',
    opacity: 0.7,
  },
});
