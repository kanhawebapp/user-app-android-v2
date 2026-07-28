
import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { Text } from '../../../components/Text';
import { colors } from '../../../theme';
import { API_BASE_URL } from '../../../constants/api.constants';
import { GoBack } from '../../../components';

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

const ServiceDetailsScreen: React.FC<
  ServiceDetailsScreenProps
> = ({
  service,
  onBack,
  onConfirmBooking,
}) => {
    if (!service) {
      return null;
    }

    return (
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 120,
          }}>
          {/* Hero Section */}

          <View style={styles.heroContainer}>
            <Image
              source={{
                uri: `${BASE_IMAGE_URL}${service.image}`,
              }}
              style={styles.heroImage}
              resizeMode="cover"
            />

            <LinearGradient
              colors={[
                'transparent',
                'rgba(0,0,0,0.2)',
                'rgba(0,0,0,0.85)',
              ]}
              style={styles.gradient}
            />

            <View style={styles.backButtonWrapper}>
              <GoBack onBack={onBack} title='Booking Details' />
            </View>

            <View style={styles.heroContent}>
              <View style={styles.categoryBadge}>
                <Text
                  style={styles.categoryText}
                  weight="medium">
                  {service.category?.name}
                </Text>
              </View>

              <Text
                style={styles.heroTitle}
                weight="semibold">
                {service.name}
              </Text>

              <Text
                style={styles.heroPrice}
                weight="semibold">
                ₹{service.price}
              </Text>
            </View>
          </View>

          {/* Content */}

          <View style={styles.content}>
            {/* Overview Card */}

            <View style={styles.card}>
              <Text
                style={styles.cardTitle}
                weight="semibold">
                About Service
              </Text>

              <Text style={styles.description}>
                {service.description ||
                  'No description available'}
              </Text>
            </View>

            {/* Detailed Information */}

            {!!service.longText && (
              <View style={styles.card}>
                <Text
                  style={styles.cardTitle}
                  weight="semibold">
                  Detailed Information
                </Text> 

                <Text style={styles.longText}>
                  {service.longText}
                </Text>
              </View>
            )}

            {/* Highlights */}

            <View style={styles.card}>
              <Text
                style={styles.cardTitle}
                weight="semibold">
                Service Highlights
              </Text>

              <View style={styles.highlightItem}>
                <Text style={styles.highlightText}>
                  <Text style={{ color: colors.primary.main }}>✓</Text> Personalized Guidance
                </Text>
              </View>

              <View style={styles.highlightItem}>
                <Text style={styles.highlightText}>
                  <Text style={{ color: colors.primary.main }}>✓</Text>  Trusted Service
                </Text>
              </View>

              <View style={styles.highlightItem}>
                <Text style={styles.highlightText}>
                  <Text style={{ color: colors.primary.main }}>✓</Text>  Expert Consultation
                </Text>
              </View>

              <View style={styles.highlightItem}>
                <Text style={styles.highlightText}>
                  <Text style={{ color: colors.primary.main }}>✓</Text>  Confidential Process
                </Text>
              </View>
            </View>

            {/* Pricing Card */}

            <View style={styles.priceCard}>
              <Text
                style={styles.priceLabel}
                weight="medium">
                Service Price
              </Text>

              <Text
                style={styles.priceValue}
                weight="semibold"
              >
                ₹{service.price}
              </Text>

              <Text style={styles.priceNote}>
                One-time service booking fee
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Sticky Footer */}

        <View style={styles.footer}>
          <View>
            <Text style={styles.footerLabel}>
              Total Price
            </Text>

            <Text
              style={styles.footerPrice}
              weight="semibold">
              ₹{service.price}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={onConfirmBooking}>
            <Text
              style={styles.confirmButtonText}
              weight="semibold">
              Confirm Booking
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

export default ServiceDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FC',
  },

  heroContainer: {
    height: 340,
    position: 'relative',
  },

  heroImage: {
    width: '100%',
    height: '100%',
  },

  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },

  backButtonWrapper: {
    position: 'absolute',
    // top: 10,
    left: 0,
    right: 0,
    zIndex: 10,
  },

  heroContent: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
  },

  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 12,
  },

  categoryText: {
    color: '#FFF',
    fontSize: 13,
  },

  heroTitle: {
    fontSize: 22,
    color: '#FFF',
    marginBottom: 8,
  },

  heroPrice: {
    fontSize: 20,
    color: '#FFF',
  },

  content: {
    padding: 16,
  },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 3,
  },

  cardTitle: {
    fontSize: 18,
    color: '#1F1F2E',
    marginBottom: 14,
  },

  description: {
    fontSize: 15,
    // lineHeight: 24,
    color: '#666',
  },

  longText: {
    fontSize: 15,
    // lineHeight: 24,
    color: '#555',
  },

  highlightItem: {
    paddingVertical: 8,
  },

  highlightText: {
    fontSize: 15,
    color: '#444',
  },

  priceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ECECEC',
  },

  priceLabel: {
    color: '#777',
    fontSize: 14,
  },

  priceValue: {
    fontSize: 22,
    color:colors.primary.main,
    marginTop: 10,
  },

  priceNote: {
    marginTop: 8,
    color: '#888',
    fontSize: 13,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,

    backgroundColor: '#FFF',

    paddingHorizontal: 20,
    paddingVertical: 16,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    borderTopWidth: 1,
    borderTopColor: '#EEE',

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: -4,
    },

    elevation: 10,
  },

  footerLabel: {
    color: '#777',
    fontSize: 13,
  },

  footerPrice: {
    color: colors.primary.main,
    fontSize: 24,
  },

  confirmButton: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 16,
  },

  confirmButtonText: {
    color: '#FFF',
    fontSize: 15,
  },
});

