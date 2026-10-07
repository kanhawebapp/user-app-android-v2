import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Text } from '../../../components/Text';
import { colors } from '../../../theme';
import { API_BASE_URL } from '../../../constants/api.constants';
import { useGetService } from '../../../services/api/healingServices/getService/useGetService';
import { ServiceAstrologer } from '../../../services/api/healingServices/getServices/services.types';
import type { ServicePaymentData } from '../wallet/PaymentScreen';
import { useToast } from '../../../context/ToastContext';
import { GoBack } from '../../../components';

const BASE_IMAGE_URL = API_BASE_URL.DEVELOPMENT;
const GST_PERCENTAGE = 18;

interface SelectAstrologerScreenProps {
  service: {
    id: string;
    name: string;
    price: number;
    /** Slug of the selected service; used for the `GetService(slug)` call. */
    slug?: string;
    category?: {
      name: string;
    };
  } | null;
  onBack: () => void;
  onComplete: () => void;
  /** Hands the selected astrologer + service + amounts to the Payment Screen. */
  onContinueToPayment?: (data: ServicePaymentData) => void;
}

/**
 * An astrologer the user can pick for the selected service. It carries the
 * service-specific `ServiceAstrologer` join row alongside the astrologer
 * itself, so `id` stays the real astrologer id while the mapping id and the
 * service price remain available for the booking flow.
 */
type SelectableAstrologer = ServiceAstrologer & {
  serviceAstrologerMappingId: string;
  servicePrice: number;
};

/**
 * `BookingFormScreen` is no longer part of this flow: the booking is
 * created on ServiceDetailsScreen's "Confirm Booking"; this screen only
 * hands the selected astrologer + service data to the Payment Screen.
 */

const SelectAstrologerScreen: React.FC<
  SelectAstrologerScreenProps
