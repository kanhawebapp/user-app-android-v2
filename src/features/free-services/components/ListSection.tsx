import React from 'react';
import {StyleSheet, View} from 'react-native';

import type {IconProps} from '../../../components/Icon/iconType';
import type {
  MajorDashaPeriod,
  PlanetPosition,
} from '../../../services/api/astrologyApi/astrology.types';
import type {HoroscopeChartResult} from '../hooks/useHoroscopeCharts';
import type {InfoItem} from './InfoCard';
import ChartCard from './ChartCard';
import ChartsSection from './ChartsSection';
import DashaCard from './DashaCard';
import InfoCard from './InfoCard';
import ListStateView from './ListStateView';
import PlanetCard from './PlanetCard';
import SectionHeader from './SectionHeader';

/**
 * One row of a tab's FlatList. Every tab builds an array of these renderers
 * (memoised per render) so each card is a separate virtualised cell instead
 * of a nested ScrollView.
 */
export type ListSection =
  | {kind: 'header'; key: string; title: string; icon?: IconProps}
  | {
      kind: 'info';
      key: string;
      title: string;
      icon?: IconProps;
      items: InfoItem[];
      loading?: boolean;
      error?: any;
      onRetry?: () => void;
    }
  | {kind: 'planet'; key: string; planet: PlanetPosition}
  | {kind: 'dasha'; key: string; period: MajorDashaPeriod}
  | {
      kind: 'chart';
      key: string;
      title: string;
      svg?: string | null;
      error?: any;
      loading?: boolean;
      onRetry?: () => void;
    }
  | {
      kind: 'charts';
      key: string;
      charts: HoroscopeChartResult[];
      loading: boolean;
      onRetry?: () => void;
    }
  | {
      kind: 'state';
      key: string;
      loading?: boolean;
      skeleton?: React.ReactNode;
      error?: any;
      errorText?: string;
      empty?: boolean;
      emptyText?: string;
      onRetry?: () => void;
    };

const ListSectionCell: React.FC<{section: ListSection}> = ({section}) => {
  switch (section.kind) {
    case 'header':
      return <SectionHeader title={section.title} icon={section.icon} />;
    case 'info':
      return (
        <InfoCard
          title={section.title}
          icon={section.icon}
          items={section.items}
          loading={section.loading}
          error={section.error}
          onRetry={section.onRetry}
        />
      );
    case 'planet':
      return (
        <View style={styles.spaced}>
          <PlanetCard planet={section.planet} />
        </View>
      );
    case 'dasha':
      return (
        <View style={styles.spaced}>
          <DashaCard period={section.period} />
        </View>
      );
    case 'chart':
      return (
        <ChartCard
          title={section.title}
          svg={section.svg}
          error={section.error}
          loading={section.loading}
          onRetry={section.onRetry}
        />
      );
    case 'charts':
      return (
        <ChartsSection
          charts={section.charts}
          loading={section.loading}
          onRetry={section.onRetry}
        />
      );
    case 'state':
      return (
        <ListStateView
          loading={section.loading}
          skeleton={section.skeleton}
          error={section.error}
          errorText={section.errorText}
          empty={section.empty}
          emptyText={section.emptyText}
          onRetry={section.onRetry}
        />
      );
    default:
      return null;
  }
};

export default React.memo(ListSectionCell);

const styles = StyleSheet.create({
  spaced: {
    marginBottom: 12,
  },
});
