import React from 'react';
import {StyleSheet, View} from 'react-native';

import {Card} from '../../../components/Card';
import {Text} from '../../../components/Text';
import {useTheme} from '../../../theme';

export interface PredictionCardProps {
  /** Card title (e.g. "❤️ Personal Life"). */
  title: string;
  /** Prediction description text. Falls back to "-" when missing. */
  description?: string;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({
  title,
  description,
}) => {
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
      <View style={styles.titleRow}>
        <Text
          variant="bodyMedium"
          weight="semibold"
          style={{color: colors.text.primary}}>
          {title}
        </Text>
      </View>

      <Text
        variant="bodySmall"
        style={{color: colors.text.secondary, marginTop: 8, lineHeight: 22}}>
        {description ?? '-'}
      </Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    width: '100%',
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

export default PredictionCard;
