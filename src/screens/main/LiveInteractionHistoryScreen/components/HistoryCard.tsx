import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from '../../../../theme';
import {Text} from '../../../../components/Text';
import {Icon} from '../../../../components/Icon';
import type {LiveInteractionHistoryItem} from '../../../../services/api/liveInteractions';
import {
  formatBillableMinutes,
  formatCoins,
  formatDurationMmSs,
  formatRatePerMin,
  getInteractionTypeIcon,
  getInteractionTypeLabel,
  getStatusColors,
  getStatusLabel,
  pickDisplayTimestamp,
} from '../utils';

interface HistoryCardProps {
  item: LiveInteractionHistoryItem;
}

export const HistoryCard: React.FC<HistoryCardProps> = ({item}) => {
  const {colors, isDark} = useTheme();
  const statusColors = getStatusColors(item.status);
  const displayDate = pickDisplayTimestamp(item);

  return (
    <View style={styles.outer}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.background.primary,
            borderColor: isDark ? colors.border.dark : colors.border.light,
          },
        ]}>
        <View style={styles.topRow}>
          <View style={styles.astrologerInfo}>
            <View
              style={[
                styles.avatar,
                {backgroundColor: colors.primary.light + '30'},
              ]}>
              <Icon
                name={getInteractionTypeIcon(item.interactionType)}
                size={22}
                color={colors.primary.main}
                library="MaterialIcons"
              />
            </View>
            <View style={styles.nameInfo}>
              <Text
                variant="body"
                weight="semibold"
                numberOfLines={1}
                style={{color: colors.text.primary}}>
                {item.astrologerName?.trim() || 'Astrologer'}
              </Text>
              <Text
                variant="captionSmall"
                style={{color: colors.text.secondary, marginTop: 2}}>
                {getInteractionTypeLabel(item.interactionType)}
              </Text>
              <Text
                variant="captionSmall"
                style={{color: colors.text.secondary, marginTop: 4}}>
                {displayDate}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.statusBadge,
              {backgroundColor: colors.background.secondary},
            ]}>
            <View
              style={[styles.statusDot, {backgroundColor: statusColors.dot}]}
            />
            <Text
              variant="captionSmall"
              weight="medium"
              style={{color: statusColors.text}}>
              {getStatusLabel(item.status)}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.statsRow,
            {
              borderTopColor: isDark
                ? colors.border.dark
                : colors.border.light,
            },
          ]}>
          <StatCell
            icon="schedule"
            label="Duration"
            value={formatDurationMmSs(item.durationSeconds)}
          />
          {/* <StatCell
            icon="timer"
            label="Billable"
            value={formatBillableMinutes(item.billableMinutes)}
          /> */}
          <StatCell
            icon="speed"
            label="Rate"
            value={formatRatePerMin(item.ratePerMin)}
          />
          <StatCell
            icon="monetization-on"
            label="Coins"
            value={formatCoins(item.chargedCoins)}
          />
        </View>
      </View>
    </View>
  );
};

interface StatCellProps {
  icon: string;
  label: string;
  value: string;
}

const StatCell: React.FC<StatCellProps> = ({icon, label, value}) => {
  const {colors} = useTheme();
  return (
    <View style={styles.statBox}>
      <Icon
        name={icon}
        size={16}
        color={colors.primary.main}
        library="MaterialIcons"
      />
      <Text
        variant="captionSmall"
        style={{color: colors.text.secondary, marginTop: 4}}>
        {label}
      </Text>
      <Text
        variant="caption"
        weight="semibold"
        style={{color: colors.text.primary, marginTop: 2}}>
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  card: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  astrologerInfo: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 8,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameInfo: {
    flex: 1,
    marginLeft: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
});

export default HistoryCard;
