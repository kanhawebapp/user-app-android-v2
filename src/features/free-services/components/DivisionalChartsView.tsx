import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import {Icon} from '../../../components/Icon';
import {Text} from '../../../components/Text';
import {useTheme} from '../../../theme';
import type {DivisionalChartResult} from '../hooks/useDivisionalCharts';
import ChartCard from './ChartCard';

export interface DivisionalChartsViewProps {
  charts: DivisionalChartResult[];
  loading: boolean;
  /** Global error (e.g. missing birth details). */
  error?: any;
  onRetry?: () => void;
}

/**
 * Divisional Charts tab content: one chart card per Varga chart
 * (SUN, MOON, D1–D60, excluding Chalit).
 */
const DivisionalChartsView: React.FC<DivisionalChartsViewProps> = ({
  charts,
  loading,
  error,
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

  if (error) {
    return (
      <View style={[styles.center, {marginTop: 24}]}>
        <Icon
          name="error-outline"
          size={36}
          color={colors.error.main}
          library="MaterialIcons"
        />
        <Text
          variant="bodySmall"
          style={{
            color: colors.text.secondary,
            marginTop: 12,
            textAlign: 'center',
          }}>
          {error?.message || 'Failed to load divisional charts.'}
        </Text>
        {onRetry ? (
          <TouchableOpacity
            style={[styles.retryButton, {backgroundColor: colors.primary.main}]}
            onPress={onRetry}
            activeOpacity={0.85}>
            <Text
              variant="bodySmall"
              weight="bold"
              style={{color: colors.primary.contrastText}}>
              Retry
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {charts.map(chart => (
        <ChartCard
          key={chart.chartId}
          title={chart.title}
          svg={chart.svg}
          error={chart.error}
          onRetry={onRetry}
        />
      ))}
    </View>
  );
};

export default DivisionalChartsView;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
});
