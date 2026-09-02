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

interface ServiceCardProps {
  service: {
    id: string;
    name: string;
    image?: string;
    description?: string;
    price: number;
    category?: {
      name: string;
    };
  };
  onPress: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.card}
      onPress={onPress}
    >
      <Image
        source={{
          uri: `${BASE_IMAGE_URL}${service.image}`,
        }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Text style={styles.name} weight="semibold">
          {service.name}
        </Text>

        <View style={styles.categoryRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText} weight="medium">
              {service.category?.name}
            </Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {service.description}
        </Text>

        <View style={styles.bottomRow}>
          {/* <Text style={styles.price} weight="semibold">
            ₹{service.price}
          </Text> */}

          <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText} weight="semibold">
              Book Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  image: {
    width: '100%',
    height: 160,
  },
  content: {
    padding: 14,
  },
  name: {
    fontSize: 17,
    color: '#1F1F2E',
  },
  categoryRow: {
    marginTop: 8,
  },
  categoryBadge: {
    backgroundColor: '#F3F0FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 12,
    color: colors.primary.main,
  },
  description: {
    marginTop: 10,
    fontSize: 13,
    color: '#6B6B80',
    lineHeight: 18,
  },
  bottomRow: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
  price: {
    fontSize: 18,
    color: colors.primary.main,
  },
  button: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
  },
});

export default ServiceCard;