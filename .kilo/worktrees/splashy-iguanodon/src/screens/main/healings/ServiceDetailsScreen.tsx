import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { Text } from '../../../components/Text';
import { colors } from '../../../theme';
import { API_BASE_URL } from '../../../constants/api.constants';

const BASE_IMAGE_URL = API_BASE_URL.DEVELOPMENT;

interface Service {
  id: string;
  name: string;
  image?: string;
  description?: string;
  longText?: string;
  price: number;
  category?: {
    name: string;
  };
}

interface ServiceDetailsScreenProps {
  service: Service | null;
  onBack: () => void;
  onConfirmBooking: () => void;
}

const ServiceDetailsScreen: React.FC<ServiceDetailsScreenProps> = ({
  service,
  onBack,
  onConfirmBooking,
}) => {
  if (!service) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={{
            uri: `${BASE_IMAGE_URL}${service.image}`,
          }}
          style={styles.heroImage}
          resizeMode="cover"
        />

        <View style={styles.content}>
          <Text style={styles.title} weight="semibold">
            {service.name}
          </Text>

          <View style={styles.metaRow}>
            <Text style={styles.category} weight="medium">
              {service.category?.name}
            </Text>
            <Text style={styles.price} weight="semibold">
              ₹{service.price}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle} weight="semibold">
              About Service
            </Text>
            <Text style={styles.description}>
              {service.description}
            </Text>
          </View>

          {service.longText && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle} weight="semibold">
                Detailed Information
              </Text>
              <Text style={styles.longText}>
                {service.longText}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={onConfirmBooking}
        >
          <Text style={styles.confirmButtonText} weight="semibold">
            Confirm Booking
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
        >
          <Text style={styles.backButtonText} weight="medium">
            ← Back to Services
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heroImage: {
    width: '100%',
    height: 280,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    color: '#1F1F2E',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  category: {
    fontSize: 14,
    color: colors.primary.main,
  },
  price: {
    fontSize: 22,
    color: '#22A45D',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#1F1F2E',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#6B6B80',
    lineHeight: 22,
  },
  longText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  confirmButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  backButtonText: {
    color: colors.primary.main,
    fontSize: 15,
  },
});

export default ServiceDetailsScreen;