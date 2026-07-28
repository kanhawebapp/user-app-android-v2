
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../../../../../theme';
import { Text } from '../../../../../components/Text';
import { Icon } from '../../../../../components/Icon';
import { TrustAuthorityProps } from '../../types';

const { width } = Dimensions.get('window');

export const TrustSection: React.FC<TrustAuthorityProps> = ({
  features = [],
  style,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View style={[styles.container, { backgroundColor: colors.background.secondary + '50' }, style]}>
      <Text variant="h6" weight="semibold" style={styles.title}>
        Why Trust Dhwani Astro?
      </Text>
      
      <View style={styles.grid}>
        {features.map((feature) => (
          <View key={feature.id} style={styles.item}>
            <View style={[styles.iconContainer, { backgroundColor: colors.background.primary }]}>
              <Icon 
                name={feature.icon} 
                library={feature.iconLibrary as any} 
                size={24} 
                color={colors.primary.main} 
              />
            </View>
            <Text variant="label" weight="medium" style={styles.itemTitle}>
                {feature.title}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 32,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  item: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemTitle: {
    textAlign: 'center',
    fontSize: 12,
  },
});
