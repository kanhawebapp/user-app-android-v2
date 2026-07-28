import React from 'react';
import {View, StyleSheet} from 'react-native';
import { useTheme } from '../../../../theme';
import { Text } from '../../../../components';
// import {useTheme} from '../theme';
// import {Text} from '../components/Text';

type StatsItem = {
  label: string;
  value: string;
};

type StatsCardProps = {
  stats: StatsItem[];
};

export const StatsCard: React.FC<StatsCardProps> = ({stats}) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View style={styles.container}>
      {stats.map((item, index) => (
        <View
          key={index}
          style={[
            styles.statItem,
            {
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.light,
            },
          ]}>
          <Text style={[styles.statValue, {color: colors.text.primary}]}>
            {item.value}
          </Text>
          <Text style={[styles.statLabel, {color: colors.text.secondary}]}>
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22,
    gap: 12,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
  },
  statValue: {
    fontWeight: '800',
    fontSize: 18,
  },
  statLabel: {
    marginTop: 4,
    fontSize: 13,
  },
});

export default StatsCard;