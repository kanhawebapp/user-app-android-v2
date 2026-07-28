import React from 'react';
import {View, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import {useTheme} from '../../../../../theme';
import {Text} from '../../../../../components/Text';
import {Icon} from '../../../../../components/Icon';
import {TrustAuthorityProps} from '../../types';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {Card} from '../../../../../components';


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

// 🔥 Separate Animated Card Component (clean code)
const AnimatedCard = ({feature, colors}: any) => {
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
        {/* ICON */}
        <View
          style={[
            styles.iconContainer,
            {backgroundColor: colors.primary.main + '15'},
          ]}>
          <Icon
            name={feature.icon}
            library={feature.iconLibrary as any}
            size={26}
            color={colors.primary.main}
          />
        </View>

        {/* TITLE */}
        <Text
          variant="label"
          weight="medium"
          style={[styles.itemTitle, {color: colors.text.primary}]}>
          {feature.title}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 32,
  },

  title: {
    textAlign: 'center',
    marginBottom: 20,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },

  item: {
    width: '30%',
    marginBottom: 16,
  },

  card: {
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 10,

    alignItems: 'center',
    justifyContent: 'center',

    // backgroundColor: '#fff',

    // // ✨ premium shadow
    // shadowColor: '#000',
    // shadowOpacity: 0.08,
    // shadowRadius: 14,
    // shadowOffset: {width: 0, height: 6},
    // elevation: 0.3,

    // // subtle border
    // borderWidth: 0.2,
    // borderColor: 'rgba(0,0,0,0.04)',
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
    textAlign: 'center',
    fontSize: 13,
  },
});
