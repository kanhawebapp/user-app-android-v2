import React, {useEffect} from 'react';
import {FlatList, StyleSheet} from 'react-native';

import type {DivisionalChartState} from '../hooks/useDivisionalCharts';
import ChartCard from './ChartCard';
import ListStateView from './ListStateView';

export interface DivisionalChartsViewProps {
  /** One entry per divisional chart, in the DIVISIONAL_CHARTS order. */
  charts: DivisionalChartState[];
  /** Requests (and caches) a single chart. Called when a card mounts. */
  requestChart: (chartId: string) => void;
  /** Re-fetches a single chart, bypassing the cache (used by retry). */
  retryChart: (chartId: string) => void;
  /** Global error (e.g. missing birth details). */
  error?: any;
  onRetry?: () => void;
}

interface LazyChartCardProps {
  chart: DivisionalChartState;
  requestChart: (chartId: string) => void;
  retryChart: (chartId: string) => void;
}

/**
 * A single divisional chart card. Fires the network request the first time
 * the cell mounts (i.e. scrolls into view), so opening the tab never starts
 * all requests at once. The hook dedupes repeated requests, so a cell that
 * unmounts and re-mounts while scrolling does not re-fetch.
 */
const LazyChartCard: React.FC<LazyChartCardProps> = ({
  chart,
  requestChart,
  retryChart,
}) => {
  useEffect(() => {
    requestChart(chart.chartId);
    // Intentionally run only on first mount; the hook guards against
    // re-requesting already-resolved or in-flight charts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chart.chartId]);

  return (
    <ChartCard
      title={chart.title}
      svg={chart.svg}
      error={chart.error}
      loading={chart.loading}
      onRetry={() => retryChart(chart.chartId)}
    />
  );
};

const MemoizedLazyChartCard = React.memo(LazyChartCard);

/**
 * Divisional Charts tab content: one lazily-fetched chart card per Varga
 * chart (SUN, MOON, D1–D60, excluding Chalit), rendered as a virtualised
 * list so only the visible cards hold their SVG in memory.
 */
const DivisionalChartsView: React.FC<DivisionalChartsViewProps> = ({
  charts,
  requestChart,
  retryChart,
  error,
  onRetry,
}) => {
  if (error) {
    return (
      <ListStateView
        error={error}
        errorText="Failed to load divisional charts."
        onRetry={onRetry}
      />
    );
  }

  return (
    <FlatList
      data={charts}
      keyExtractor={item => item.chartId}
      renderItem={({item}) => (
        <MemoizedLazyChartCard
          chart={item}
          requestChart={requestChart}
          retryChart={retryChart}
        />
      )}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      initialNumToRender={5}
      maxToRenderPerBatch={3}
      windowSize={7}
      testID="divisional-tab-list"
    />
  );
};

export default React.memo(DivisionalChartsView);

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 32,
  },
});
