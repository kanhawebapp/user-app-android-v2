import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
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

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.card}
      onPress={onPress}
    >
      {category.image ? (
        <Image
          source={{
            uri: `${BASE_IMAGE_URL}${category.image}`,
          }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.image, styles.placeholderImage]}>
          <Text style={styles.placeholderText} weight="semibold">
            {category.name.charAt(0)}
          </Text>
        </View>
      )}

      <View style={styles.content}>
        <Text
          style={styles.name}
          weight="semibold"
          numberOfLines={2}>
          {category.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EFEFF5',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  image: {
    width: '100%',
    height: 110,
    backgroundColor: '#F3F0FF',
  },
  placeholderImage: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 28,
    color: colors.primary.main,
  },
  content: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  name: {
    fontSize: 14,
    color: '#1F1F2E',
    textAlign: 'center',
  },
});

export default CategoryCard;
