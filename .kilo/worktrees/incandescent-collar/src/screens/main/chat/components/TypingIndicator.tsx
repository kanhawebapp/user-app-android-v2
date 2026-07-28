import React from 'react';
import {View, Text, Image, StyleSheet, Animated} from 'react-native';
import {useTheme} from '../../../../theme';
import {Icon} from '../../../../components/Icon';

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

  return (
    <View
      style={[
        styles.typingContainer,
        {backgroundColor: colors.background.secondary},
      ]}>
      <View style={styles.typingContent}>
        <View style={styles.avatarContainer}>
          {astrologerImage ? (
            <Image source={{uri: astrologerImage}} style={styles.avatar} />
          ) : (
            <View
              style={[
                styles.avatarPlaceholder,
                {backgroundColor: colors.primary.light},
              ]}>
              <Text
                style={[styles.avatarInitial, {color: colors.primary.main}]}>
                {astrologerName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        <View
          style={[
            styles.typingBubble,
            {backgroundColor: colors.background.tertiary},
          ]}>
          <View style={styles.typingDots}>
            <Animated.View
              style={[
                styles.typingDot,
                {
                  backgroundColor: colors.text.tertiary,
                  transform: [{scale: pulseAnim}],
                },
              ]}
            />
            <View
              style={[
                styles.typingDot,
                {backgroundColor: colors.text.tertiary},
              ]}
            />
            <View
              style={[
                styles.typingDot,
                {backgroundColor: colors.text.tertiary},
              ]}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  typingContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  typingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 8,
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
    fontWeight: '600',
  },
  typingBubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginLeft: 8,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 2,
  },
});
