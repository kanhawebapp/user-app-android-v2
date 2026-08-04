import React, {useMemo, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {Icon} from '../../../components/Icon';
import {Text} from '../../../components/Text';
import {useTheme} from '../../../theme';
import {beautifyKundliSvg, getSvgAspectRatio} from '../utils/kundliService';

export interface ChartCardProps {
  /** Title shown above the SVG. */
  title: string;
  /** Raw SVG string from the horo_chart_image endpoint. */
  svg?: string | null;
  /** Per-chart error (renders a retry state instead of the SVG). */
  error?: any;
  /** Called by the retry button. */
  onRetry?: () => void;
}

/** Fallback chart height when the SVG has no usable viewBox. */
const CHART_FALLBACK_HEIGHT = 320;

/**
 * Renders a single horoscope chart inside a card. The SVG is beautified,
 * measured via its viewBox and scaled responsively to the available width.
 */
const ChartCard: React.FC<ChartCardProps> = ({title, svg, error, onRetry}) => {
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

export default ChartCard;

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
