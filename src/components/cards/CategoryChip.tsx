import React from 'react';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import { Text } from '../../components/Text';
import { colors } from '../../theme';
import { API_BASE_URL } from '../../constants/api.constants';

const BASE_IMAGE_URL = API_BASE_URL.DEVELOPMENT;

interface Category {
  id: string;
  name: string;
  image?: string;
}

interface CategoryChipProps {
  category: Category;
  isSelected: boolean;
  onPress: (categoryId: string) => void;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
  category,
  isSelected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.chip,
        isSelected && styles.selectedChip,
      ]}
      onPress={() => onPress(category.id)}
    >
      {category.image ? (
        <Image
          source={{
            uri: `${BASE_IMAGE_URL}${category.image}`,
          }}
          style={styles.chipImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.chipImage, styles.placeholderImage]}>
          <Text style={styles.placeholderText}>
            {category.name.charAt(0)}
          </Text>
        </View>
      )}

      <Text
        style={[
          styles.chipText,
          isSelected && styles.selectedChipText as any,
        ]}
        weight="medium"
        numberOfLines={1}
      >
        {category.name}
      </Text>

      {isSelected && (
        <View style={styles.checkmarkBadge}>
          <Text style={styles.checkmarkText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#fff',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    minWidth: 100,
    maxWidth: 140,
  },
  selectedChip: {
    backgroundColor: colors.primary.light,
    borderColor: colors.primary.main,
    borderWidth: 1,
  },
  chipImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 6,
  },
  placeholderImage: {
    backgroundColor: colors.primary.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 18,
    color: colors.primary.main,
    fontWeight: '700',
  },
  chipText: {
    fontSize: 12,
    color: '#444',
    textAlign: 'center',
  },
  selectedChipText: {
    color:colors.primary.main,
  },
  checkmarkBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: colors.primary.main,
    fontSize: 12,
    fontWeight: '700',
  },
});

export default CategoryChip;