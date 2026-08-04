import React, {useCallback, useMemo, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {Icon} from '../../../components/Icon';
import {Text} from '../../../components/Text';
import {useTheme} from '../../../theme';
import {beautifyKundliSvg, getSvgAspectRatio} from '../utils/kundliService';
import {ChartSkeletonBlock} from './Skeletons';

export interface ChartCardProps {
  /** Title shown above the SVG. */
  title: string;
  /** Raw SVG string from the horo_chart_image endpoint. */
  svg?: string | null;
  /** Per-chart error (renders a retry state instead of the SVG). */
  error?: any;
  /** Renders a skeleton placeholder while the SVG is being fetched. */
  loading?: boolean;
  /** Called by the retry button. */
  onRetry?: () => void;
}

/** Fallback chart height when the SVG has no usable viewBox. */
const CHART_FALLBACK_HEIGHT = 320;

/**
 * Renders a single horoscope chart inside a card. The SVG is beautified once
 * (memoised on the raw string, then cached globally) and scaled responsively.
 */
const ChartCard: React.FC<ChartCardProps> = ({
  title,
  svg,
  error,
  loading = false,
  onRetry,
}) => {
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

  const handleLayout = useCallback((event: any) => {
    const nextWidth = event.nativeEvent?.layout?.width || 0;
    setContentWidth(prev => (prev === nextWidth ? prev : nextWidth));
  }, []);

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
          {onRetry ? (
            <TouchableOpacity
              style={[
                styles.retryButton,
                {backgroundColor: colors.primary.main},
              ]}
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

    if (loading) {
      return <ChartSkeletonBlock />;
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

      <View style={styles.chartContent} onLayout={handleLayout}>
        {renderBody()}
      </View>
    </View>
  );
};

export default React.memo(ChartCard);

const styles = StyleSheet.create({
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
