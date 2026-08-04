import React from 'react';
import {StyleSheet, View} from 'react-native';

import type {
  MajorDashaPeriod,
  PlanetPosition,
} from '../../../services/api/astrologyApi/astrology.types';
import type {AsyncResult} from '../hooks/asyncTypes';
import type {HoroscopeChartResult} from '../hooks/useHoroscopeCharts';
import ChartsSection from './ChartsSection';
import DashaTimeline from './DashaTimeline';
import PlanetsList from './PlanetsList';

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
 * Planets tab content: planet positions table and Vimshottari dasha
 * timeline, followed by the shared Chalit and D9 charts.
 */
const PlanetsTabView: React.FC<PlanetsTabViewProps> = ({
  planets,
  dasha,
  charts,
  chartsLoading,
  onRetryPlanets,
  onRetryCharts,
}) => {
  return (
    <View style={styles.container}>
      <PlanetsList planets={planets} onRetry={onRetryPlanets} />

      <DashaTimeline dasha={dasha} onRetry={onRetryPlanets} />

      <ChartsSection
        charts={charts}
        loading={chartsLoading}
        onRetry={onRetryCharts}
      />
    </View>
  );
};

export default PlanetsTabView;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
