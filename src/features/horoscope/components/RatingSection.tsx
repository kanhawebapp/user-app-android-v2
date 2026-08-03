import React from 'react';
import {StyleSheet, View} from 'react-native';

import {Card} from '../../../components/Card';
import {Text} from '../../../components/Text';
import {useTheme} from '../../../theme';
import type {HoroscopeSection} from '../utils/horoscopeResponse';
import {RatingItem} from './RatingItem';

export interface RatingSectionProps {
  sections: HoroscopeSection[];
}

export const RatingSection: React.FC<RatingSectionProps> = ({sections}) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <Card
      variant="elevated"
      style={[
        styles.card,
        {
          backgroundColor: colors.card.background,
          borderColor: colors.card.border,
        },
      ]}>
      <Text
        variant="bodyMedium"
        weight="semibold"
        style={{color: colors.text.primary, marginBottom: 4}}>
        Ratings
      </Text>
      <View style={styles.list}>
        {sections.map(section => (
          <RatingItem
            key={section.key}
            emoji={section.emoji}
            label={section.label}
            value={section.rating}
          />
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    width: '100%',
    padding: 16,
  },
  list: {
    marginTop: 8,
  },
});

export default RatingSection;
