import React, {useMemo} from 'react';
import {FlatList, StyleSheet} from 'react-native';

import type {
  MajorDashaPeriod,
  PlanetPosition,
} from '../../../services/api/astrologyApi/astrology.types';
import type {AsyncResult} from '../hooks/asyncTypes';
import type {HoroscopeChartResult} from '../hooks/useHoroscopeCharts';
import type {ListSection} from './ListSection';
import ListSectionCell from './ListSection';
import {DashaCardSkeleton, PlanetCardSkeleton} from './Skeletons';

export interface PlanetsTabViewProps {
  planets: AsyncResult<PlanetPosition[]>;
  dasha: AsyncResult<MajorDashaPeriod[]>;
  /** The cached Chalit + D9 chart results shared with the Basic tab. */
  charts: HoroscopeChartResult[];
  chartsLoading: boolean;
  onRetryPlanets: () => void;
  onRetryCharts?: () => void;
}

/**
 * Planets tab content: planet positions and Vimshottari dasha rendered as
 * one card per FlatList cell, followed by the shared Chalit and D9 charts.
 */
const PlanetsTabView: React.FC<PlanetsTabViewProps> = ({
  planets,
  dasha,
  charts,
  chartsLoading,
  onRetryPlanets,
  onRetryCharts,
}) => {
  const sections = useMemo<ListSection[]>(() => {
    const items: ListSection[] = [];

    items.push({
      kind: 'header',
      key: 'planets-header',
      title: 'Planet Positions',
      icon: {name: 'public', library: 'MaterialIcons'},
    });

    if (planets.loading) {
      items.push({
        kind: 'state',
        key: 'planets-state',
        loading: true,
        skeleton: <PlanetCardSkeleton />,
      });
    } else if (planets.error) {
      items.push({
        kind: 'state',
        key: 'planets-state',
        error: planets.error,
        errorText: 'Failed to load planet positions.',
        onRetry: onRetryPlanets,
      });
    } else if (!planets.data || planets.data.length === 0) {
      items.push({
        kind: 'state',
        key: 'planets-state',
        empty: true,
        emptyText: 'No planet data available.',
      });
    } else {
      planets.data.forEach((planet, index) => {
        items.push({
          kind: 'planet',
          key: `planet-${planet.name}-${planet.id ?? index}`,
          planet,
        });
      });
    }

    items.push({
      kind: 'header',
      key: 'dasha-header',
      title: 'Vimshottari Dasha',
      icon: {name: 'timeline', library: 'MaterialIcons'},
    });

    if (dasha.loading) {
      items.push({
        kind: 'state',
        key: 'dasha-state',
        loading: true,
        skeleton: <DashaCardSkeleton />,
      });
    } else if (dasha.error) {
      items.push({
        kind: 'state',
        key: 'dasha-state',
        error: dasha.error,
        errorText: 'Failed to load the dasha timeline.',
        onRetry: onRetryPlanets,
      });
    } else if (!dasha.data || dasha.data.length === 0) {
      items.push({
        kind: 'state',
        key: 'dasha-state',
        empty: true,
        emptyText: 'No dasha data available.',
      });
    } else {
      dasha.data.forEach((period, index) => {
        items.push({
          kind: 'dasha',
          key: `dasha-${period.planet}-${period.planet_id ?? index}`,
          period,
        });
      });
    }

    items.push({
      kind: 'charts',
      key: 'charts',
      charts,
      loading: chartsLoading,
      onRetry: onRetryCharts,
    });

    return items;
  }, [planets, dasha, charts, chartsLoading, onRetryPlanets, onRetryCharts]);

  return (
    <FlatList
      data={sections}
      keyExtractor={item => item.key}
      renderItem={({item}) => <ListSectionCell section={item} />}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      initialNumToRender={6}
      maxToRenderPerBatch={6}
      windowSize={7}
      testID="planets-tab-list"
    />
  );
};

export default React.memo(PlanetsTabView);

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 32,
  },
});
