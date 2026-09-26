/**
 * Astrological birth details of one party, as returned by
 * match_astro_details. Fields are rendered from whatever the API provided
 * (see ASTRO_DETAIL_FIELDS), so a partial response never breaks the report.
 */

import React from 'react';
import {StyleSheet, View} from 'react-native';

import {Card} from '../../../components/Card';
import {Text} from '../../../components/Text';
import {useTheme} from '../../../theme';
import type {AstroDetailItem} from '../utils/matchMaking';

export interface MatchAstroDetailsCardProps {
  title: string;
  items: AstroDetailItem[];
}

const MatchAstroDetailsCard: React.FC<MatchAstroDetailsCardProps> = ({
  title,
  items,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <Card variant="elevated" style={styles.card}>
      <Text variant="body" weight="bold" style={{color: colors.text.primary}}>
        {title}
      </Text>

      {items.length === 0 ? (
        <Text
          variant="bodySmall"
          style={{
            color: colors.text.tertiary,
            textAlign: 'center',
            marginTop: 12,
          }}>
          No astrological details available.
        </Text>
      ) : (
        <View style={styles.list}>
          {items.map(item => (
            <View
              key={item.label}
              style={[
                styles.row,
                {
                  borderTopWidth: StyleSheet.hairlineWidth,
                  borderTopColor: colors.divider,
                },
              ]}>
              <Text
                variant="bodySmall"
                style={{color: colors.text.tertiary,}}>
                {item.label}
              </Text>
              <Text
                variant="bodySmall"
                weight="semibold"
                align="right"
                style={{color: colors.text.primary, flex: 1, marginLeft: 12}}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>
      )}
    </Card>
  );
};

export default React.memo(MatchAstroDetailsCard);

const styles = StyleSheet.create({
  card: {
    marginBottom: 14,
  },
  list: {
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
  },
});
