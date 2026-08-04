import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Icon} from '../../../components/Icon';
import {Text} from '../../../components/Text';
import {useTheme} from '../../../theme';
import {useToast} from '../../../context/ToastContext';
import {
  buildBasicDetailsPayload,
  buildHoroscopeChartPayload,
} from '../utils/kundliService';
import {useHoroscopeCharts} from '../hooks/useHoroscopeCharts';
import {useBirthBasicsData} from '../hooks/useBirthBasicsData';
import {usePlanetsData} from '../hooks/usePlanetsData';
import {useDivisionalCharts} from '../hooks/useDivisionalCharts';
import ChartTabs, {type ChartTabItem} from './ChartTabs';
import BasicTabView from './BasicTabView';
import PlanetsTabView from './PlanetsTabView';
import DivisionalChartsView from './DivisionalChartsView';

export interface BirthChartViewProps {
  result: any;
  serviceTitle?: string;
  onBack: () => void;
}

type ActiveTab = 'basic' | 'planets' | 'divisional';

const TABS: ChartTabItem[] = [
  {key: 'basic', label: 'Basic'},
  {key: 'planets', label: 'Planets'},
  {key: 'divisional', label: 'Divisional'},
];

const BirthChartView: React.FC<BirthChartViewProps> = ({
  result,
  serviceTitle,
  onBack,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const {showError} = useToast();

  const [activeTab, setActiveTab] = useState<ActiveTab>('basic');

  const birthPayload = result?.payload;

  const basicPayload = useMemo(() => {
    if (!birthPayload || birthPayload.day == null) {
      return null;
    }
    return buildBasicDetailsPayload(birthPayload);
  }, [birthPayload]);

  const chartPayload = useMemo(() => {
    if (!birthPayload || birthPayload.day == null) {
      return null;
    }
    return buildHoroscopeChartPayload(birthPayload);
  }, [birthPayload]);

  // The Chalit + D9 charts are fetched once here and shared by the Basic and
  // Planets tabs. Switching tabs never triggers a second request.
  const charts = useHoroscopeCharts(chartPayload);
  const basics = useBirthBasicsData(basicPayload);
  const planets = usePlanetsData(basicPayload, activeTab === 'planets');
  const divisional = useDivisionalCharts(
    chartPayload,
    activeTab === 'divisional',
  );

  // Surface global errors (e.g. missing birth details) through the toast.
  useEffect(() => {
    if (charts.error) {
      showError(charts.error?.message || 'Failed to load birth charts.');
    }
  }, [charts.error, showError]);

  useEffect(() => {
    if (basics.error) {
      showError(basics.error?.message || 'Failed to load basic details.');
    }
  }, [basics.error, showError]);

  useEffect(() => {
    if (planets.error) {
      showError(planets.error?.message || 'Failed to load planet details.');
    }
  }, [planets.error, showError]);

  useEffect(() => {
    if (divisional.error) {
      showError(
        divisional.error?.message || 'Failed to load divisional charts.',
      );
    }
  }, [divisional.error, showError]);

  const handleRetryCharts = useCallback(() => {
    charts.reload();
  }, [charts]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'planets':
        return (
          <PlanetsTabView
            planets={planets.planets}
            dasha={planets.dasha}
            charts={charts.charts}
            chartsLoading={charts.loading}
            onRetryPlanets={planets.reload}
            onRetryCharts={handleRetryCharts}
          />
        );
      case 'divisional':
        return (
          <DivisionalChartsView
            charts={divisional.charts}
            loading={divisional.loading}
            error={divisional.error}
            onRetry={divisional.reload}
          />
        );
      case 'basic':
      default:
        return (
          <BasicTabView
            birthDetails={basics.birthDetails}
            panchang={basics.panchang}
            astroDetails={basics.astroDetails}
            charts={charts.charts}
            chartsLoading={charts.loading}
            onRetryBasics={basics.reload}
            onRetryCharts={handleRetryCharts}
          />
        );
    }
  };

  const renderContent = () => {
    if (!chartPayload) {
      return (
        <View style={[styles.center, {marginTop: 40}]}>
          <Icon
            name="error-outline"
            size={40}
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
            Birth details are missing. Please go back and submit the Kundli form
            again.
          </Text>
        </View>
      );
    }

    return renderActiveTab();
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background.primary}]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon
            name="arrow-back"
            size={22}
            color={colors.text.primary}
            library="MaterialIcons"
          />
        </TouchableOpacity>
        <Text
          variant="h6"
          weight="bold"
          style={{color: colors.text.primary, flex: 1}}>
          {serviceTitle || 'Birth Chart'}
        </Text>
      </View>

      <ChartTabs
        tabs={TABS}
        activeKey={activeTab}
        onChange={key => setActiveTab(key as ActiveTab)}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default BirthChartView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 24,
  },
});
