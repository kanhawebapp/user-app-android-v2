import React from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {useTheme} from '../../../../../theme';
import {Text} from '../../../../../components/Text';
import {Icon} from '../../../../../components/Icon';
import {ProblemCategoryProps} from '../../types';

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

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}>
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.item,
              {
                backgroundColor: category.color
                  ? category.color + '10'
                  : colors.card + '10',
              },
            ]}
            onPress={() => onCategoryPress?.(category)}>
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: category.color
                    ? category.color + '20'
                    : colors.primary.light + '20',
                },
              ]}>
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
                <Text
                  variant="captionSmall"
                  style={{color: colors.text.secondary}}>
                  {category.count} Experts
                </Text>
              )}
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
    paddingHorizontal: 16,
  },
  title: {
    marginBottom: 16,
  },

  // 👇 NEW ROW STYLE
  row: {
    paddingRight: 16,
  },

  item: {
    width: 200, // 👈 fixed width for horizontal scroll
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginRight: 12, // 👈 spacing between items
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
