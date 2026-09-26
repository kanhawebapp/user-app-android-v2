/**
 * One Koota (Gun) of the Ashtakoot Milan score sheet: name, the male and
 * female attributes, the received / total points and the API description.
 * All values come from match_ashtakoot_points.
 */

import React from 'react';
import {StyleSheet, View} from 'react-native';

import {Card} from '../../../components/Card';
import {Text} from '../../../components/Text';
import {useTheme} from '../../../theme';
import type {KootaView} from '../utils/matchMaking';

export interface KootaCardProps {
  koota: KootaView;
}

const KootaCard: React.FC<KootaCardProps> = ({koota}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const hasPoints = koota.receivedPoints !== null || koota.totalPoints !== null;

  return (
    <Card variant="elevated" style={styles.card}>
      <View style={styles.header}>
        <Text
          variant="body"
          weight="bold"
          style={{color: colors.text.primary, flex: 1}}>
          {koota.label}
        </Text>
        {hasPoints ? (
          <View
            style={[
              styles.pointsBadge,
              {backgroundColor: colors.primary.main},
            ]}>
            <Text
              variant="captionSmall"
              weight="bold"
              style={{color: colors.primary.contrastText}}>
              {koota.receivedPoints ?? 0} / {koota.totalPoints ?? 0}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.attributeRow}>
        <View style={styles.attributeColumn}>
          <Text
            variant="captionSmall"
            weight="semibold"
            style={{color: colors.text.tertiary}}>
            Male
          </Text>
          <Text
            variant="bodySmall"
            weight="semibold"
            style={{color: colors.text.primary, marginTop: 2}}>
            {koota.maleValue ?? '—'}
          </Text>
        </View>

        <View style={[styles.divider, {backgroundColor: colors.divider}]} />

        <View style={styles.attributeColumn}>
          <Text
            variant="captionSmall"
            weight="semibold"
            style={{color: colors.text.tertiary}}>
            Female
          </Text>
          <Text
            variant="bodySmall"
            weight="semibold"
            style={{color: colors.text.primary, marginTop: 2}}>
            {koota.femaleValue ?? '—'}
          </Text>
        </View>
      </View>

      <View style={styles.pointsRow}>
        <Text variant="bodySmall" style={{color: colors.text.secondary}}>
          Received Points:{' '}
          <Text
            variant="bodySmall"
            weight="bold"
            style={{color: colors.text.primary}}>
            {koota.receivedPoints ?? '—'}
          </Text>
        </Text>
        <Text variant="bodySmall" style={{color: colors.text.secondary}}>
          Total Points:{' '}
          <Text
            variant="bodySmall"
            weight="bold"
            style={{color: colors.text.primary}}>
            {koota.totalPoints ?? '—'}
          </Text>
        </Text>
      </View>

      {koota.description ? (
        <View
          style={[
            styles.description,
            {backgroundColor: colors.background.secondary},
          ]}>
          <Text variant="bodySmall" style={{color: colors.text.secondary}}>
            {koota.description}
          </Text>
        </View>
      ) : null}
    </Card>
  );
};

export default React.memo(KootaCard);

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  pointsBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  attributeRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  attributeColumn: {
    flex: 1,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    marginHorizontal: 12,
  },
  pointsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  description: {
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
});
