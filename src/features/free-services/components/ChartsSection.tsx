import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

import {Text} from '../../../components/Text';
import {useTheme} from '../../../theme';
import type {HoroscopeChartResult} from '../hooks/useHoroscopeCharts';
import ChartCard from './ChartCard';

export interface ChartsSectionProps {
  /** The cached Chalit + D9 chart results shared by the Basic and Planets tabs. */
  charts: HoroscopeChartResult[];
  /** True while the charts are being fetched for the first time. */
  loading: boolean;
  onRetry?: () => void;
}

/**
 * Renders the shared Chalit and D9 charts. Used by both the Basic and
 * Planets tabs so the SVGs are fetched only once at the screen level.
 */
const ChartsSection: React.FC<ChartsSectionProps> = ({
  charts,
  loading,
  onRetry,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {charts.length === 0 ? (
        <Text
          variant="bodySmall"
          style={{color: colors.text.tertiary, textAlign: 'center'}}>
          No chart data available.
        </Text>
      ) : (
        charts.map(chart => (
          <ChartCard
            key={chart.type}
            title={chart.label}
            svg={chart.svg}
            error={chart.error}
            onRetry={onRetry}
          />
        ))
      )}
    </View>
  );
};

export default ChartsSection;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
});
