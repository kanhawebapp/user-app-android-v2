
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '../../../../../theme';
import { Text } from '../../../../../components/Text';
import { Icon } from '../../../../../components/Icon';
import { ProblemCategoryProps } from '../../types';

const { width } = Dimensions.get('window');

export const ProblemCategories: React.FC<ProblemCategoryProps> = ({
  categories = [],
  onCategoryPress,
  style,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View style={[styles.container, style]}>
      <Text variant="h6" weight="semibold" style={styles.title}>
        Problem Based Category
      </Text>
      
      <View style={styles.grid}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[styles.item, { backgroundColor: category.color ? category.color + '10' : colors.card }]}
            onPress={() => onCategoryPress?.(category)}
          >
            <View style={[styles.iconContainer, { backgroundColor: category.color ? category.color + '20' : colors.primary.light + '20' }]}>
              <Icon 
                name={category.icon} 
                library={category.iconLibrary as any} 
                size={24} 
                color={category.color || colors.primary.main} 
              />
            </View>
            <View style={styles.textContainer}>
                <Text variant="label" weight="medium" style={styles.itemTitle}>
                {category.title}
                </Text>
                {category.count !== undefined && (
                    <Text variant="captionSmall" style={{ color: colors.text.secondary }}>
                        {category.count} Experts
                    </Text>
                )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  title: {
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  item: {
    width: (width - 48) / 2, // 2 columns with spacing
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  itemTitle: {
    marginBottom: 2,
  },
});
