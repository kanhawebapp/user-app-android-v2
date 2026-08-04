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
import type {MajorDashaPeriod} from '../../../services/api/astrologyApi/astrology.types';
import type {AsyncResult} from '../hooks/asyncTypes';
import DashaCard from './DashaCard';
import SectionHeader from './SectionHeader';

export interface DashaTimelineProps {
  /** Async result for /v1/major_vdasha. */
  dasha: AsyncResult<MajorDashaPeriod[]>;
  onRetry?: () => void;
}

/**
 * Renders the "Vimshottari Dasha" section: a section header followed by one
 * standalone card per dasha period, with loading, error and empty states.
 */
const DashaTimeline: React.FC<DashaTimelineProps> = ({dasha, onRetry}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const renderBody = () => {
    if (dasha.loading) {
      return (
        <View style={styles.state}>
          <ActivityIndicator size="small" color={colors.primary.main} />
        </View>
      );
    }

    if (dasha.error) {
      return (
        <View style={styles.state}>
          <Icon
            name="error-outline"
            size={24}
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
            {dasha.error?.message || 'Failed to load the dasha timeline.'}
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

    const list = dasha.data || [];
    if (list.length === 0) {
      return (
        <View style={styles.state}>
          <Text
            variant="bodySmall"
            style={{color: colors.text.tertiary, textAlign: 'center'}}>
            No dasha data available.
          </Text>
        </View>
      );
    }

    return (
      <View>
        {list.map((period, index) => (
          <View
            key={`${period.planet}-${period.planet_id ?? index}`}
            style={styles.item}>
            <DashaCard period={period} />
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SectionHeader
        title="Vimshottari Dasha"
        icon={{name: 'timeline', library: 'MaterialIcons'}}
      />
      {renderBody()}
    </View>
  );
};

export default DashaTimeline;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 24,
  },
  item: {
    marginBottom: 12,
  },
  state: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  retryButton: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
});
