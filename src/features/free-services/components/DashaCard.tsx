import React from 'react';
import {StyleSheet, View} from 'react-native';

import {Card} from '../../../components/Card/Card';
import {Icon} from '../../../components/Icon';
import {Text} from '../../../components/Text';
import {useTheme} from '../../../theme';
import type {MajorDashaPeriod} from '../../../services/api/astrologyApi/astrology.types';
import {
  formatDashaDateTime,
  formatDashaDuration,
  getPlanetAbbreviation,
  getPlanetColor,
  toDisplayValue,
} from '../utils/kundliService';

export interface DashaCardProps {
  period: MajorDashaPeriod;
}

/**
 * A single Maha Vimshottari dasha period rendered as its own card: a planet
 * emblem and prominent name, then start/end dates and the computed duration.
 */
const DashaCard: React.FC<DashaCardProps> = ({period}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const rows: Array<{icon: string; label: string; value: string}> = [
    {
      icon: 'calendar-today',
      label: 'Start Date',
      value: formatDashaDateTime(period.start),
    },
    {
      icon: 'calendar-today',
      label: 'End Date',
      value: formatDashaDateTime(period.end),
    },
    {
      icon: 'hourglass-bottom',
      label: 'Duration',
      value: formatDashaDuration(period.start, period.end),
    },
  ];

  return (
    <Card variant="elevated">
      <View style={styles.header}>
        <View
          style={[
            styles.avatar,
            {backgroundColor: getPlanetColor(period.planet)},
          ]}>
          <Text variant="bodySmall" weight="bold" style={styles.avatarText}>
            {getPlanetAbbreviation(period.planet)}
          </Text>
        </View>

        <Text
          variant="body"
          weight="bold"
          style={{color: colors.text.primary, flex: 1, marginLeft: 12}}>
          {toDisplayValue(period.planet)} Mahadasha
        </Text>
      </View>

      <View style={styles.rows}>
        {rows.map((row, index) => (
          <View
            key={row.label}
            style={[
              styles.row,
              index > 0 && {
                borderTopWidth: StyleSheet.hairlineWidth,
                borderTopColor: colors.divider,
              },
            ]}>
            <Icon
              name={row.icon}
              size={16}
              color={colors.text.tertiary}
              library="MaterialIcons"
            />
            <Text
              variant="caption"
              style={{color: colors.text.tertiary, width: 84, marginLeft: 8}}>
              {row.label}
            </Text>
            <Text
              variant="caption"
              weight="semibold"
              align="right"
              style={{color: colors.text.primary, flex: 1, marginLeft: 8}}>
              {row.value}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
};

export default DashaCard;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
  },
  rows: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
});
