import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from '../../../../../theme';
import {Text} from '../../../../../components/Text';
import {Icon} from '../../../../../components/Icon';
import {TrustAuthorityProps, TrustFeature} from '../../types';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {Card} from '../../../../../components';

/** Presentation-only line breaks — does not mutate feature data. */
const getDisplayTitle = (title: string): string => {
  if (title === '10+ Years Experience') {
    return '10+ Years\nExperience';
  }
  if (title === '10L+ Happy Customers') {
    return '10L+ Happy\nCustomers';
  }
  if (title === 'Verified Astrologers') {
    return 'Verified\nAstrologers';
  }
  return title;
};

export const TrustSection: React.FC<TrustAuthorityProps> = ({
  features = [],
  style,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: colors.background.secondary + '40'},
        style,
      ]}>
      <Text variant="h6" weight="semibold" style={styles.title}>
        Why Trust Dhwani Astro?
      </Text>

      <Card style={styles.grid}>
        {features.map(feature => (
          <AnimatedCard key={feature.id} feature={feature} colors={colors} />
        ))}
      </Card>
    </View>
  );
};

const AnimatedCard = ({
  feature,
  colors,
}: {
  feature: TrustFeature;
  colors: ReturnType<typeof useTheme>['colors'];
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.item}
      onPressIn={() => (scale.value = withSpring(0.94))}
      onPressOut={() => (scale.value = withSpring(1))}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <View
          style={[
            styles.iconContainer,
            {backgroundColor: colors.primary.main + '15'},
          ]}>
          <Icon
            name={feature.icon}
            library={(feature.iconLibrary as 'MaterialIcons') || 'MaterialIcons'}
            size={26}
            color={colors.primary.main}
          />
        </View>

        <Text
          variant="label"
          weight="medium"
          numberOfLines={2}
          style={[styles.itemTitle, {color: colors.text.primary}]}>
          {getDisplayTitle(feature.title)}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    marginBottom: 32,
  },

  title: {
    textAlign: 'center',
    marginBottom: 20,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
  },

  item: {
    width: '31%',
    marginBottom: 8,
  },

  card: {
    width: '100%',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  itemTitle: {
    width: '100%',
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    flexShrink: 1,
  },
});
