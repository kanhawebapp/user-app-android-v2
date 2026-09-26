import React from 'react';
import {StyleSheet, View} from 'react-native';

import {Card} from '../../../components/Card';
import {Icon} from '../../../components/Icon';
import {Text} from '../../../components/Text';
import {useTheme} from '../../../theme';
import type {AstroDetailItem} from '../utils/matchMaking';

export interface MatchAstroDetailsCardProps {
  title: string;
  items: AstroDetailItem[];
  icon?: string;
}

const MatchAstroDetailsCard: React.FC<MatchAstroDetailsCardProps> = ({
  title,
  items,
  icon,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const fields = items.filter(
    item => item.value && item.value.trim().length > 0,
  );

  if (fields.length === 0) {
    return null;
  }

  return (
    <Card variant="elevated" style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
      

        <Text
          variant="body"
          weight="bold"
          style={[
            styles.title,
            {
              color: colors.text.primary,
            },
          ]}>
          {title}
        </Text>
      </View>

      {/* Details */}
      <View style={styles.list}>
        {fields.map((item, index) => (
          <View
            key={item.label}
            style={[
              styles.row,
              index > 0
                ? {
                    borderTopWidth: StyleSheet.hairlineWidth,
                    borderTopColor: colors.divider,
                  }
                : null,
            ]}>
            {/* Label */}
            <Text
              variant="bodySmall"
              style={[
                styles.label,
                {
                  color: colors.text.secondary,
                },
              ]}>
              {item.label}
            </Text>

            {/* Value */}
            <Text
              variant="bodySmall"
              weight="semibold"
              style={[
                styles.value,
                {
                  color: colors.text.primary,
                },
              ]}>
              {item.value}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
};

export default React.memo(MatchAstroDetailsCard);

const styles = StyleSheet.create({
  card: {
    marginBottom: 14,
  },

  header: {
    position: 'relative',
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconContainer: {
    position: 'absolute',
    left: 0,
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    textAlign: 'center',
  },

  list: {
    marginTop: 16,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50,
    paddingVertical: 13,
  },

  label: {
    width: '50%',
    paddingRight: 20,
  },

  value: {
    width: '50%',
    paddingLeft: 20,
    textAlign: 'right',
  },
});
