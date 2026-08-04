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
import type {PlanetPosition} from '../../../services/api/astrologyApi/astrology.types';
import type {AsyncResult} from '../hooks/asyncTypes';
import PlanetCard from './PlanetCard';
import SectionHeader from './SectionHeader';

export interface PlanetsListProps {
  /** Async result for /v1/planets. */
  planets: AsyncResult<PlanetPosition[]>;
  onRetry?: () => void;
}

/**
 * Renders the "Planet Positions" section: a section header followed by one
 * standalone card per planet, with loading, error and empty states.
 */
const PlanetsList: React.FC<PlanetsListProps> = ({planets, onRetry}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const renderBody = () => {
    if (planets.loading) {
      return (
        <View style={styles.state}>
          <ActivityIndicator size="small" color={colors.primary.main} />
        </View>
      );
    }

    if (planets.error) {
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
            {planets.error?.message || 'Failed to load planet positions.'}
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

    const list = planets.data || [];
    if (list.length === 0) {
      return (
        <View style={styles.state}>
          <Text
            variant="bodySmall"
            style={{color: colors.text.tertiary, textAlign: 'center'}}>
            No planet data available.
          </Text>
        </View>
      );
    }

    return (
      <View>
        {list.map((planet, index) => (
          <View
            key={`${planet.name}-${planet.id ?? index}`}
            style={styles.item}>
            <PlanetCard planet={planet} />
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SectionHeader
        title="Planet Positions"
        icon={{name: 'public', library: 'MaterialIcons'}}
      />
      {renderBody()}
    </View>
  );
};

export default PlanetsList;

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
