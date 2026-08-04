import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {SvgXml} from 'react-native-svg';

import {Icon} from '../../../components/Icon';
import {Text} from '../../../components/Text';
import {useTheme} from '../../../theme';
import {useToast} from '../../../context/ToastContext';
import {
  beautifyKundliSvg,
  buildHoroscopeChartPayload,
  getSvgAspectRatio,
} from '../utils/kundliService';
import {useHoroscopeCharts} from '../hooks/useHoroscopeCharts';

export interface BirthChartViewProps {
  result: any;
  serviceTitle?: string;
  onBack: () => void;
}

/** Fallback chart height when the SVG has no usable viewBox. */
const CHART_FALLBACK_HEIGHT = 320;

const ChartCard: React.FC<{
  title: string;
  svg?: string | null;
  error?: any;
  onRetry: () => void;
}> = ({title, svg, error, onRetry}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const [contentWidth, setContentWidth] = useState(0);

  const beautifiedSvg = useMemo(
    () => (svg ? beautifyKundliSvg(svg) : null),
    [svg],
  );

  const aspectRatio = useMemo(
    () => getSvgAspectRatio(beautifiedSvg || ''),
    [beautifiedSvg],
  );

  const renderBody = () => {
    if (error) {
      return (
        <View style={styles.chartState}>
          <Icon
            name="error-outline"
            size={32}
            color={colors.error.main}
            library="MaterialIcons"
          />
          <Text
            variant="bodySmall"
            style={{
              color: colors.text.secondary,
              marginTop: 8,
              textAlign: 'center',
            }}>
            {error?.message || 'Failed to load this chart.'}
          </Text>
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
        </View>
      );
    }

    if (!beautifiedSvg) {
      return (
        <View style={styles.chartState}>
          <Text
            variant="bodySmall"
            style={{color: colors.text.tertiary, textAlign: 'center'}}>
            No chart data available.
          </Text>
        </View>
      );
    }

    if (contentWidth === 0) {
      return null;
    }

    const chartHeight = aspectRatio
      ? contentWidth / aspectRatio
      : CHART_FALLBACK_HEIGHT;

    return (
      <SvgXml
        xml={beautifiedSvg}
        width={contentWidth}
        height={chartHeight}
        preserveAspectRatio="xMidYMid meet"
      />
    );
  };

  return (
    <View
      style={[
        styles.chartCard,
        {backgroundColor: colors.background.secondary},
      ]}>
      <Text
        variant="body"
        weight="bold"
        style={{color: colors.text.primary, marginBottom: 12}}>
        {title}
      </Text>

      <View
        style={styles.chartContent}
        onLayout={e => setContentWidth(e.nativeEvent.layout.width)}>
        {renderBody()}
      </View>
    </View>
  );
};

const BirthChartView: React.FC<BirthChartViewProps> = ({
  result,
  serviceTitle,
  onBack,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const {showError} = useToast();

  const chartPayload = useMemo(() => {
    const birthPayload = result?.payload;
    if (!birthPayload || birthPayload.day == null) {
      return null;
    }
    return buildHoroscopeChartPayload(birthPayload);
  }, [result?.payload]);

  const {charts, loading, error, reload} = useHoroscopeCharts(chartPayload);

  // Surface the global error (e.g. missing birth details) through the toast.
  useEffect(() => {
    if (error) {
      showError(error?.message || 'Failed to load birth charts.');
    }
  }, [error, showError]);

  // Debug log for the rendering status of each chart after fetch settles.
  useEffect(() => {
    if (loading) {
      return;
    }
    charts.forEach(chart => {
      console.log(`[BirthChart] render ${chart.type}`, {
        title: chart.label,
        hasSvg: Boolean(chart.svg),
        svgLength: chart.svg?.length || 0,
        error: chart.error?.message || null,
      });
    });
  }, [charts, loading]);

  const handleRetry = useCallback(() => {
    reload();
  }, [reload]);

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary.main} />
        </View>
      );
    }

    if (error) {
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
            {error?.message || 'Something went wrong. Please try again.'}
          </Text>
          {chartPayload ? (
            <TouchableOpacity
              style={[
                styles.retryButton,
                {backgroundColor: colors.primary.main},
              ]}
              onPress={handleRetry}
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

    return charts.map(chart => (
      <ChartCard
        key={chart.type}
        title={chart.label}
        svg={chart.svg}
        error={chart.error}
        onRetry={handleRetry}
      />
    ));
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
  chartCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  chartContent: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
});
