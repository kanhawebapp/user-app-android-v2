import React from 'react';
import {View, Text, Animated, StyleSheet} from 'react-native';
import {CustomImage} from '../../../../Image';
import {SPLASH_COLORS} from '../constants';

interface BenefitItem {
  icon: any;
  label: string;
}

interface BenefitCardProps {
  textAnim: Animated.Value;
  textSlide: Animated.Value;
  benefits: BenefitItem[];
  iconTintColor?: string;
}

export const BenefitCard: React.FC<BenefitCardProps> = ({
  textAnim,
  textSlide,
  benefits,
  iconTintColor,
}) => (
  <Animated.View
    style={[
      styles.cardContainer,
      {
        opacity: textAnim,
        transform: [{translateY: textSlide}],
      },
    ]}>
    <View style={styles.card}>
      {benefits.map((benefit, index) => (
        <View key={index} style={styles.benefitItem}>
          <View style={styles.iconWrapper}>
            <CustomImage
              source={benefit.icon}
              width={24}
              height={24}
              resizeMode="contain"
              showLoading={false}
              tintColor={iconTintColor}
            />
          </View>
          <Text style={styles.benefitText}>{benefit.label}</Text>
        </View>
      ))}
    </View>
  </Animated.View>
);

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    marginBottom: 30,
  },
  card: {
    width: '100%',
    borderRadius: 24,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    shadowColor: SPLASH_COLORS.gold,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  benefitText: {
    color: '#FFFFFF',
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 15,
    flex: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },
});
