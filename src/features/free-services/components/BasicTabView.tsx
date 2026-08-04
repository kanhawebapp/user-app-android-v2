import React from 'react';
import {StyleSheet, View} from 'react-native';

import type {
  AstroDetailsResponse,
  BasicPanchangResponse,
  BirthDetailsResponse,
} from '../../../services/api/astrologyApi/astrology.types';
import type {AsyncResult} from '../hooks/asyncTypes';
import type {HoroscopeChartResult} from '../hooks/useHoroscopeCharts';
import ChartsSection from './ChartsSection';
import InfoCard from './InfoCard';

export interface BasicTabViewProps {
  birthDetails: AsyncResult<BirthDetailsResponse>;
  panchang: AsyncResult<BasicPanchangResponse>;
  astroDetails: AsyncResult<AstroDetailsResponse>;
  /** The cached Chalit + D9 chart results shared with the Planets tab. */
  charts: HoroscopeChartResult[];
  chartsLoading: boolean;
  onRetryBasics: () => void;
  onRetryCharts?: () => void;
}

const pad2 = (value?: number): string => String(value ?? 0).padStart(2, '0');

const getBirthDetailsItems = (data: BirthDetailsResponse | null) => [
  {
    label: 'Date',
    value: data?.day
      ? `${pad2(data.day)}/${pad2(data.month)}/${data.year}`
      : undefined,
  },
  {
    label: 'Time',
    value:
      data?.hour !== undefined
        ? `${pad2(data.hour)}:${pad2(data.minute)}`
        : undefined,
  },
  {label: 'Latitude', value: data?.latitude},
  {label: 'Longitude', value: data?.longitude},
  {label: 'Timezone', value: data?.timezone},
  {label: 'Sunrise', value: data?.sunrise},
  {label: 'Sunset', value: data?.sunset},
  {label: 'Ayanamsha', value: data?.ayanamsha},
];

const getPanchangItems = (data: BasicPanchangResponse | null) => [
  {label: 'Day', value: data?.day},
  {label: 'Tithi', value: data?.tithi},
  {label: 'Nakshatra', value: data?.nakshatra},
  {label: 'Yog', value: data?.yog},
  {label: 'Karan', value: data?.karan},
  {label: 'Sunrise', value: data?.sunrise},
  {label: 'Sunset', value: data?.sunset},
];

const getAstroDetailsItems = (data: AstroDetailsResponse | null) => [
  {label: 'Ascendant', value: data?.ascendant},
  {label: 'Sign', value: data?.sign},
  {label: 'Sign Lord', value: data?.SignLord},
  {label: 'Nakshatra', value: data?.Naksahtra},
  {label: 'Nakshatra Lord', value: data?.NaksahtraLord},
  {label: 'Charan', value: data?.Charan},
  {label: 'Tithi', value: data?.Tithi},
  {label: 'Yog', value: data?.Yog},
  {label: 'Karan', value: data?.Karan},
  {label: 'Varna', value: data?.Varna},
  {label: 'Vashya', value: data?.Vashya},
  {label: 'Yoni', value: data?.Yoni},
  {label: 'Gan', value: data?.Gan},
  {label: 'Nadi', value: data?.Nadi},
  {label: 'Tatva', value: data?.tatva},
  {label: 'Paya', value: data?.paya},
  {label: 'Name Alphabet', value: data?.name_alphabet},
  {label: 'Yunja', value: data?.yunja},
];

/**
 * Basic tab content: the three information cards followed by the shared
 * Chalit and D9 charts.
 */
const BasicTabView: React.FC<BasicTabViewProps> = ({
  birthDetails,
  panchang,
  astroDetails,
  charts,
  chartsLoading,
  onRetryBasics,
  onRetryCharts,
}) => {
  return (
    <View style={styles.container}>
      <InfoCard
        title="Basic Details"
        icon={{name: 'person', library: 'MaterialIcons'}}
        items={getBirthDetailsItems(birthDetails.data)}
        loading={birthDetails.loading}
        error={birthDetails.error}
        onRetry={onRetryBasics}
      />

      <InfoCard
        title="Basic Panchang"
        icon={{name: 'wb-sunny', library: 'MaterialIcons'}}
        items={getPanchangItems(panchang.data)}
        loading={panchang.loading}
        error={panchang.error}
        onRetry={onRetryBasics}
      />

      <InfoCard
        title="Basic Astro Details"
        icon={{name: 'stars', library: 'MaterialIcons'}}
        items={getAstroDetailsItems(astroDetails.data)}
        loading={astroDetails.loading}
        error={astroDetails.error}
        onRetry={onRetryBasics}
      />

      <ChartsSection
        charts={charts}
        loading={chartsLoading}
        onRetry={onRetryCharts}
      />
    </View>
  );
};

export default BasicTabView;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
