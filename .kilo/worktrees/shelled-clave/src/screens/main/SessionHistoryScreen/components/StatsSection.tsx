import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '../../../../theme';
import {Text} from '../../../../components/Text';
import {Icon} from '../../../../components/Icon';

export interface SessionStats {
  totalSessions: number;
  totalMinutes: number;
  totalSpent: number;
}

interface StatsSectionProps {
  stats: SessionStats;
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
        styles.premiumStatCard,
        {backgroundColor: colors.background.primary},
      ]}>
      <View style={[styles.statIconWrapper, {backgroundColor: color + '20'}]}>
        <Icon name={icon} size={20} color={color} />
      </View>
      <Text
        variant="h5"
        weight="bold"
        style={{color: colors.text.primary, marginTop: 8}}>
        {value}
      </Text>
      <Text
        variant="captionSmall"
        style={{color: colors.text.secondary, marginTop: 4}}>
        {label}
      </Text>
    </View>
  );
};

export const StatsSection: React.FC<StatsSectionProps> = ({stats}) => {
  const {colors} = useTheme();

  const formatTalkTime = (totalMinutes: number) => {
    if (!totalMinutes) {
      return '0m';
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) {
      return `${minutes}m`;
    }

    if (minutes === 0) {
      return `${hours}h`;
    }

    return `${hours}h ${minutes}m`;
  };

  return (
    <View
      style={[
        styles.statsSection,
        {backgroundColor: colors.background.primary},
      ]}>
      <View style={styles.statsGrid}>
        <StatCard
          icon="chat"
          value={stats.totalSessions}
          label="Total Sessions"
          color={colors.primary.main}
        />
        <StatCard
          icon="schedule"
          value={formatTalkTime(stats.totalMinutes)}
          label="Talk Time"
          color={colors.primary.main}
        />
        <StatCard
          icon="payments"
          value={`₹${stats.totalSpent}`}
          label="Total Spent"
          color={colors.primary.main}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  premiumStatCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default StatsSection;
