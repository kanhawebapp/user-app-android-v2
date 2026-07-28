
import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../../../theme';
import { Text } from '../../../../../components/Text';
import { Icon } from '../../../../../components/Icon';
import { Button } from '../../../../../components/Button';
import { FeaturedRemediesProps } from '../../types';

export const FeatureHealings: React.FC<FeaturedRemediesProps> = ({
  remedies = [],
  onRemedyPress,
  onViewAllPress,
  style,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text variant="h6" weight="semibold">
          Feature Healings
        </Text>
        <Button
          title="View All"
          variant="ghost"
          size="small"
          onPress={onViewAllPress}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {remedies.map((remedy) => (
          <TouchableOpacity
            key={remedy.id}
            style={[styles.card, { backgroundColor: colors.card }]}
            onPress={() => onRemedyPress?.(remedy)}
            activeOpacity={0.9}
          >
            <View style={[styles.imagePlaceholder, { backgroundColor: colors.background.secondary }]}>
                <Icon name="spa" size={32} color={colors.primary.main} library="MaterialIcons" />
            </View>
            
            <View style={styles.content}>
                <Text variant="label" weight="semibold" numberOfLines={1}>
                    {remedy.title}
                </Text>
                <Text variant="captionSmall" style={{ color: colors.text.secondary, marginTop: 4 }} numberOfLines={2}>
                    {remedy.description}
                </Text>
                
                <View style={styles.footer}>
                    <Text variant="label" weight="bold" style={{ color: colors.primary.main }}>
                        ₹{remedy.price}
                    </Text>
                    <Icon name="arrow-forward" size={16} color={colors.primary.main} library="MaterialIcons" />
                </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  scrollContent: {
    paddingHorizontal: 12,
  },
  card: {
    width: 160,
    borderRadius: 12,
    marginHorizontal: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  imagePlaceholder: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
});
