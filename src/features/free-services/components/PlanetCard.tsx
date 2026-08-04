import React from 'react';
import {StyleSheet, View} from 'react-native';

import {Card} from '../../../components/Card/Card';
import {Text} from '../../../components/Text';
import {useTheme} from '../../../theme';
import type {PlanetPosition} from '../../../services/api/astrologyApi/astrology.types';
import {
  formatPlanetDegree,
  formatPlanetSpeed,
  getPlanetAbbreviation,
  getPlanetColor,
  toDisplayValue,
} from '../utils/kundliService';

export interface PlanetCardProps {
  planet: PlanetPosition;
}

/** Whether the planet is retrograde regardless of the API's string/boolean shape. */
export const isRetrograde = (planet: PlanetPosition): boolean => {
  const value = planet?.isRetro;
  if (typeof value === 'boolean') {
    return value;
  }
  return String(value ?? '').toLowerCase() === 'true';
};

/**
 * A single planet position rendered as its own elevated card: a coloured
 * planet emblem and retrograde chip in the header, then the standard fields
 * as label/value rows.
 */
const PlanetCard: React.FC<PlanetCardProps> = ({planet}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const retro = isRetrograde(planet);

  const rows: Array<{label: string; value: string}> = [
    {label: 'Sign', value: toDisplayValue(planet.sign)},
    {label: 'Sign Lord', value: toDisplayValue(planet.signLord)},
    {label: 'House', value: toDisplayValue(planet.house)},
    {label: 'Nakshatra', value: toDisplayValue(planet.nakshatra)},
    {label: 'Nakshatra Lord', value: toDisplayValue(planet.nakshatraLord)},
    {label: 'Nakshatra Pad', value: toDisplayValue(planet.nakshatra_pad)},
    {label: 'Degree', value: formatPlanetDegree(planet.normDegree)},
    {label: 'Speed', value: formatPlanetSpeed(planet.speed)},
    {label: 'Retrograde', value: retro ? 'Yes' : 'No'},
    {label: 'Planet Awastha', value: toDisplayValue(planet.planet_awastha)},
    {label: 'Planet Set Status', value: toDisplayValue(planet.is_planet_set)},
  ];

  const retroChip = {
    background: retro ? colors.warning.background : colors.success.background,
    text: retro ? colors.warning.dark : colors.success.dark,
  };

  return (
    <Card variant="elevated">
      <View style={styles.header}>
        <View
          style={[
            styles.avatar,
            {backgroundColor: getPlanetColor(planet.name)},
          ]}>
          <Text variant="bodySmall" weight="bold" style={styles.avatarText}>
            {getPlanetAbbreviation(planet.name)}
          </Text>
        </View>

        <Text
          variant="body"
          weight="bold"
          style={{color: colors.text.primary, flex: 1, marginLeft: 12}}>
          {toDisplayValue(planet.name)}
        </Text>

        <View style={[styles.chip, {backgroundColor: retroChip.background}]}>
          <Text
            variant="captionSmall"
            weight="bold"
            style={{color: retroChip.text}}>
            {retro ? 'Retrograde' : 'Normal'}
          </Text>
        </View>
      </View>

      <View style={styles.grid}>
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
            <Text
              variant="caption"
              style={{color: colors.text.tertiary, flex: 1, marginRight: 8}}>
              {row.label}
            </Text>
            <Text
              variant="caption"
              weight="semibold"
              align="right"
              style={{
                color:
                  row.label === 'Retrograde'
                    ? retroChip.text
                    : colors.text.primary,
                flex: 1,
                marginLeft: 8,
              }}>
              {row.value}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
};

export default PlanetCard;

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
  chip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  grid: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
});