> = ({
  service,
  onBack,
  onComplete,
  onContinueToPayment,
}) => {
    const [selectedAstrologer, setSelectedAstrologer] =
      useState<SelectableAstrologer | null>(null);

    const { showError } = useToast();

    // Single source of service details: `GetService(slug)` via the shared
    // GraphQL client. The slug comes from the service handed over by the
    // healing flow (a service list/card), so the `astrologerMappings` and
    // their service-specific prices always come from one centralized call.
    const {
      service: selectedService,
      loading: serviceLoading,
      refresh: refreshService,
    } = useGetService(service?.slug);

    const astrologers = useMemo<SelectableAstrologer[]>(
      () =>
        selectedService?.astrologerMappings
          ?.filter(mapping => mapping?.astrologer)
          ?.map(mapping => ({
            ...mapping.astrologer,
            serviceAstrologerMappingId: mapping.id,
            servicePrice: mapping.price,
          })) ?? [],
      [selectedService],
    );

    useEffect(() => {
      if (!selectedAstrologer && astrologers.length > 0) {
        setSelectedAstrologer(astrologers[0]);
      }
    }, [astrologers, selectedAstrologer]);

    const baseAmount =
      selectedAstrologer?.servicePrice ?? service?.price ?? 0;
    const gstAmount = (baseAmount * GST_PERCENTAGE) / 100;
    const totalAmount = baseAmount + gstAmount;

    // "Continue to Payment" only validates the selection and hands
    // the required service/astrologer/amount data to the Payment
    // Screen. The booking already exists (created on
    // ServiceDetailsScreen); the coupon verification, astrologer
    // assignment, order creation and Razorpay gateway are triggered
    // from the Payment Screen's final "Payment" button.
    const handleContinue = () => {
      if (!selectedAstrologer) {
        Alert.alert(
          'Selection Required',
          'Please select an astrologer to continue',
        );

        return;
      }

      if (!service?.id) {
        showError('Unable to continue. Please select a service again.');

        return;
      }

      onContinueToPayment?.({
        service: {
          id: service?.id ?? '',
          name: service?.name ?? '',
          price: service?.price ?? 0,
          slug: service?.slug,
          category: service?.category,
        },
        astrologer: selectedAstrologer,
        amount: baseAmount,
        gstAmount,
        totalAmount,
      });
    };

    const renderAstrologer = ({
      item,
    }: {
      item: SelectableAstrologer;
    }) => {
      const selected = selectedAstrologer?.id === item.id;

      return (
        <TouchableOpacity
          style={[
            styles.card,
            selected && styles.selectedCard,
          ]}
          onPress={() => setSelectedAstrologer(item)}
        >
          <Image
            source={{
              uri: `${BASE_IMAGE_URL}${item.profilePic}`,
            }}
            style={styles.avatar}
          />

          <View style={styles.infoContainer}>
            <View style={styles.nameRow}>
              <Text style={styles.name} weight="semibold">
                {item.displayName || item.name || 'Astrologer'}
              </Text>
              <View style={styles.metaRow}>
                <Text style={styles.cardPrice} weight="semibold">
                  ₹{item.servicePrice}
                </Text>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>
                    ⭐ {Number(item.rating || 0).toFixed(1)}
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.experience}>
              {item.experience} years experience
            </Text>

            <Text style={styles.detailLabel}>Skills:</Text>
            <Text style={styles.detailText} numberOfLines={1}>
              {item.skills?.join(', ') || 'Not specified'}
            </Text>

            <Text style={styles.detailLabel}>Languages:</Text>
            <Text style={styles.detailText} numberOfLines={1}>
              {item.languages?.join(', ') || 'Not specified'}
            </Text>
          </View>

          {selected && (
            <View style={styles.checkmark}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          )}
        </TouchableOpacity>
      );
    };

    return (
      <View style={styles.container}>
        {/* <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backIcon}>
          <Text style={styles.backIconText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} weight="semibold">
          Select Astrologer
        </Text>
      </View> */}

        <View style={styles.backButtonWrapper}>
          <GoBack onBack={onBack} title='Select Astrologer' />
        </View>

        {!!service && (
          <View style={styles.serviceSummary}>
            <View style={styles.serviceSummaryLeft}>
              <Text style={styles.serviceSummaryLabel} weight="medium">
                {service.category?.name || 'Service'}
              </Text>

              <Text
                style={styles.serviceSummaryName}
                weight="semibold"
                numberOfLines={1}>
                {service.name}
              </Text>
            </View>
          </View>
        )}

        <FlatList
          data={astrologers}
          keyExtractor={item => item.id}
          renderItem={renderAstrologer}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            serviceLoading ? (
              <View style={styles.emptyContainer}>
                <ActivityIndicator color={colors.primary.main} />
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No astrologers available
                </Text>
              </View>
            )
          )}
        />

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              !selectedAstrologer &&
              styles.disabledButton,
            ]}
            onPress={handleContinue}
            disabled={!selectedAstrologer}
          >
            <Text style={styles.continueText} weight="semibold">
              Continue to Payment
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FC',
  },
  backButtonWrapper: {
    position: 'absolute',
    // top: 10,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  backIcon: {
    marginRight: 16,
  },
  backIconText: {
    fontSize: 22,
    color: colors.primary.main,
  },
  headerTitle: {
    fontSize: 20,
    color: '#1F1F2E',
  },
  serviceSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  serviceSummaryLeft: {
    flex: 1,
    marginRight: 12,
  },
  serviceSummaryLabel: {
    fontSize: 12,
    color: colors.primary.main,
  },
  serviceSummaryName: {
    fontSize: 16,
    color: '#1F1F2E',
    marginTop: 2,
  },
  serviceSummaryPrice: {
    fontSize: 18,
    color: colors.primary.main,
  },
  listContent: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  selectedCard: {
    borderColor: colors.primary.main,
    borderWidth: 2,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 14,
    backgroundColor: '#F0F0F0',
  },
  infoContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    color: '#1F1F2E',
    flex: 1,
  },
  ratingBadge: {
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  cardPrice: {
    fontSize: 14,
    color: colors.primary.main,
    marginRight: 8,
  },
  ratingText: {
    fontSize: 12,
    color: '#FFA000',
  },
  experience: {
    fontSize: 12,
    color: '#6B6B80',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 11,
    color: '#888',
    marginTop: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#444',
    marginTop: 2,
  },
  checkmark: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.primary.main,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  priceBreakdown: {
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  priceLabel: {
    color: '#777',
    fontSize: 14,
  },
  priceRowValue: {
    color: '#1F1F2E',
    fontSize: 14,
  },
  priceDivider: {
    height: 1,
    backgroundColor: '#EFEFEF',
    marginVertical: 6,
  },
  priceTotalLabel: {
    color: '#1F1F2E',
    fontSize: 16,
  },
  priceTotalValue: {
    color: colors.primary.main,
    fontSize: 18,
  },
  continueButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 15,
    color: '#777',
  },
});

export default SelectAstrologerScreen;
