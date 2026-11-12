import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../../../../theme';
import { Text } from '../../../../../components/Text';
import { Icon } from '../../../../../components/Icon';
import { ProblemCategoryProps, ProblemCategory } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_INSET = 16;
const CARD_GAP = 12;
const CARD_WIDTH = Math.min(112, (SCREEN_WIDTH - HORIZONTAL_INSET * 2 - CARD_GAP * 2) / 3.2);
const ICON_SIZE = 48;

const PASTEL_BACKGROUNDS = [
  '#FCE7F3',
  '#E0F2FE',
  '#DCFCE7',
  '#EDE9FE',
  '#FEF3C7',
  '#E0E7FF',
];

const getPastelBackground = (category: ProblemCategory, index: number): string => {
  if (category.color) {
    return `${category.color}18`;
  }
  return PASTEL_BACKGROUNDS[index % PASTEL_BACKGROUNDS.length];
};

export const ProblemCategories: React.FC<ProblemCategoryProps> = ({
  categories = [],
  onCategoryPress,
  style,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const items = useMemo(() => categories ?? [], [categories]);

  if (!items.length) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <Text variant="h6" weight="semibold" style={styles.title}>
        Solve Your Problems
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        centerContent={items.length <= 3}>
        {items.map((category, index) => (
          <TouchableOpacity
            key={category.id}
            activeOpacity={0.85}
            style={[
              styles.card,
              {
                backgroundColor: colors.common.white,
                shadowColor: colors.common.black,
              },
              index === items.length - 1 && styles.lastCard,
            ]}
            onPress={() => onCategoryPress?.(category)}>
            <View style={styles.cardInner}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: getPastelBackground(category, index) },
                ]}>
                <Icon
                  name={category.icon}
                  library={
                    (category.iconLibrary as 'MaterialIcons') || 'MaterialIcons'
                  }
                  size={24}
                  color={colors.primary.main}
                />
              </View>

              <Text
                variant="label"
                weight="medium"
                style={[styles.itemTitle, { color: colors.text.primary }]}
                numberOfLines={2}>
                {category.title}
              </Text>
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
    alignItems: 'stretch',
  },
  title: {
    marginBottom: 12,
    textAlign: 'left',
  },
  row: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
  },
  card: {
    width: CARD_WIDTH,
    minHeight: 118,
    borderRadius: 18,
    marginRight: CARD_GAP,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  lastCard: {
    marginRight: 0,
  },
  cardInner: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  itemTitle: {
    width: '100%',
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '600',
  },
});

export default ProblemCategories;
