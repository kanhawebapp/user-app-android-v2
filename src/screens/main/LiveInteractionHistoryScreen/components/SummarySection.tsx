import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from '../../../../theme';
import {Text} from '../../../../components/Text';
import {Icon} from '../../../../components/Icon';

export interface LiveHistorySummary {
  totalCount: number;
  totalCoinsDeducted: number;
  totalAudioCalls: number;
  totalVideoCalls: number;
}

interface SummarySectionProps {
  summary: LiveHistorySummary;
}

interface StatCardProps {
  icon: string;
  value: string | number;
  label: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({icon, value, label, color}) => {
  const {colors} = useTheme();

  return (
    <View
      style={[
        styles.statCard,
        {backgroundColor: colors.background.primary},
      ]}>
      <View style={[styles.iconWrapper, {backgroundColor: color + '20'}]}>
        <Icon name={icon} size={18} color={color} library="MaterialIcons" />
      </View>
      <Text
        variant="h5"
        weight="bold"
        style={{color: colors.text.primary, marginTop: 8}}>
        {value}
      </Text>
      <Text
        variant="captionSmall"
        style={{
          color: colors.text.secondary,
          marginTop: 4,
          textAlign: 'center',
        }}>
        {label}
      </Text>
    </View>
  );
};

export const SummarySection: React.FC<SummarySectionProps> = ({summary}) => {
  const {colors} = useTheme();

  return (
    <View
      style={[
        styles.section,
        {backgroundColor: colors.background.primary},
      ]}>
      <View style={styles.row}>
        <StatCard
          icon="history"
          value={summary.totalCount}
          label="Total"
          color={colors.primary.main}
        />
        <StatCard
          icon="monetization-on"
          value={summary.totalCoinsDeducted}
          label="Coins"
          color={colors.primary.main}
        />
        <StatCard
          icon="call"
          value={summary.totalAudioCalls}
          label="Audio"
          color={colors.primary.main}
        />
        <StatCard
          icon="videocam"
          value={summary.totalVideoCalls}
          label="Video"
          color={colors.primary.main}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SummarySection;
